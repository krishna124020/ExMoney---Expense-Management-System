import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { format } from 'date-fns';
import { useAccounts } from '../../../context/AccountsContext';
import { useCategories } from '../../../context/CategoriesContext';

const PAYMENT_METHODS = ['Cash', 'Bank Account', 'Credit Card', 'Debit Card', 'UPI', 'Other'];

export const ActualTransactionModal = ({ isOpen, onClose, onSave, editingTransaction }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    name: '',
    category: 'Food',
    date: format(new Date(), 'yyyy-MM-dd'),
    paymentMethod: 'UPI',
    accountId: '',
    notes: ''
  });

  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const activeCategories = categories.filter(c => c.type === formData.type);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        ...editingTransaction,
        date: editingTransaction.date ? editingTransaction.date.split('T')[0] : format(new Date(), 'yyyy-MM-dd')
      });
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        name: '',
        category: 'Food',
        date: format(new Date(), 'yyyy-MM-dd'),
        paymentMethod: 'UPI',
        accountId: accounts.length > 0 ? accounts[0].id : '',
        notes: ''
      });
    }
  }, [editingTransaction, isOpen, accounts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      // reset category when type changes
      setFormData(prev => ({
        ...prev,
        type: value,
        category: value === 'expense' ? 'Food' : 'Salary'
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.date) return;
    
    // convert amount to number
    const parsedAmount = parseFloat(formData.amount);
    
    // Convert date string back to ISO
    const dateObj = new Date(formData.date);
    
    const finalData = {
      ...formData,
      amount: parsedAmount,
      date: dateObj.toISOString()
    };
    
    setIsSaving(true);
    setError(null);
    try {
      await onSave(finalData);
    } catch (err) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;


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
        <div className="modal-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)'
        }}>
          <h2 className="h3" style={{ margin: 0 }}>
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} style={{ padding: '4px' }}>
            <X size={20} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          
          {error && (
            <div style={{ padding: 'var(--space-3)', backgroundColor: '#fee2e2', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <input type="radio" name="type" value="expense" checked={formData.type === 'expense'} onChange={handleChange} />
              Expense
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <input type="radio" name="type" value="income" checked={formData.type === 'income'} onChange={handleChange} />
              Income
            </label>
          </div>

          <Input 
            label="Amount (₹)" 
            name="amount" 
            type="number" 
            min="0"
            step="0.01"
            value={formData.amount} 
            onChange={handleChange} 
            required 
            placeholder="0.00"
          />
          
          <Input 
            label="Transaction Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="e.g. Starbucks Coffee"
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Select label="Category" name="category" value={formData.category} onChange={handleChange} required>
              {activeCategories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </Select>
            <Input 
              label="Date" 
              name="date" 
              type="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </div>

          <Select label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
          
          <Select label="Account" name="accountId" value={formData.accountId} onChange={handleChange} required>
            <option value="" disabled>Select an account</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.accountType === 'Cash' ? acc.bankName : `${acc.bankName} ${acc.last4 ? '•••• ' + acc.last4 : ''}`.trim()}
              </option>
            ))}
          </Select>

          <Input 
            label="Notes (Optional)" 
            name="notes" 
            value={formData.notes} 
            onChange={handleChange} 
            placeholder="Add any extra details..."
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
