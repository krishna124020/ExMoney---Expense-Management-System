import React, { useState, useMemo } from 'react';
import { Download, Printer, FileText, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useTransactions } from '../../context/TransactionsContext';
import { useBudgets } from '../../context/BudgetsContext';
import { useAccounts } from '../../context/AccountsContext';
import { useCategories } from '../../context/CategoriesContext';
import { getTransactionsByPeriod } from '../../data/mockData';
import { format, parseISO } from 'date-fns';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.abs(amount));
};

export const Reports = () => {
  const { transactions, isLoading: txsLoading, error: txsError, fetchTransactions } = useTransactions();
  const { budgets, isLoading: budgetsLoading, error: budgetsError, fetchBudgets } = useBudgets();
  const { accounts, isLoading: accountsLoading, error: accountsError, fetchAccounts } = useAccounts();
  const { categories, isLoading: catsLoading, error: catsError, fetchCategories } = useCategories();
  
  const isLoading = txsLoading || budgetsLoading || accountsLoading || catsLoading;
  const loadingError = txsError || budgetsError || accountsError || catsError;

  const retryLoading = () => {
    if (txsError) fetchTransactions();
    if (budgetsError) fetchBudgets();
    if (accountsError) fetchAccounts();
    if (catsError) fetchCategories();
  };
  
  const [period, setPeriod] = useState('this-month');

  // Filter transactions
  const periodTransactions = useMemo(() => {
    return getTransactionsByPeriod(period, transactions);
  }, [period, transactions]);

  // General Aggregation
  const {
    totalIncome,
    totalExpenses,
    netCashFlow,
    expenseTransactions,
    incomeTransactions
  } = useMemo(() => {
    const expenses = periodTransactions.filter(tx => tx.type === 'expense');
    const incomes = periodTransactions.filter(tx => tx.type === 'income');

    const totalExp = expenses.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const totalInc = incomes.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const netFlow = totalInc - totalExp;

    return {
      totalIncome: totalInc,
      totalExpenses: totalExp,
      netCashFlow: netFlow,
      expenseTransactions: expenses,
      incomeTransactions: incomes
    };
  }, [periodTransactions]);

  // Expense by Category
  const expenseByCategory = useMemo(() => {
    const map = {};
    expenseTransactions.forEach(tx => {
      if (!map[tx.category]) map[tx.category] = { name: tx.category, count: 0, amount: 0 };
      map[tx.category].count += 1;
      map[tx.category].amount += Number(tx.amount);
    });
    return Object.values(map)
      .sort((a, b) => b.amount - a.amount)
      .map(item => ({
        ...item,
        percentage: totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0
      }));
  }, [expenseTransactions, totalExpenses]);

  // Income by Category
  const incomeByCategory = useMemo(() => {
    const map = {};
    incomeTransactions.forEach(tx => {
      if (!map[tx.category]) map[tx.category] = { name: tx.category, count: 0, amount: 0 };
      map[tx.category].count += 1;
      map[tx.category].amount += Number(tx.amount);
    });
    return Object.values(map)
      .sort((a, b) => b.amount - a.amount)
      .map(item => ({
        ...item,
        percentage: totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0
      }));
  }, [incomeTransactions, totalIncome]);

  // Account / Payment Summary
  const accountSummary = useMemo(() => {
    const map = {};
    // Pre-populate with all accounts so even 0 balance accounts might show up, or just dynamically build it.
    // Dynamically building based on transactions to only show active ones.
    periodTransactions.forEach(tx => {
      let accName = 'Unknown';
      if (tx.paymentMethod === 'Cash') {
        accName = 'Cash';
      } else {
        const acc = accounts.find(a => a.id === tx.accountId);
        if (acc) {
          accName = acc.bankName ? `${acc.bankName} (${acc.name})` : acc.name;
        } else {
          accName = tx.paymentMethod;
        }
      }

      if (!map[accName]) map[accName] = { name: accName, income: 0, expense: 0 };
      
      if (tx.type === 'expense') {
        map[accName].expense += Number(tx.amount);
      } else {
        map[accName].income += Number(tx.amount);
      }
    });
    return Object.values(map).sort((a, b) => (b.income + b.expense) - (a.income + a.expense));
  }, [periodTransactions, accounts]);

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

  // Transactions Summary Stats
  const largestExpense = useMemo(() => {
    if (expenseTransactions.length === 0) return null;
    return [...expenseTransactions].sort((a, b) => Number(b.amount) - Number(a.amount))[0];
  }, [expenseTransactions]);

  const largestIncome = useMemo(() => {
    if (incomeTransactions.length === 0) return null;
    return [...incomeTransactions].sort((a, b) => Number(b.amount) - Number(a.amount))[0];
  }, [incomeTransactions]);

  // Date-Based Activity
  const chronologicalActivity = useMemo(() => {
    return [...periodTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [periodTransactions]);

  const hasData = periodTransactions.length > 0;

  const handleExportCSV = () => {
    alert("Exporting to CSV requires a backend connection. This feature is not available in the frontend-only environment.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-2) 0' }}>Reports</h1>
          <p className="text-muted" style={{ margin: 0 }}>Review detailed summaries of your financial activity.</p>
        </div>
        <div className="print-hide" style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
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
          <Button variant="outline" onClick={handleExportCSV}>
            <Download size={18} style={{ marginRight: '8px' }} /> Export CSV
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer size={18} style={{ marginRight: '8px' }} /> Print
          </Button>
        </div>
      </div>

      {loadingError ? (
        <ErrorState title="Failed to Load Reports" message={loadingError} onRetry={retryLoading} />
      ) : isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Skeleton height="150px" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
            <Skeleton height="300px" />
            <Skeleton height="300px" />
          </div>
        </div>
      ) : !hasData ? (
        <div className="state-container" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-12) var(--space-4)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <FileText size={32} />
          </div>
          <h3 className="h3" style={{ marginBottom: 'var(--space-2)' }}>No data for this period</h3>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0 0 var(--space-6) 0' }}>Reports will generate automatically once you record financial activity for the selected date range.</p>
          <Button variant="primary" onClick={() => window.location.href = '/dashboard/transactions'}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Add Transaction
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* 1. Report Summary KPIs */}
          <div className="kpi-grid">
            <div className="stat-card">
              <h3 className="stat-card-title">Total Income</h3>
              <div className="stat-card-value" style={{ color: 'var(--color-primary)' }}>{formatCurrency(totalIncome)}</div>
            </div>
            <div className="stat-card">
              <h3 className="stat-card-title">Total Expenses</h3>
              <div className="stat-card-value" style={{ color: 'var(--color-danger)' }}>{formatCurrency(totalExpenses)}</div>
            </div>
            <div className="stat-card">
              <h3 className="stat-card-title">Net Cash Flow</h3>
              <div className="stat-card-value">{formatCurrency(netCashFlow)}</div>
            </div>
            <div className="stat-card">
              <h3 className="stat-card-title">Savings</h3>
              <div className="stat-card-value">{formatCurrency(netCashFlow)}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
            
            {/* 2. Income & Expense Summary */}
            <div className="dashboard-card">
              <h3 className="h3" style={{ marginBottom: 'var(--space-4)' }}>Activity Summary</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>Total Income</td>
                      <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)', textAlign: 'right', color: 'var(--color-primary)', fontWeight: 500 }}>{formatCurrency(totalIncome)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>Total Expenses</td>
                      <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)', textAlign: 'right', color: 'var(--color-danger)', fontWeight: 500 }}>{formatCurrency(totalExpenses)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>Net Cash Flow</td>
                      <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(netCashFlow)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0', color: 'var(--color-text-muted)' }}>Income Transactions</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--color-text-muted)' }}>{incomeTransactions.length}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0', color: 'var(--color-text-muted)' }}>Expense Transactions</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--color-text-muted)' }}>{expenseTransactions.length}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Transaction Summary */}
            <div className="dashboard-card">
              <h3 className="h3" style={{ marginBottom: 'var(--space-4)' }}>Transaction Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted">Total Transactions</span>
                  <span style={{ fontWeight: 500 }}>{periodTransactions.length}</span>
                </div>
                
                {largestExpense && (
                  <div>
                    <div className="text-muted" style={{ marginBottom: '4px', fontSize: '0.875rem' }}>Largest Expense</div>
                    <div style={{ padding: '12px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 500 }}>{largestExpense.name}</span>
                        <span style={{ color: 'var(--color-danger)', fontWeight: 500 }}>{formatCurrency(largestExpense.amount)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        <span>{largestExpense.category}</span>
                        <span>{format(parseISO(largestExpense.date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {largestIncome && (
                  <div>
                    <div className="text-muted" style={{ marginBottom: '4px', fontSize: '0.875rem' }}>Largest Income</div>
                    <div style={{ padding: '12px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 500 }}>{largestIncome.name}</span>
                        <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{formatCurrency(largestIncome.amount)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        <span>{largestIncome.category}</span>
                        <span>{format(parseISO(largestIncome.date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)' }}>
            
            {/* 4. Expense Report */}
            <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="h3" style={{ marginBottom: 'var(--space-4)' }}>Expense Report</h3>
              {expenseByCategory.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 0', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>Category</th>
                        <th style={{ padding: '12px 0', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'center' }}>Count</th>
                        <th style={{ padding: '12px 0', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'right' }}>Amount</th>
                        <th style={{ padding: '12px 0', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'right' }}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseByCategory.map(cat => (
                        <tr key={cat.name}>
                          <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)', fontWeight: 500 }}>{cat.name}</td>
                          <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>{cat.count}</td>
                          <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)', textAlign: 'right' }}>{formatCurrency(cat.amount)}</td>
                          <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)', textAlign: 'right' }}>{cat.percentage.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted" style={{ padding: 'var(--space-4) 0' }}>No expenses recorded.</div>
              )}
            </div>

            {/* 5. Income Report */}
            <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="h3" style={{ marginBottom: 'var(--space-4)' }}>Income Report</h3>
              {incomeByCategory.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 0', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>Category</th>
                        <th style={{ padding: '12px 0', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'center' }}>Count</th>
                        <th style={{ padding: '12px 0', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'right' }}>Amount</th>
                        <th style={{ padding: '12px 0', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'right' }}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeByCategory.map(cat => (
                        <tr key={cat.name}>
                          <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)', fontWeight: 500 }}>{cat.name}</td>
                          <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>{cat.count}</td>
                          <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)', textAlign: 'right' }}>{formatCurrency(cat.amount)}</td>
                          <td style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)', textAlign: 'right' }}>{cat.percentage.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted" style={{ padding: 'var(--space-4) 0' }}>No income recorded.</div>
              )}
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)' }}>
            
            {/* 6. Account / Payment Summary */}
            <div className="dashboard-card">
              <h3 className="h3" style={{ marginBottom: 'var(--space-4)' }}>Account Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {accountSummary.map(acc => (
                  <div key={acc.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 600 }}>{acc.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span className="text-muted">Income: <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{formatCurrency(acc.income)}</span></span>
                      <span className="text-muted">Expenses: <span style={{ color: 'var(--color-danger)', fontWeight: 500 }}>{formatCurrency(acc.expense)}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Budget Report */}
            <div className="dashboard-card">
              <h3 className="h3" style={{ marginBottom: 'var(--space-4)' }}>Budget Report</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {budgetPerformance.length > 0 ? budgetPerformance.map(budget => (
                  <div key={budget.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ fontWeight: 600 }}>{budget.category}</span>
                      <span>{formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}</span>
                    </div>
                    <ProgressBar percentage={budget.percentage} color={budget.color} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: budget.color }}>{budget.status}</span>
                      <span className="text-muted">Remaining: {formatCurrency(Math.max(0, budget.remaining))}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-muted">No budgets configured.</div>
                )}
              </div>
            </div>

          </div>

          {/* 8. Date-Based Report */}
          <div className="dashboard-card" style={{ overflowX: 'auto' }}>
            <h3 className="h3" style={{ marginBottom: 'var(--space-4)' }}>Activity Log</h3>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 8px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>Date</th>
                  <th style={{ padding: '12px 8px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>Transaction</th>
                  <th style={{ padding: '12px 8px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>Category</th>
                  <th style={{ padding: '12px 8px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>Account/Payment</th>
                  <th style={{ padding: '12px 8px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {chronologicalActivity.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px 8px' }}>{format(parseISO(tx.date), 'MMM dd, yyyy')}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 500 }}>{tx.name}</td>
                    <td style={{ padding: '12px 8px' }}>{tx.category}</td>
                    <td style={{ padding: '12px 8px' }}>{tx.paymentMethod === 'Bank Account' ? 'Bank' : tx.paymentMethod}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? 'var(--color-primary)' : 'var(--color-text)' }}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};
