import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, PieChart } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useBudgets } from '../../context/BudgetsContext';
import { useTransactions } from '../../context/TransactionsContext';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { AddEditBudgetModal } from './components/AddEditBudgetModal';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { getTransactionsByPeriod } from '../../data/mockData';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.abs(amount));
};

export const Budgets = () => {
  const { budgets, addBudget, editBudget, deleteBudget, isLoading: budgetsLoading, error: budgetsError, fetchBudgets } = useBudgets();
  const { transactions, isLoading: txsLoading, error: txsError, fetchTransactions } = useTransactions();
  
  const isLoading = budgetsLoading || txsLoading;
  const loadingError = budgetsError || txsError;

  const retryLoading = () => {
    if (budgetsError) fetchBudgets();
    if (txsError) fetchTransactions();
  };
  
  const [period, setPeriod] = useState('this-month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  // Filter transactions based on the selected period
  const periodTransactions = useMemo(() => {
    return getTransactionsByPeriod(period, transactions);
  }, [period, transactions]);

  // Calculate budget stats
  const budgetStats = useMemo(() => {
    let totalBudget = 0;
    let totalSpent = 0;
    let overBudgetCount = 0;

    const enrichedBudgets = budgets.map(budget => {
      // Find spent amount for this budget's category from the period's expenses
      const spent = periodTransactions
        .filter(tx => tx.type === 'expense' && tx.category === budget.category)
        .reduce((sum, tx) => sum + Number(tx.amount), 0);
      
      const remaining = budget.amount - spent;
      const percentage = Math.min((spent / budget.amount) * 100, 100);
      
      let status = 'On Track';
      let color = 'var(--color-secondary)';
      
      if (spent >= budget.amount) {
        status = 'Over Budget';
        color = 'var(--color-danger)';
        overBudgetCount++;
      } else if (percentage >= 80) {
        status = 'Near Limit';
        color = 'var(--color-warning)';
      }

      totalBudget += budget.amount;
      totalSpent += spent;

      return {
        ...budget,
        spent,
        remaining,
        percentage,
        status,
        color
      };
    });

    return {
      enrichedBudgets,
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      overBudgetCount
    };
  }, [budgets, periodTransactions]);

  const handleSaveBudget = (budgetData) => {
    if (editingBudget) {
      editBudget(editingBudget.id, budgetData);
    } else {
      addBudget(budgetData);
    }
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const confirmDelete = (budget) => {
    setBudgetToDelete(budget);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete.id);
    }
    setIsDeleteDialogOpen(false);
    setBudgetToDelete(null);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 'var(--space-2)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-2) 0' }}>Budgets</h1>
          <p className="text-muted" style={{ margin: 0 }}>Set spending limits and keep track of your spending.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <Select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-year">This Year</option>
            <option value="all-time">All Time</option>
          </Select>
          <Button variant="primary" onClick={() => { setEditingBudget(null); setIsModalOpen(true); }}>
            <Plus size={18} /> Create Budget
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="kpi-grid">
        {loadingError ? (
          <div style={{ gridColumn: '1 / -1' }}>
            <ErrorState title="Failed to Load Budgets" message={loadingError} onRetry={retryLoading} />
          </div>
        ) : isLoading ? (
          <>
            <Skeleton height="100px" />
            <Skeleton height="100px" />
            <Skeleton height="100px" />
            <Skeleton height="100px" />
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-card-header">
                <div>
                  <h3 className="stat-card-title">Total Budget</h3>
                </div>
              </div>
              <div className="stat-card-value">{formatCurrency(budgetStats.totalBudget)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <div>
                  <h3 className="stat-card-title">Total Spent</h3>
                </div>
              </div>
              <div className="stat-card-value">{formatCurrency(budgetStats.totalSpent)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <div>
                  <h3 className="stat-card-title">Remaining</h3>
                </div>
              </div>
              <div className="stat-card-value">{formatCurrency(budgetStats.remaining)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <div>
                  <h3 className="stat-card-title">Over Budget</h3>
                </div>
              </div>
              <div className="stat-card-value" style={{ color: budgetStats.overBudgetCount > 0 ? 'var(--color-danger)' : 'inherit' }}>
                {budgetStats.overBudgetCount} {budgetStats.overBudgetCount === 1 ? 'Category' : 'Categories'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Budget Grid */}
      {loadingError ? null : isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
          <Skeleton height="250px" />
          <Skeleton height="250px" />
          <Skeleton height="250px" />
        </div>
      ) : budgetStats.enrichedBudgets.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
          {budgetStats.enrichedBudgets.map(budget => (
            <div key={budget.id} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 className="h3" style={{ margin: '0 0 4px 0' }}>{budget.category}</h3>
                  <div className="text-muted text-sm">{budget.period}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(budget)} style={{ padding: '4px' }}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => confirmDelete(budget)} style={{ padding: '4px', color: 'var(--color-danger)' }}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              {/* Amount Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div className="text-muted text-sm mb-2">Spent</div>
                  <div className="h2" style={{ margin: 0 }}>{formatCurrency(budget.spent)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="text-muted text-sm mb-2">Budget</div>
                  <div className="h3" style={{ margin: 0 }}>{formatCurrency(budget.amount)}</div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                  <span style={{ color: budget.color, fontWeight: 500 }}>{budget.status}</span>
                  <span className="text-muted">{Math.round(budget.percentage)}% used</span>
                </div>
                <ProgressBar percentage={budget.percentage} color={budget.color} />
              </div>

              {/* Remaining */}
              <div className="text-sm" style={{ color: budget.remaining < 0 ? 'var(--color-danger)' : 'var(--color-text)' }}>
                {budget.remaining < 0 
                  ? `${formatCurrency(Math.abs(budget.remaining))} over budget`
                  : `${formatCurrency(budget.remaining)} remaining`
                }
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="state-container" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-12) var(--space-4)', marginTop: 'var(--space-4)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <PieChart size={32} />
          </div>
          <h3 className="h3" style={{ marginBottom: 'var(--space-2)' }}>No budgets yet</h3>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0 0 var(--space-6) 0' }}>Create your first budget to set spending limits and keep track of your financial goals.</p>
          <Button variant="primary" onClick={() => { setEditingBudget(null); setIsModalOpen(true); }}>
            <Plus size={18} /> Create Budget
          </Button>
        </div>
      )}

      {/* Modals */}
      <AddEditBudgetModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingBudget(null); }}
        onSave={handleSaveBudget}
        editingBudget={editingBudget}
        existingBudgets={budgets}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Budget"
        message={`Are you sure you want to delete the ${budgetToDelete?.category} budget? This will not delete any transactions.`}
        onConfirm={handleDelete}
        onCancel={() => { setIsDeleteDialogOpen(false); setBudgetToDelete(null); }}
        confirmText="Delete Budget"
      />
    </div>
  );
};
