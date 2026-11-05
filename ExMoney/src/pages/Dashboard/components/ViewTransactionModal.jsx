import React from 'react';
import { X, Edit2, Trash2, Calendar, Tag, CreditCard, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { format, parseISO } from 'date-fns';

export const ViewTransactionModal = ({ isOpen, onClose, transaction, onEdit, onDelete }) => {
  if (!isOpen || !transaction) return null;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDelete(transaction.id);
      onClose();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '400px', 
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)'
      }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--space-4)' }}>
          <div>
            <h3 className="h3" style={{ margin: 0, marginBottom: 'var(--space-1)' }}>{transaction.name}</h3>
            <div className={`text-lg font-bold ${transaction.type === 'income' ? 'text-primary' : 'text-danger'}`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} style={{ padding: '4px' }}>
            <X size={20} />
          </Button>
        </div>
        
        <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Calendar size={18} className="text-muted" />
            <div>
              <div className="text-sm font-medium">Date</div>
              <div className="text-sm text-muted">{format(parseISO(transaction.date), 'MMMM dd, yyyy')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Tag size={18} className="text-muted" />
            <div>
              <div className="text-sm font-medium">Category</div>
              <div className="text-sm text-muted">{transaction.category} ({transaction.type})</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <CreditCard size={18} className="text-muted" />
            <div>
              <div className="text-sm font-medium">Payment Method</div>
              <div className="text-sm text-muted">{transaction.paymentMethod}</div>
            </div>
          </div>

          {transaction.notes && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
              <FileText size={18} className="text-muted" style={{ marginTop: '2px' }} />
              <div>
                <div className="text-sm font-medium">Notes</div>
                <div className="text-sm text-muted">{transaction.notes}</div>
              </div>
            </div>
          )}

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
          <Button type="button" variant="ghost" onClick={handleDelete} style={{ color: 'var(--color-danger)' }}>
            <Trash2 size={16} style={{ marginRight: '4px' }} /> Delete
          </Button>
          <Button type="button" variant="primary" onClick={() => { onClose(); onEdit(); }}>
            <Edit2 size={16} style={{ marginRight: '4px' }} /> Edit
          </Button>
        </div>

      </div>
    </div>
  );
};
