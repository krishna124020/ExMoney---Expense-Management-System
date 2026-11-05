import React, { useState, useEffect } from 'react';
import { X, Type } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import * as Icons from 'lucide-react';

const COMMON_ICONS = [
  'Utensils', 'Car', 'ShoppingBag', 'FileText', 'Film', 'Heart', 'Book', 'Plane',
  'Briefcase', 'Laptop', 'Building', 'TrendingUp', 'Gift', 'MoreHorizontal',
  'Coffee', 'Home', 'Smartphone', 'Monitor', 'Music', 'Zap'
];

export const AddEditCategoryModal = ({ isOpen, onClose, onSave, editingCategory, existingCategories }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    icon: 'MoreHorizontal'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setFormData({ ...editingCategory });
    } else {
      setFormData({
        name: '',
        type: 'expense',
        icon: 'MoreHorizontal'
      });
    }
    setError('');
  }, [editingCategory, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Please enter a category name.');
      return;
    }

    const isDuplicate = existingCategories.some(c => 
      c.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      c.type === formData.type &&
      c.id !== (editingCategory ? editingCategory.id : null)
    );

    if (isDuplicate) {
      setError('A category with this name already exists for this type.');
      return;
    }

    onSave({
      ...formData,
      name: formData.name.trim()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 className="h3" style={{ margin: 0 }}>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} style={{ padding: '4px' }}>
            <X size={20} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Type</label>
            <Select name="type" value={formData.type} onChange={handleChange} required>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Category Name</label>
            <Input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="e.g. Groceries"
              required 
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Icon</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              {COMMON_ICONS.map(iconName => {
                const IconComponent = Icons[iconName] || Icons.HelpCircle;
                const isSelected = formData.icon === iconName;
                return (
                  <div 
                    key={iconName}
                    onClick={() => setFormData(prev => ({ ...prev, icon: iconName }))}
                    style={{ 
                      padding: '8px', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      border: `1px solid ${isSelected ? 'var(--color-primary)' : 'transparent'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconComponent size={20} />
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <div style={{ color: 'var(--color-danger)', fontSize: '0.875rem', padding: '8px', backgroundColor: '#fef2f2', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)', justifyContent: 'flex-end' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
