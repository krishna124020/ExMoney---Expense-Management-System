import React, { useMemo, useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useTransactions } from '../../../context/TransactionsContext';
import { format, parseISO } from 'date-fns';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.abs(amount));
};

export const ViewAccountTransactionsModal = ({ isOpen, onClose, account }) => {
  const { transactions } = useTransactions();
  
  const accountTransactions = useMemo(() => {
    if (!account) return [];
    return transactions.filter(tx => tx.accountId === account.id).sort((a, b) => parseISO(b.date) - parseISO(a.date));
  }, [transactions, account]);

  if (!isOpen || !account) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '600px', 
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', display: 'flex', flexDirection: 'column'
      }}>
        <div className="modal-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
          padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)'
        }}>
          <div>
            <h2 className="h3" style={{ margin: 0, marginBottom: 'var(--space-1)' }}>{account.name}</h2>
            <div className="text-muted">Current Balance: <span style={{ fontWeight: '600', color: account.balance < 0 ? 'var(--color-danger)' : 'var(--color-text)' }}>{formatCurrency(account.balance)}</span></div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} style={{ padding: '4px' }}>
            <X size={20} />
          </Button>
        </div>
        
        <div style={{ padding: 'var(--space-4)', overflowY: 'auto', flex: 1 }}>
          <h3 className="h4" style={{ margin: '0 0 var(--space-4) 0' }}>Transactions</h3>
          
          {accountTransactions.length === 0 ? (
            <div className="text-center text-muted" style={{ padding: 'var(--space-6)' }}>
              No transactions found for this account.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {accountTransactions.map(tx => (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: tx.type === 'income' ? 'var(--color-primary-light)' : '#fef2f2', 
                      color: tx.type === 'income' ? 'var(--color-primary)' : '#ef4444' 
                    }}>
                      {tx.type === 'income' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <div className="font-medium">{tx.name}</div>
                      <div className="text-xs text-muted">{format(parseISO(tx.date), 'dd MMM yyyy')} • {tx.category}</div>
                    </div>
                  </div>
                  <div className={tx.type === 'income' ? 'text-primary' : 'text-danger'} style={{ fontWeight: '600' }}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
