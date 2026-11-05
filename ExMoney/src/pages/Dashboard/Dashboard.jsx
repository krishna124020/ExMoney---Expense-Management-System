import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Wallet, 
  ArrowDownRight, 
  ArrowUpRight, 
  TrendingUp, 
  Plus,
  Calendar,
  ChevronRight,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { 
  getTransactionsByPeriod,
  calculateKPIs,
  getChartData,
  getCategoryData,
  getPeriodLabel
} from '../../data/mockData';
import { useScheduledTransactions } from '../../context/ScheduledTransactionsContext';
import { getOccurrencesForMonth } from '../../utils/calendarUtils';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../../context/AccountsContext';
import { useTransactions } from '../../context/TransactionsContext';
import './Dashboard.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.abs(amount));
};

import { ActualTransactionModal } from './components/ActualTransactionModal';

const StatCard = ({ title, value, trend, isPositive, icon: Icon, subtitle, action, onIconClick }) => (
  <div className="stat-card" style={{ position: 'relative', zIndex: action ? 50 : 1 }}>
    <div className="stat-card-header">
      <div>
        <h3 className="stat-card-title">{title}</h3>
        {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
        <div 
          className="stat-card-icon" 
          onClick={onIconClick}
          style={{ cursor: onIconClick ? 'pointer' : 'default' }}
        >
          <Icon size={20} />
        </div>
        {action}
      </div>
    </div>
    <div className="stat-card-value">
      {title === 'Net Cash Flow' && (isPositive ? '+' : '-')}
      {formatCurrency(value)}
    </div>
    <div className={`stat-card-trend ${isPositive ? 'positive' : 'negative'}`}>
      {isPositive ? '↑' : '↓'} {Math.abs(trend)}% from previous
    </div>
  </div>
);


export const Dashboard = () => {
  const [period, setPeriod] = useState('this-month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { scheduledTransactions, isLoading: scheduledIsLoading, error: scheduledError, fetchScheduledTransactions } = useScheduledTransactions();
  const { updateAccountBalance, totalAvailableBalance, accounts, isLoading: accountsIsLoading, error: accountsError, fetchAccounts } = useAccounts();
  const { transactions: contextTransactions, addTransaction, isLoading: transactionsIsLoading, error: transactionsError, fetchTransactions } = useTransactions();
  const [balanceFilter, setBalanceFilter] = useState('all');
  const [isBalanceDropdownOpen, setIsBalanceDropdownOpen] = useState(false);

  const isDashboardLoading = scheduledIsLoading || accountsIsLoading || transactionsIsLoading;
  const dashboardError = scheduledError || accountsError || transactionsError;

  const retryDashboard = () => {
    if (scheduledError) fetchScheduledTransactions();
    if (accountsError) fetchAccounts();
    if (transactionsError) fetchTransactions();
  };

  const availableProviders = useMemo(() => {
    const providers = new Set();
    accounts.forEach(acc => {
      if (acc.accountType === 'Cash') providers.add('Cash');
      else if (acc.bankName) providers.add(acc.bankName);
    });
    return Array.from(providers);
  }, [accounts]);

  const transactions = useMemo(() => getTransactionsByPeriod(period, contextTransactions), [period, contextTransactions]);
  const kpis = useMemo(() => calculateKPIs(period, contextTransactions), [period, contextTransactions]);
  const categoryData = useMemo(() => getCategoryData(transactions), [transactions]);
  const chartData = useMemo(() => getChartData(contextTransactions), [contextTransactions]); 
  const periodLabel = getPeriodLabel(period);

  const filteredBalanceValue = useMemo(() => {
    if (balanceFilter === 'all') return totalAvailableBalance;
    
    let sum = 0;
    accounts.forEach(acc => {
      if (balanceFilter === 'Cash' && acc.accountType === 'Cash') {
        sum += acc.balance;
      } else if (acc.bankName === balanceFilter) {
        sum += acc.balance;
      }
    });
    return sum;
  }, [balanceFilter, totalAvailableBalance, accounts]);

  const handleSaveTransaction = async (tx) => {
    const newImpact = tx.type === 'income' ? tx.amount : -tx.amount;
    await updateAccountBalance(tx.accountId, newImpact);
    await addTransaction(tx);
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          <h1 className="h3" style={{ margin: 0 }}>Dashboard</h1>
          <div style={{ width: '180px' }}>
            <Select 
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              options={[
                { value: 'this-month', label: 'This Month' },
                { value: 'last-month', label: 'Last Month' },
                { value: 'last-30-days', label: 'Last 30 Days' },
                { value: 'this-year', label: 'This Year' },
                { value: 'custom', label: 'Custom Range' },
              ]}
            />
          </div>
          <div style={{ width: '180px' }}>
            <Select
              value={balanceFilter}
              onChange={(e) => setBalanceFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Accounts' },
                ...availableProviders.map(p => ({ value: p, label: p }))
              ]}
            />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Transaction
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {dashboardError ? (
          <div style={{ gridColumn: '1 / -1' }}>
            <ErrorState title="Failed to Load Dashboard" message={dashboardError} onRetry={retryDashboard} />
          </div>
        ) : isDashboardLoading ? (
          <>
            <Skeleton height="114px" />
            <Skeleton height="114px" />
            <Skeleton height="114px" />
            <Skeleton height="114px" />
          </>
        ) : (
          <>
            <StatCard 
              title="Total Balance" 
              subtitle={balanceFilter === 'all' ? "All Time" : balanceFilter}
              value={filteredBalanceValue} 
              trend={0} 
              isPositive={true}
              icon={Wallet}
            />
            <StatCard 
              title="Monthly Income" 
              subtitle={periodLabel}
              value={kpis.income.value} 
              trend={kpis.income.trend} 
              isPositive={kpis.income.isPositive}
              icon={ArrowDownRight}
            />
            <StatCard 
              title="Monthly Expenses" 
              subtitle={periodLabel}
              value={kpis.expenses.value} 
              trend={kpis.expenses.trend} 
              isPositive={kpis.expenses.isPositive}
              icon={ArrowUpRight}
            />
            <StatCard 
              title="Net Cash Flow"
              subtitle={periodLabel}
              value={kpis.netCashFlow.value} 
              trend={kpis.netCashFlow.trend} 
              isPositive={kpis.netCashFlow.isPositive}
              icon={TrendingUp}
            />
          </>
        )}
      </div>

      {dashboardError ? (
        null // Handled in KPI grid section above to prevent multiple error states
      ) : isDashboardLoading ? (
        <div className="dashboard-main-grid">
          <div className="charts-column">
            <Skeleton height="350px" />
            <Skeleton height="350px" />
          </div>
          <div className="lists-column">
            <Skeleton height="400px" />
            <Skeleton height="300px" />
          </div>
        </div>
      ) : contextTransactions.length === 0 ? (
        <div className="state-container" style={{ 
          background: 'var(--color-surface)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--color-border)',
          padding: 'var(--space-12) var(--space-4)',
          marginTop: 'var(--space-6)'
        }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            background: 'var(--color-primary-light)', color: 'var(--color-primary)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            marginBottom: 'var(--space-4)' 
          }}>
            <Wallet size={32} />
          </div>
          <h2 className="h3" style={{ margin: '0 0 var(--space-2) 0', color: 'var(--color-text)' }}>Welcome to ExMoney!</h2>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0 0 var(--space-6) 0' }}>
            It looks like you haven't recorded any financial activity yet. Add your first transaction to start unlocking insights, charts, and reports.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Add Your First Transaction
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/accounts')}>
              Add a Bank Account
            </Button>
          </div>
        </div>
      ) : (
        <div className="dashboard-main-grid">
        
        {/* Left Column: Charts */}
        <div className="charts-column">
          {/* Income vs Expenses Chart */}
          <div className="dashboard-card">
            <h3 className="card-title">Income vs Expenses (Last 5 Months)</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <RechartsTooltip 
                    cursor={{ fill: 'var(--color-bg)' }}
                    contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Bar dataKey="income" name="Income" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spending by Category */}
          <div className="dashboard-card">
            <h3 className="card-title">Spending by Category ({periodLabel})</h3>
            <div className="chart-container" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, height: '100%' }}>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="state-container" style={{ padding: 0 }}>No expenses in this period</div>
                )}
              </div>
              <div className="category-legend">
                {categoryData.map((category, index) => (
                  <div key={index} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: category.color }} />
                    <span className="legend-name">{category.name}</span>
                    <span className="legend-value">{formatCurrency(category.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lists */}
        <div className="lists-column">
          {/* Recent Transactions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Recent Transactions</h3>
            </div>
            <div className="transaction-list">
              {transactions.length > 0 ? transactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="transaction-item">
                  <div className="tx-icon" style={{ backgroundColor: tx.type === 'income' ? 'var(--color-primary-light)' : '#fef2f2', color: tx.type === 'income' ? 'var(--color-primary)' : '#ef4444' }}>
                    {tx.type === 'income' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div className="tx-details">
                    <div className="tx-name">{tx.name}</div>
                    <div className="tx-meta">{tx.category} • {format(parseISO(tx.date), 'MMM dd, yyyy')}</div>
                  </div>
                  <div className={`tx-amount ${tx.type === 'income' ? 'positive' : ''}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                </div>
              )) : (
                <div className="state-container" style={{ padding: 'var(--space-6)' }}>No transactions found.</div>
              )}
            </div>
            {transactions.length > 5 && (
              <Button variant="ghost" className="w-full mt-4 text-primary">
                View All {transactions.length} Transactions <ChevronRight size={16} />
              </Button>
            )}
          </div>

          {/* Upcoming Preview */}
          <div className="dashboard-card bg-secondary">
            <div className="card-header">
              <h3 className="card-title">Upcoming</h3>
            </div>
            <div className="upcoming-list">
              {(() => {
                const today = new Date();
                const allMonthOccurrences = getOccurrencesForMonth(scheduledTransactions, today);
                
                // Filter for >= today and take next 3
                // We use setHours(0,0,0,0) to compare dates ignoring time
                const startOfToday = new Date(today);
                startOfToday.setHours(0, 0, 0, 0);
                
                const upcoming = allMonthOccurrences
                  .filter(tx => parseISO(tx.date) >= startOfToday)
                  .slice(0, 3);
                
                if (upcoming.length === 0) {
                  return <div className="state-container" style={{ padding: 'var(--space-4)' }}>No upcoming transactions this month.</div>;
                }

                return upcoming.map(event => (
                  <div key={event.occurrenceId || event.id} className="upcoming-item">
                    <div className="upcoming-date">
                      <Calendar size={14} />
                      <span>{format(parseISO(event.date), 'MMM dd')}</span>
                    </div>
                    <div className="upcoming-details">
                      <span className="upcoming-name">{event.name}</span>
                      <span className={`upcoming-amount ${event.type === 'income' ? 'positive' : ''}`}>
                        {event.type === 'income' ? '+' : '-'}{formatCurrency(event.amount)}
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>
            <Button variant="ghost" className="w-full mt-4" onClick={() => navigate('/dashboard/calendar')}>
              View Calendar <ChevronRight size={16} />
            </Button>
          </div>
        </div>

      </div>
      )}

      <ActualTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTransaction}
      />
    </div>
  );
};
