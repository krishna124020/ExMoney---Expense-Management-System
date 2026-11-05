import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';

export const MigrateCategoryModal = ({ isOpen, onClose, onConfirm, categoryToDelete, existingCategories }) => {
  const [fallbackCategory, setFallbackCategory] = useState('');
  
  if (!isOpen || !categoryToDelete) return null;

  const activeCategories = existingCategories.filter(c => c.type === categoryToDelete.type && c.id !== categoryToDelete.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fallbackCategory) return;
    onConfirm(fallbackCategory);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '8px', borderRadius: '50%' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="h3" style={{ margin: 0 }}>Category in Use</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} style={{ padding: '4px' }}>
            <X size={20} />
          </Button>
        </div>
        
        <div className="card-body">
          <p style={{ marginBottom: 'var(--space-4)', fontSize: '0.875rem' }}>
            The category <strong>{categoryToDelete.name}</strong> is currently being used by existing transactions or budgets. 
            Before deleting it, please select a fallback category to move these records into.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Fallback Category</label>
              <Select value={fallbackCategory} onChange={(e) => setFallbackCategory(e.target.value)} required>
                <option value="">Select a category...</option>
                {activeCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </Select>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={!fallbackCategory}>
                Move & Delete
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
