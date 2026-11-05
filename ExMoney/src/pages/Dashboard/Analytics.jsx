import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { BarChart3, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useTransactions } from '../../context/TransactionsContext';
import { useBudgets } from '../../context/BudgetsContext';
import { getTransactionsByPeriod } from '../../data/mockData';
import { format, parseISO, isSameDay } from 'date-fns';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const COLORS = ['#0ea5e9', '#8b5cf6', '#f43f5e', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#84cc16'];

export const Analytics = () => {
  const { transactions, isLoading: txsLoading, error: txsError, fetchTransactions } = useTransactions();
  const { budgets, isLoading: budgetsLoading, error: budgetsError, fetchBudgets } = useBudgets();
  const [period, setPeriod] = useState('this-month');
  
  const isLoading = txsLoading || budgetsLoading;
  const loadingError = txsError || budgetsError;

  const retryLoading = () => {
    if (txsError) fetchTransactions();
    if (budgetsError) fetchBudgets();
  };

  // Filter transactions for the selected period
  const periodTransactions = useMemo(() => {
    return getTransactionsByPeriod(period, transactions);
  }, [period, transactions]);

  // Derived Statistics
  const {
    totalIncome,
    totalExpenses,
    netCashFlow,
    savingsRate,
    expenseTransactions,
    incomeTransactions
  } = useMemo(() => {
    const expenses = periodTransactions.filter(tx => tx.type === 'expense');
    const incomes = periodTransactions.filter(tx => tx.type === 'income');

    const totalExp = expenses.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const totalInc = incomes.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const netFlow = totalInc - totalExp;
    
    let rate = 0;
    if (totalInc > 0) {
      rate = Math.max(0, (netFlow / totalInc) * 100);
    }

    return {
      totalIncome: totalInc,
      totalExpenses: totalExp,
      netCashFlow: netFlow,
      savingsRate: rate,
      expenseTransactions: expenses,
      incomeTransactions: incomes
    };
  }, [periodTransactions]);

  // Income vs Expense Data
  const incomeVsExpenseData = [
    { name: 'Income', amount: totalIncome, fill: 'var(--color-primary)' },
    { name: 'Expenses', amount: totalExpenses, fill: 'var(--color-danger)' }
  ];

  // Spending by Category Data
  const { categoryData, topCategories } = useMemo(() => {
    const catMap = {};
    expenseTransactions.forEach(tx => {
      catMap[tx.category] = (catMap[tx.category] || 0) + Number(tx.amount);
    });

    const data = Object.keys(catMap).map(category => ({
      name: category,
      value: catMap[category]
    })).sort((a, b) => b.value - a.value);

    return {
      categoryData: data,
      topCategories: data.slice(0, 5) // top 5
    };
  }, [expenseTransactions]);

  // Income Breakdown Data
  const incomeBreakdownData = useMemo(() => {
    const catMap = {};
    incomeTransactions.forEach(tx => {
      catMap[tx.category] = (catMap[tx.category] || 0) + Number(tx.amount);
    });

    return Object.keys(catMap).map(category => ({
      name: category,
      value: catMap[category]
    })).sort((a, b) => b.value - a.value);
  }, [incomeTransactions]);

  // Spending Trend Data (Group by date)
  const spendingTrendData = useMemo(() => {
    const dateMap = {};
    expenseTransactions.forEach(tx => {
      const dateStr = tx.date.split('T')[0];
      dateMap[dateStr] = (dateMap[dateStr] || 0) + Number(tx.amount);
    });

    return Object.keys(dateMap)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(dateStr => ({
        date: format(parseISO(dateStr), 'MMM dd'),
        amount: dateMap[dateStr]
      }));
  }, [expenseTransactions]);

  // Budget Performance
  const budgetPerformance = useMemo(() => {
    return budgets.map(budget => {
      const spent = expenseTransactions
        .filter(tx => tx.category === budget.category)
        .reduce((sum, tx) => sum + Number(tx.amount), 0);
      
      const remaining = budget.amount - spent;
      const percentage = Math.min((spent / budget.amount) * 100, 100);
      
      let status = 'On Track';
      let color = 'var(--color-secondary)';
      
      if (spent >= budget.amount) {
        status = 'Over Budget';
        color = 'var(--color-danger)';
      } else if (percentage >= 80) {
        status = 'Near Limit';
        color = 'var(--color-warning)';
      }

      return {
        ...budget,
        spent,
        remaining,
        percentage,
        status,
        color
      };
    });
  }, [budgets, expenseTransactions]);

  // Financial Insights Generation
  const insights = useMemo(() => {
    const messages = [];

    // Top expense insight
    if (topCategories.length > 0 && totalExpenses > 0) {
      const topCat = topCategories[0];
      const pct = Math.round((topCat.value / totalExpenses) * 100);
      messages.push(`${topCat.name} accounted for ${pct}% of your expenses this period.`);
    }

    // Cash flow insight
    if (totalIncome > 0 && totalExpenses > 0) {
      if (totalExpenses > totalIncome) {
        messages.push(`Your expenses were ${formatCurrency(totalExpenses - totalIncome)} higher than your income.`);
      } else {
        messages.push(`Your expenses were ${formatCurrency(totalIncome - totalExpenses)} lower than your income.`);
      }
    }

    // Budget insight
    const overBudgets = budgetPerformance.filter(b => b.status === 'Over Budget');
    if (overBudgets.length > 0) {
      messages.push(`You have exceeded your budget in ${overBudgets.length} categor${overBudgets.length === 1 ? 'y' : 'ies'}.`);
    } else if (budgetPerformance.length > 0) {
      messages.push('All your tracked budgets are currently on track.');
    }

    return messages;
  }, [topCategories, totalExpenses, totalIncome, budgetPerformance]);


  const hasData = periodTransactions.length > 0;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-2) 0' }}>Analytics</h1>
          <p className="text-muted" style={{ margin: 0 }}>Understand your spending, income, and financial trends.</p>
        </div>
        <Select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
          <option value="last-30-days">Last 30 Days</option>
          <option value="this-year">This Year</option>
          <option value="all-time">All Time</option>
        </Select>
      </div>

      {loadingError ? (
        <ErrorState title="Failed to Load Analytics" message={loadingError} onRetry={retryLoading} />
      ) : isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
          <Skeleton height="350px" />
          <Skeleton height="350px" />
        </div>
      ) : !hasData ? (
        <div className="state-container" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-12) var(--space-4)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <BarChart3 size={32} />
          </div>
          <h3 className="h3" style={{ marginBottom: 'var(--space-2)' }}>Not enough data yet</h3>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0 0 var(--space-6) 0' }}>Add a few transactions to see your financial analytics, insights, and trends.</p>
          <Button variant="primary" onClick={() => window.location.href = '/dashboard/transactions'}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Add Transaction
          </Button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="kpi-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <div><h3 className="stat-card-title">Total Income</h3></div>
              </div>
              <div className="stat-card-value" style={{ color: 'var(--color-primary)' }}>
                {formatCurrency(totalIncome)}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <div><h3 className="stat-card-title">Total Expenses</h3></div>
              </div>
              <div className="stat-card-value" style={{ color: 'var(--color-danger)' }}>
                {formatCurrency(totalExpenses)}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <div><h3 className="stat-card-title">Net Cash Flow</h3></div>
              </div>
              <div className="stat-card-value">
                {formatCurrency(netCashFlow)}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <div><h3 className="stat-card-title">Savings Rate</h3></div>
              </div>
              <div className="stat-card-value">
                {savingsRate.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
            
            {/* Income vs Expenses Bar Chart */}
            <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="h3" style={{ marginBottom: 'var(--space-6)' }}>Income vs Expenses</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={incomeVsExpenseData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Spending by Category Pie Chart */}
            <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="h3" style={{ marginBottom: 'var(--space-6)' }}>Spending by Category</h3>
              {categoryData.length > 0 ? (
                <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                  No expenses to show.
                </div>
              )}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
            
            {/* Spending Trend Line Chart */}
            <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="h3" style={{ marginBottom: 'var(--space-6)' }}>Spending Trend</h3>
              {spendingTrendData.length > 1 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={spendingTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} minTickGap={20} />
                      <YAxis hide />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                      />
                      <Line type="monotone" dataKey="amount" stroke="var(--color-danger)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                  Not enough data points for a trend line.
                </div>
              )}
            </div>

            {/* Financial Insights */}
            <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="h3" style={{ marginBottom: 'var(--space-6)' }}>Financial Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {insights.map((insight, idx) => (
                  <div key={idx} style={{ 
                    padding: 'var(--space-4)', 
                    backgroundColor: 'var(--color-background)', 
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--color-primary)'
                  }}>
                    {insight}
                  </div>
                ))}
                {insights.length === 0 && (
                  <div className="text-muted">Not enough data to generate insights for this period.</div>
                )}
              </div>
            </div>

          </div>

          {/* Lists Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
            
            {/* Top Categories */}
            <div className="dashboard-card">
              <h3 className="h3" style={{ marginBottom: 'var(--space-6)' }}>Top Expenses</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {topCategories.length > 0 ? topCategories.map((cat, index) => (
                  <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }} />
                      <span style={{ fontWeight: 500 }}>{cat.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div>{formatCurrency(cat.value)}</div>
                      <div className="text-muted text-sm">{Math.round((cat.value / totalExpenses) * 100)}%</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-muted">No expenses in this period.</div>
                )}
              </div>
            </div>

            {/* Income Breakdown */}
            <div className="dashboard-card">
              <h3 className="h3" style={{ marginBottom: 'var(--space-6)' }}>Income Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {incomeBreakdownData.length > 0 ? incomeBreakdownData.map((cat) => (
                  <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500 }}>{cat.name}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div>{formatCurrency(cat.value)}</div>
                      <div className="text-muted text-sm">{Math.round((cat.value / totalIncome) * 100)}%</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-muted">No income in this period.</div>
                )}
              </div>
            </div>

            {/* Budget Performance */}
            <div className="dashboard-card">
              <h3 className="h3" style={{ marginBottom: 'var(--space-6)' }}>Budget Performance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {budgetPerformance.length > 0 ? budgetPerformance.map(budget => (
                  <div key={budget.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ fontWeight: 500 }}>{budget.category}</span>
                      <span>{formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}</span>
                    </div>
                    <ProgressBar percentage={budget.percentage} color={budget.color} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: budget.color }}>{budget.status}</span>
                      <span className="text-muted">{Math.round(budget.percentage)}% used</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-muted">No budgets configured.</div>
                )}
              </div>
            </div>

          </div>

        </>
      )}
    </div>
  );
};
