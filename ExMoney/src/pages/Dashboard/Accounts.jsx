import React, { useState } from 'react';
import { Plus, Wallet, Building2, CreditCard, Landmark, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAccounts } from '../../context/AccountsContext';
import { AddEditAccountModal } from './components/AddEditAccountModal';
import { ViewAccountTransactionsModal } from './components/ViewAccountTransactionsModal';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import './Accounts.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.abs(amount));
};

const getAccountIcon = (type) => {
  switch (type) {
    case 'Bank Account': return <Landmark size={20} />;
    case 'Cash': return <Wallet size={20} />;
    case 'Credit Card': return <CreditCard size={20} />;
    case 'Wallet': return <Wallet size={20} />;
    default: return <Building2 size={20} />;
  }
};

const getAccountColorClass = (type) => {
  switch (type) {
    case 'Savings':
    case 'Current':
    case 'Salary': return 'bank';
    case 'Cash': return 'cash';
    case 'Credit Card': return 'credit';
    case 'Other': return 'wallet';
    default: return 'bank';
  }
};

export const Accounts = () => {
  const { accounts, totalAvailableBalance, totalCreditDebt, addAccount, editAccount, deleteAccount, isLoading, error, fetchAccounts } = useAccounts();
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewTxModalOpen, setIsViewTxModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleSaveAccount = (accountData) => {
    if (accountData.id) {
      editAccount(accountData);
    } else {
      addAccount(accountData);
    }
    setIsAddEditModalOpen(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = (account) => {
    // In a real app, we'd check if there are transactions tied to this account before warning.
    // For now, simple confirm dialog.
    if (window.confirm(`Are you sure you want to delete ${account.bankName || account.nickname}? This might affect past transactions.`)) {
      deleteAccount(account.id);
    }
  };

  const openEdit = (account) => {
    setSelectedAccount(account);
    setIsAddEditModalOpen(true);
  };

  const openViewTransactions = (account) => {
    setSelectedAccount(account);
    setIsViewTxModalOpen(true);
  };

  return (
    <div className="accounts-page-container">
      
      {/* Header */}
      <div className="accounts-header">
        <div>
          <h1 className="h3" style={{ margin: 0, marginBottom: 'var(--space-1)' }}>Accounts</h1>
          <p className="text-muted text-sm">Manage your bank accounts, cash, cards, and available balances.</p>
        </div>
        <Button variant="primary" onClick={() => { setSelectedAccount(null); setIsAddEditModalOpen(true); }}>
          <Plus size={18} /> Add Account
        </Button>
      </div>

      {/* Summary Section */}
      <div className="accounts-summary-container">
        <div className="account-summary-card">
          <div className="text-sm font-medium text-muted">Total Available Balance</div>
          <div className="h2" style={{ margin: 'var(--space-2) 0', color: 'var(--color-primary)' }}>
            {formatCurrency(totalAvailableBalance)}
          </div>
          <div className="text-xs text-muted">Across your eligible accounts</div>
        </div>
        
        {totalCreditDebt > 0 && (
          <div className="account-summary-card" style={{ flex: '0 1 auto', minWidth: '200px' }}>
            <div className="text-sm font-medium text-muted">Credit Card Debt</div>
            <div className="h3" style={{ margin: 'var(--space-2) 0', color: 'var(--color-danger)' }}>
              {formatCurrency(totalCreditDebt)}
            </div>
            <div className="text-xs text-muted">Outstanding balance</div>
          </div>
        )}
      </div>

      {error ? (
        <ErrorState title="Failed to Load Accounts" message={error} onRetry={fetchAccounts} />
      ) : isLoading ? (
        <div className="accounts-grid">
          <Skeleton height="200px" />
          <Skeleton height="200px" />
          <Skeleton height="200px" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="state-container" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-12) var(--space-4)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <Landmark size={32} />
          </div>
          <h3 className="h3" style={{ marginBottom: 'var(--space-2)' }}>No accounts added yet</h3>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0 0 var(--space-6) 0' }}>
            Add your first bank account, cash wallet, or card to start tracking your available balance.
          </p>
          <Button variant="primary" onClick={() => setIsAddEditModalOpen(true)}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Add Account
          </Button>
        </div>
      ) : (
        <div className="accounts-grid">
          {accounts.map(account => (
            <div key={account.id} className="account-card" style={{ opacity: account.isActive === false ? 0.6 : 1 }}>
              <div className="account-card-header">
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <div className={`account-icon-wrap ${getAccountColorClass(account.accountType)}`}>
                    {getAccountIcon(account.accountType)}
                  </div>
                  <div>
                    <h3 className="h5" style={{ margin: 0, marginBottom: '2px' }}>{account.bankName}</h3>
                    <div className="text-xs text-muted">
                      {account.nickname} {account.last4 ? `• ${account.last4}` : ''}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="action-menu-btn" onClick={() => openEdit(account)} title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button className="action-menu-btn" onClick={() => handleDeleteAccount(account)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="account-card-body">
                <div className={`h3 ${account.balance < 0 ? 'text-danger' : ''}`} style={{ margin: 0 }}>
                  {account.balance < 0 ? '-' : ''}{formatCurrency(Math.abs(account.balance))}
                </div>
                {account.accountType === 'Credit Card' && account.creditLimit && (
                  <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                    Limit: {formatCurrency(account.creditLimit)}
                  </div>
                )}
              </div>

              <div className="account-card-actions">
                <button className="view-tx-btn" onClick={() => openViewTransactions(account)}>
                  View Transactions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddEditAccountModal
        isOpen={isAddEditModalOpen}
        onClose={() => { setIsAddEditModalOpen(false); setSelectedAccount(null); }}
        onSave={handleSaveAccount}
        editingAccount={selectedAccount}
      />

      <ViewAccountTransactionsModal
        isOpen={isViewTxModalOpen}
        onClose={() => setIsViewTxModalOpen(false)}
        account={selectedAccount}
      />

    </div>
  );
};
