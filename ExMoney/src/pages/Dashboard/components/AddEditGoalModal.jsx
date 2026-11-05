import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const AddEditGoalModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    savedAmount: '',
    targetDate: '',
    icon: 'Target'
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        ...initialData,
        targetAmount: initialData.targetAmount.toString(),
        savedAmount: initialData.savedAmount.toString(),
        targetDate: initialData.targetDate ? initialData.targetDate.split('T')[0] : ''
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        targetAmount: '',
        savedAmount: '0',
        targetDate: '',
        icon: 'Target'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSave({
      ...formData,
      targetAmount: Number(formData.targetAmount),
      savedAmount: Number(formData.savedAmount),
      targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : new Date().toISOString()
    });
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
            {initialData ? 'Edit Goal' : 'Create Goal'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-4)' }}>
          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Goal Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
              placeholder="e.g. Emergency Fund"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Target Amount (₹)</label>
            <input 
              type="number" 
              required
              min="1"
              value={formData.targetAmount}
              onChange={e => setFormData({...formData, targetAmount: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
              placeholder="e.g. 50000"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Current Saved Amount (₹)</label>
            <input 
              type="number" 
              required
              min="0"
              value={formData.savedAmount}
              onChange={e => setFormData({...formData, savedAmount: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
              placeholder="e.g. 0"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Target Date</label>
            <input 
              type="date" 
              required
              value={formData.targetDate}
              onChange={e => setFormData({...formData, targetDate: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
            />
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Goal</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
