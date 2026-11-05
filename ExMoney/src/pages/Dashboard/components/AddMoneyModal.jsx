import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const AddMoneyModal = ({ isOpen, onClose, onSave, goal }) => {
  const [mode, setMode] = useState('add'); // 'add' or 'adjust'
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode('add');
      setAmount('');
    }
  }, [isOpen]);

  if (!isOpen || !goal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    
    if (mode === 'add') {
      onSave({ type: 'add', amount: numAmount });
    } else {
      onSave({ type: 'adjust', amount: numAmount });
    }
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
        <div className="modal-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)'
        }}>
          <h2 className="h3" style={{ margin: 0 }}>
            Manage Goal: {goal.name}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', padding: '0 var(--space-4)', marginTop: 'var(--space-4)' }}>
          <div 
            onClick={() => setMode('add')}
            style={{ 
              flex: 1, textAlign: 'center', padding: 'var(--space-2)', cursor: 'pointer',
              borderBottom: mode === 'add' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: mode === 'add' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: mode === 'add' ? 600 : 400
            }}
          >
            Add Money
          </div>
          <div 
            onClick={() => setMode('adjust')}
            style={{ 
              flex: 1, textAlign: 'center', padding: 'var(--space-2)', cursor: 'pointer',
              borderBottom: mode === 'adjust' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: mode === 'adjust' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: mode === 'adjust' ? 600 : 400
            }}
          >
            Adjust Total
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-4)' }}>
          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
              {mode === 'add' ? 'Amount to Add (₹)' : 'New Total Saved Amount (₹)'}
            </label>
            <input 
              type="number" 
              required
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
              placeholder={mode === 'add' ? 'e.g. 5000' : 'e.g. 25000'}
            />
            {mode === 'add' && amount && (
              <div style={{ marginTop: '8px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                New total will be: ₹{(Number(goal.savedAmount) + Number(amount)).toLocaleString('en-IN')}
              </div>
            )}
            {mode === 'adjust' && (
              <div style={{ marginTop: '8px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Current total is: ₹{goal.savedAmount.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
