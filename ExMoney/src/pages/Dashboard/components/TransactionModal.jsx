import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const TransactionModal = ({ isOpen, onClose, onSave, editingTransaction }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    name: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // yyyy-mm-dd
    frequency: 'none',
    endDate: '',
    notes: ''
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        ...editingTransaction,
        date: editingTransaction.date.split('T')[0],
        endDate: editingTransaction.endDate ? editingTransaction.endDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        type: 'expense',
        name: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        frequency: 'none',
        endDate: '',
        notes: ''
      });
    }
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.category || !formData.date) {
      alert('Please fill out all required fields.');
      return;
    }
    
    onSave({
      ...formData,
      amount: Number(formData.amount),
      // Append time to date string if needed, or keep as YYYY-MM-DD
      date: new Date(formData.date).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
    });
  };

  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Travel', 'Housing', 'Investment', 'Other'];
  const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];

  const categories = formData.type === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '500px', 
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="h4" style={{ margin: 0 }}>{editingTransaction ? 'Edit Scheduled Transaction' : 'Add Scheduled Transaction'}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} style={{ padding: '4px' }}>
            <X size={20} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <input type="radio" name="type" value="expense" checked={formData.type === 'expense'} onChange={handleChange} />
              Expense
            </label>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <input type="radio" name="type" value="income" checked={formData.type === 'income'} onChange={handleChange} />
              Income
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label className="text-sm font-medium">Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder={formData.type === 'expense' ? 'e.g. Rent' : 'e.g. Salary'}
              style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
              <label className="text-sm font-medium">Amount (₹) *</label>
              <input 
                type="number" 
                name="amount" 
                value={formData.amount} 
                onChange={handleChange} 
                placeholder="0"
                min="0"
                style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
              <label className="text-sm font-medium">Category *</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
              <label className="text-sm font-medium">Start Date *</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
              <label className="text-sm font-medium">Frequency</label>
              <select 
                name="frequency" 
                value={formData.frequency} 
                onChange={handleChange}
                style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {formData.frequency !== 'none' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label className="text-sm font-medium">End Date (Optional)</label>
              <input 
                type="date" 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleChange} 
                style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} 
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label className="text-sm font-medium">Notes (Optional)</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              rows="3"
              style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', resize: 'vertical' }} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Scheduled Transaction</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
