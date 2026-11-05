import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';

import { useCategories } from '../../../context/CategoriesContext';

const PERIODS = ['Monthly', 'Weekly', 'Yearly', 'Custom Range'];

export const AddEditBudgetModal = ({ isOpen, onClose, onSave, editingBudget, existingBudgets }) => {
  const [formData, setFormData] = useState({
    category: 'Food',
    amount: '',
    period: 'Monthly',
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState('');

  const { categories } = useCategories();
  const expenseCategories = categories.filter(c => c.type === 'expense');

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        ...editingBudget
      });
    } else {
      setFormData({
        category: 'Food',
        amount: '',
        period: 'Monthly',
        startDate: '',
        endDate: ''
      });
    }
    setError('');
  }, [editingBudget, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (formData.period === 'Custom Range') {
      if (!formData.startDate || !formData.endDate) {
        setError('Please select start and end dates for custom range.');
        return;
      }
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        setError('Start date cannot be after end date.');
        return;
      }
    }

    // Duplicate check
    const isDuplicate = existingBudgets.some(b => 
      b.category === formData.category && 
      b.period === formData.period &&
      b.id !== (editingBudget ? editingBudget.id : null)
    );

    if (isDuplicate) {
      setError('A budget for this category and period already exists.');
      return;
    }

    onSave({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 className="h3" style={{ margin: 0 }}>{editingBudget ? 'Edit Budget' : 'Create Budget'}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} style={{ padding: '4px' }}>
            <X size={20} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Category</label>
            <Select name="category" value={formData.category} onChange={handleChange} required>
              {expenseCategories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </Select>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Budget Amount (₹)</label>
            <Input 
              type="number" 
              name="amount" 
              value={formData.amount} 
              onChange={handleChange} 
              placeholder="e.g. 5000"
              required 
              min="1"
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Period</label>
            <Select name="period" value={formData.period} onChange={handleChange} required>
              {PERIODS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </div>

          {formData.period === 'Custom Range' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Start Date</label>
                <Input 
                  type="date" 
                  name="startDate" 
                  value={formData.startDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 'var(--space-2)' }}>End Date</label>
                <Input 
                  type="date" 
                  name="endDate" 
                  value={formData.endDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
          )}

          {error && (
            <div style={{ color: 'var(--color-danger)', fontSize: '0.875rem', padding: '8px', backgroundColor: '#fef2f2', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)', justifyContent: 'flex-end' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">
              {editingBudget ? 'Save Changes' : 'Create Budget'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
