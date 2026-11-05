import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, FileText, ChevronLeft, ChevronRight, 
  MoreVertical, Eye, Edit2, Trash2, ArrowUpRight, ArrowDownRight, CreditCard
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useTransactions } from '../../context/TransactionsContext';
import { useAccounts } from '../../context/AccountsContext';
import { ActualTransactionModal } from './components/ActualTransactionModal';
import { ViewTransactionModal } from './components/ViewTransactionModal';
import { useFilters } from '../../context/FilterContext';
import { GlobalFilterModal } from '../../components/layout/GlobalFilterModal';
import { parseISO, format, isSameMonth, subMonths, isToday, isSameWeek, isSameYear } from 'date-fns';
import './Transactions.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.abs(amount));
};

export const Transactions = () => {
  const { transactions, addTransaction, editTransaction, deleteTransaction, isLoading: txsLoading, error: txsError, fetchTransactions } = useTransactions();
  const { updateAccountBalance, accounts, isLoading: accountsLoading, error: accountsError, fetchAccounts } = useAccounts();
  
  const isLoading = txsLoading || accountsLoading;
  const loadingError = txsError || accountsError;

  const retryLoading = () => {
    if (txsError) fetchTransactions();
    if (accountsError) fetchAccounts();
  };
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Filters state
  const { filters, activeFilterCount, filterTransactions, clearAllFilters } = useFilters();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleClearFilters = () => {
    setSearch('');
    setSortBy('newest');
    clearAllFilters();
    setCurrentPage(1);
  };

  // Filter and Sort Logic
  const filteredTransactions = useMemo(() => {
    // Apply global filters first
    let result = filterTransactions(transactions);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(tx => 
        tx.name.toLowerCase().includes(q) || 
        tx.category.toLowerCase().includes(q) ||
        (tx.notes && tx.notes.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = parseISO(a.date).getTime();
      const dateB = parseISO(b.date).getTime();
      
      switch (sortBy) {
        case 'oldest': return dateA - dateB;
        case 'highest': return b.amount - a.amount;
        case 'lowest': return a.amount - b.amount;
        case 'newest': 
        default: 
          return dateB - dateA;
      }
    });

    return result;
  }, [transactions, search, sortBy, filters]);

  // Reset pagination if filters change and we are out of bounds
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredTransactions.length]);

  // Calculate summaries based on filtered data
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach(tx => {
      if (tx.type === 'income') income += tx.amount;
      else expense += tx.amount;
    });
    return { income, expense, net: income - expense };
  }, [filteredTransactions]);

  // Pagination slice
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Group paginated transactions by date
  const groupedTransactions = useMemo(() => {
    const groups = {};
    paginatedTransactions.forEach(tx => {
      const dateStr = format(parseISO(tx.date), 'd MMMM yyyy');
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(tx);
    });
    return groups;
  }, [paginatedTransactions]);

  // Determine Month/Date Context Label
  const dateContextLabel = useMemo(() => {
    const today = new Date();
    if (filters.dateRange === 'All Time') return 'View and manage your income and expenses.';
    if (filters.dateRange === 'Today') return format(today, 'd MMMM yyyy');
    if (filters.dateRange === 'This Week') return 'This Week';
    if (filters.dateRange === 'This Month') return format(today, 'MMMM yyyy');
    if (filters.dateRange === 'Last Month') return format(subMonths(today, 1), 'MMMM yyyy');
    if (filters.dateRange === 'This Year') return format(today, 'yyyy');
    if (filters.dateRange === 'Custom') {
      if (filters.customDateStart && filters.customDateEnd) {
        return `${format(new Date(filters.customDateStart), 'd MMMM yyyy')} – ${format(new Date(filters.customDateEnd), 'd MMMM yyyy')}`;
      }
      return 'Custom Date Range';
    }
    return '';
  }, [filters.dateRange, filters.customDateStart, filters.customDateEnd]);

  // Handlers
  const handleSaveTransaction = async (tx) => {
    if (tx.id) {
      const oldTx = transactions.find(t => t.id === tx.id);
      if (oldTx) {
        const oldImpact = oldTx.type === 'income' ? oldTx.amount : -oldTx.amount;
        await updateAccountBalance(oldTx.accountId, -oldImpact); // Reverse old
      }
      
      const newImpact = tx.type === 'income' ? tx.amount : -tx.amount;
      await updateAccountBalance(tx.accountId, newImpact); // Apply new
      
      await editTransaction(tx);
    } else {
      const newImpact = tx.type === 'income' ? tx.amount : -tx.amount;
      await updateAccountBalance(tx.accountId, newImpact);
      
      await addTransaction(tx);
    }
    setIsAddModalOpen(false);
    setSelectedTransaction(null);
  };

  const openView = (tx) => {
    setSelectedTransaction(tx);
    setIsViewModalOpen(true);
  };

  const handleEditFromView = () => {
    setIsViewModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleDeleteTransaction = async (tx) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const impact = tx.type === 'income' ? tx.amount : -tx.amount;
        await updateAccountBalance(tx.accountId, -impact);
        await deleteTransaction(tx.id);
        setIsViewModalOpen(false);
      } catch (err) {
        alert("Failed to delete transaction: " + err.message);
      }
    }
  };

  const handleActionMenu = (e, tx, action) => {
    e.stopPropagation();
    if (action === 'view') openView(tx);
    if (action === 'edit') {
      setSelectedTransaction(tx);
      setIsAddModalOpen(true);
    }
    if (action === 'delete') {
      handleDeleteTransaction(tx);
    }
  };

  return (
    <div className="transactions-page-container">
      
      {/* Header */}
      <div className="transactions-header">
        <div>
          <h1 className="h3" style={{ margin: 0, marginBottom: 'var(--space-1)' }}>Transactions</h1>
          <p className="text-muted text-sm">{dateContextLabel}</p>
        </div>
        <Button variant="primary" onClick={() => { setSelectedTransaction(null); setIsAddModalOpen(true); }}>
          <Plus size={18} /> Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards-container">
        {loadingError ? (
          <div style={{ gridColumn: '1 / -1' }}>
            <ErrorState title="Failed to Load Transactions" message={loadingError} onRetry={retryLoading} />
          </div>
        ) : isLoading ? (
          <>
            <Skeleton height="100px" />
            <Skeleton height="100px" />
            <Skeleton height="100px" />
          </>
        ) : (
          <>
            <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 'var(--radius-full)' }}>
                <ArrowDownRight size={24} />
              </div>
              <div>
                <div className="text-sm font-medium text-muted">Total Income</div>
                <div className="h3 text-primary" style={{ margin: 0 }}>{formatCurrency(summary.income)}</div>
              </div>
            </div>
            <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ padding: 'var(--space-3)', background: '#fee2e2', color: 'var(--color-danger)', borderRadius: 'var(--radius-full)' }}>
                <ArrowUpRight size={24} />
              </div>
              <div>
                <div className="text-sm font-medium text-muted">Total Expenses</div>
                <div className="h3 text-danger" style={{ margin: 0 }}>{formatCurrency(summary.expense)}</div>
              </div>
            </div>
            <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-bg)', color: 'var(--color-text)', borderRadius: 'var(--radius-full)' }}>
                <FileText size={24} />
              </div>
              <div>
                <div className="text-sm font-medium text-muted">Net Cash Flow</div>
                <div className={`h3 ${summary.net >= 0 ? 'text-primary' : 'text-danger'}`} style={{ margin: 0 }}>
                  {summary.net >= 0 ? '+' : ''}{formatCurrency(summary.net)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar">
        <div className="filter-group" style={{ flex: '2', minWidth: '200px' }}>
          <label>Search</label>
          <Input 
            placeholder="Search transactions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        
        <div className="filter-group">
          <label>Global Filters</label>
          <Button 
            variant={activeFilterCount > 0 ? 'primary' : 'outline'} 
            onClick={() => setIsFilterModalOpen(true)}
            style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Filter size={16} />
            Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </Button>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </Select>
        </div>

        <Button variant="ghost" onClick={handleClearFilters} style={{ alignSelf: 'flex-end', height: '42px' }}>
          Clear Filters
        </Button>
      </div>

      {/* Transaction List */}
      {loadingError ? null : isLoading ? (
        <div className="transactions-table-container">
          <Skeleton height="350px" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="state-container" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-12) var(--space-4)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            {transactions.length === 0 ? <CreditCard size={32} /> : <Search size={32} />}
          </div>
          <h3 className="h3" style={{ marginBottom: 'var(--space-2)' }}>
            {transactions.length === 0 ? 'No transactions yet' : 'No matching transactions'}
          </h3>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0 0 var(--space-6) 0' }}>
            {transactions.length === 0 
              ? 'Start tracking your finances by adding your first transaction.' 
              : 'Try changing or clearing your filters to see results.'}
          </p>
          {transactions.length === 0 ? (
            <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} style={{ marginRight: '8px' }} /> Add Transaction
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedTransactions).map(([dateLabel, txs]) => (
                  <React.Fragment key={dateLabel}>
                    <tr>
                      <td colSpan="6" style={{ background: 'var(--color-bg)', fontWeight: 'bold', fontSize: '0.875rem', padding: 'var(--space-2) var(--space-4)' }}>
                        {dateLabel}
                      </td>
                    </tr>
                    {txs.map(tx => (
                      <tr key={tx.id} onClick={() => openView(tx)} style={{ cursor: 'pointer' }}>
                        <td className="font-medium">
                          <div>{tx.name}</div>
                          <div className="text-xs text-muted" style={{ fontWeight: 'normal', marginTop: '2px' }}>
                            {(() => {
                              const acc = accounts && accounts.find(a => a.id === tx.accountId);
                              return acc ? `${acc.bankName ? `${acc.name} (${acc.bankName})` : acc.name} • ${tx.paymentMethod}` : tx.paymentMethod;
                            })()}
                          </div>
                        </td>
                        <td>
                          <span style={{ 
                            background: 'var(--color-bg)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' 
                          }}>
                            {tx.category}
                          </span>
                        </td>
                        <td style={{ textTransform: 'capitalize' }} className="text-muted">{tx.type}</td>
                        <td className="text-muted">{tx.paymentMethod}</td>
                        <td className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                            <button className="action-menu-btn" onClick={(e) => handleActionMenu(e, tx, 'edit')} title="Edit">
                              <Edit2 size={16} />
                            </button>
                            <button className="action-menu-btn" onClick={(e) => handleActionMenu(e, tx, 'delete')} title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-transactions-list">
            {Object.entries(groupedTransactions).map(([dateLabel, txs]) => (
              <React.Fragment key={dateLabel}>
                <div style={{ fontWeight: 'bold', fontSize: '0.875rem', padding: 'var(--space-2) 0', color: 'var(--color-text)' }}>
                  {dateLabel}
                </div>
                {txs.map(tx => (
                  <div key={tx.id} className="mobile-tx-card" onClick={() => openView(tx)}>
                    <div className="mobile-tx-header">
                      <div>
                        <div className="font-medium">{tx.name}</div>
                        <div className="text-sm text-muted">
                          {format(parseISO(tx.date), 'dd MMM yyyy')} • {tx.category}
                          {(() => {
                            const acc = accounts && accounts.find(a => a.id === tx.accountId);
                            return acc ? ` • ${acc.bankName ? `${acc.name} (${acc.bankName})` : acc.name} • ${tx.paymentMethod}` : '';
                          })()}
                        </div>
                      </div>
                      <div className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </div>
                    </div>
                    <div className="mobile-tx-body">
                      <span style={{ 
                        background: 'var(--color-bg)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' 
                      }}>
                        {tx.category}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="action-menu-btn" onClick={(e) => handleActionMenu(e, tx, 'edit')}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-menu-btn" onClick={(e) => handleActionMenu(e, tx, 'delete')}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-controls">
            <div className="text-sm text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <ActualTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setSelectedTransaction(null); }}
        onSave={handleSaveTransaction}
        editingTransaction={selectedTransaction}
      />

      <ViewTransactionModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        transaction={selectedTransaction}
        onEdit={handleEditFromView}
        onDelete={() => handleDeleteTransaction(selectedTransaction)}
      />

      <GlobalFilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />

    </div>
  );
};
