import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationsContext';
import { useTransactions } from '../../context/TransactionsContext';
import { useBudgets } from '../../context/BudgetsContext';
import { useGoals } from '../../context/GoalsContext';
import { useScheduledTransactions } from '../../context/ScheduledTransactionsContext';
import { isTomorrow, parseISO, format } from 'date-fns';

export const NotificationEngine = () => {
  const { addNotification } = useNotifications();
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { goals, futureSavings } = useGoals();
  const { scheduledTransactions } = useScheduledTransactions();

  const prevTransactionsLength = useRef(transactions.length);
  const prevGoalsStr = useRef(JSON.stringify(goals));
  const prevFutureSavingsTotal = useRef(futureSavings.total);
  const notifiedBudgets = useRef({}); // tracks which budgets have sent 80% or 100% alerts recently to avoid spam
  const checkedSchedules = useRef(false);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    // 1. Transaction Added
    if (transactions.length > prevTransactionsLength.current) {
      const newTx = transactions[0]; // Assuming newest is first, or we can check difference
      // Better to check difference, but let's assume transactions are prepended or we just take the first one if length increased
      const latestTx = transactions.reduce((latest, current) => 
        new Date(current.date) > new Date(latest.date) ? current : latest
      , transactions[0]);

      if (latestTx) {
        addNotification({
          category: 'Transactions',
          title: latestTx.type === 'expense' ? 'Expense added' : 'Income added',
          message: `Your ₹${latestTx.amount} ${latestTx.category} ${latestTx.type} was added.`,
          actionLink: '/dashboard/transactions'
        });

        // Check Budgets
        if (latestTx.type === 'expense') {
          const budget = budgets.find(b => b.category === latestTx.category);
          if (budget) {
            // Calculate total spent for this budget's category in the current month
            const currentMonthTxs = transactions.filter(t => {
              const txDate = new Date(t.date);
              const now = new Date();
              return t.type === 'expense' && 
                     t.category === latestTx.category &&
                     txDate.getMonth() === now.getMonth() &&
                     txDate.getFullYear() === now.getFullYear();
            });
            const spent = currentMonthTxs.reduce((sum, t) => sum + t.amount, 0);
            const percentage = (spent / budget.amount) * 100;
            
            const budgetKey = `${budget.id}-${new Date().getMonth()}`;
            const sentState = notifiedBudgets.current[budgetKey] || 0;

            if (percentage >= 100 && sentState < 100) {
              addNotification({
                category: 'Budgets',
                title: 'Budget exceeded',
                message: `Your ${budget.category} budget has exceeded its ₹${budget.amount} limit.`,
                actionLink: '/dashboard/budgets'
              });
              notifiedBudgets.current[budgetKey] = 100;
            } else if (percentage >= 80 && percentage < 100 && sentState < 80) {
              addNotification({
                category: 'Budgets',
                title: 'Budget near limit',
                message: `Your ${budget.category} budget is ${percentage.toFixed(0)}% used.`,
                actionLink: '/dashboard/budgets'
              });
              notifiedBudgets.current[budgetKey] = 80;
            }
          }
        }
      }
    }
    prevTransactionsLength.current = transactions.length;

    // 2. Goals Check
    const prevGoals = JSON.parse(prevGoalsStr.current);
    goals.forEach(goal => {
      const prevGoal = prevGoals.find(g => g.id === goal.id);
      if (prevGoal) {
        if (goal.savedAmount > prevGoal.savedAmount) {
          if (goal.savedAmount >= goal.targetAmount && prevGoal.savedAmount < goal.targetAmount) {
            addNotification({
              category: 'Goals',
              title: 'Goal completed',
              message: `Your ${goal.name} goal has reached its ₹${goal.targetAmount} target.`,
              actionLink: '/dashboard/goals'
            });
          } else {
            const progress = ((goal.savedAmount / goal.targetAmount) * 100).toFixed(0);
            const prevProgress = ((prevGoal.savedAmount / goal.targetAmount) * 100).toFixed(0);
            
            // Only notify if crossed a 25% boundary (25, 50, 75) to avoid spam
            if (progress >= 25 && prevProgress < 25 || progress >= 50 && prevProgress < 50 || progress >= 75 && prevProgress < 75) {
              addNotification({
                category: 'Goals',
                title: 'Goal progress',
                message: `Your ${goal.name} is now ${progress}% complete.`,
                actionLink: '/dashboard/goals'
              });
            }
          }
        }
      }
    });
    prevGoalsStr.current = JSON.stringify(goals);

    // 3. Future Savings Check
    if (futureSavings.total > prevFutureSavingsTotal.current) {
      const added = futureSavings.total - prevFutureSavingsTotal.current;
      addNotification({
        category: 'Future Savings',
        title: 'Future Savings updated',
        message: `₹${added.toLocaleString('en-IN')} was added to Future Savings.`,
        actionLink: '/dashboard/goals'
      });
    }
    prevFutureSavingsTotal.current = futureSavings.total;

    // 4. Scheduled Transactions (Run once on mount or when schedules load to check upcoming)
    if (!checkedSchedules.current && scheduledTransactions.length > 0) {
      scheduledTransactions.forEach(tx => {
        // If it's a one-time transaction tomorrow
        if (tx.frequency === 'once' && tx.date) {
          if (isTomorrow(parseISO(tx.date))) {
            addNotification({
              category: 'Calendar',
              title: 'Upcoming transaction',
              message: `₹${tx.amount.toLocaleString('en-IN')} ${tx.title} is scheduled for tomorrow.`,
              actionLink: '/dashboard/calendar'
            });
          }
        } else if (tx.frequency === 'monthly' && tx.dayOfMonth) {
          // If it's recurring and happens tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (tomorrow.getDate() === tx.dayOfMonth) {
            addNotification({
              category: 'Calendar',
              title: 'Recurring transaction',
              message: `Your monthly ${tx.title} is scheduled for ${format(tomorrow, 'MMM d')}.`,
              actionLink: '/dashboard/calendar'
            });
          }
        }
      });
      checkedSchedules.current = true;
    }

  }, [transactions, budgets, goals, futureSavings, scheduledTransactions, addNotification]);

  return null; // Headless component
};
