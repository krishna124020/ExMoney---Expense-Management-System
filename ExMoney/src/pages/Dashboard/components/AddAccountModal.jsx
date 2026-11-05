import React, { useState, useEffect } from 'react';
import { X, Landmark, CreditCard, Banknote, Wallet, Building2, Briefcase } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const ACCOUNT_TYPES = [
  { value: 'Savings', label: 'Savings Account', icon: Landmark, color: '#3b82f6' },
  { value: 'Current', label: 'Current Account', icon: Building2, color: '#8b5cf6' },
  { value: 'Salary', label: 'Salary Account', icon: Briefcase, color: '#0ea5e9' },
  { value: 'Credit Card', label: 'Credit Card', icon: CreditCard, color: '#ef4444' },
  { value: 'Cash', label: 'Cash / Wallet', icon: Banknote, color: '#10b981' },
  { value: 'Other', label: 'Other', icon: Wallet, color: '#f59e0b' }
];

export const AddAccountModal = ({ isOpen, onClose, onSave, editingAccount }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    nickname: '',
    accountType: 'Savings',
    last4: '',
    balance: '',
    isActive: true
  });

  useEffect(() => {
    if (isOpen) {
      if (editingAccount) {
        setFormData({
          bankName: editingAccount.bankName || '',
          nickname: editingAccount.nickname || '',
          accountType: editingAccount.accountType || 'Savings',
          last4: editingAccount.last4 || '',
          balance: editingAccount.balance ? editingAccount.balance.toString() : '',
          isActive: editingAccount.isActive !== false
        });
      } else {
        setFormData({
          bankName: '',
          nickname: '',
          accountType: 'Savings',
          last4: '',
          balance: '',
          isActive: true
        });
      }
    }
  }, [isOpen, editingAccount]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Auto-assign color based on type
    const selectedType = ACCOUNT_TYPES.find(t => t.value === formData.accountType) || ACCOUNT_TYPES[0];

    const finalData = {
      ...formData,
      balance: Number(formData.balance),
      iconColor: selectedType.color
    };
    
    if (editingAccount) {
      finalData.id = editingAccount.id;
    }

    onSave(finalData);
  };

  const isCash = formData.accountType === 'Cash';

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '450px', 
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)'
      }}>
        <div className="modal-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)'
        }}>
          <h2 className="h3" style={{ margin: 0 }}>
            {editingAccount ? 'Edit Account' : 'Add Financial Account'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-4)', maxHeight: '70vh', overflowY: 'auto' }}>
          
          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Account Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {ACCOUNT_TYPES.map(type => {
                const Icon = type.icon;
                const isSelected = formData.accountType === type.value;
                return (
                  <div 
                    key={type.value}
                    onClick={() => setFormData({...formData, accountType: type.value})}
                    style={{ 
                      padding: '8px', 
                      borderRadius: 'var(--radius-md)', 
                      border: isSelected ? `2px solid ${type.color}` : '1px solid var(--color-border)',
                      backgroundColor: isSelected ? `${type.color}15` : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.875rem'
                    }}
                  >
                    <Icon size={16} color={isSelected ? type.color : 'var(--color-text-muted)'} />
                    <span style={{ fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                      {type.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
              {isCash ? 'Wallet / Location Name' : 'Bank / Institution Name'}
            </label>
            <input 
              type="text" 
              required
              value={formData.bankName}
              onChange={e => setFormData({...formData, bankName: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
              placeholder={isCash ? 'e.g. Physical Wallet' : 'e.g. HDFC Bank'}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Account Nickname</label>
            <input 
              type="text" 
              required
              value={formData.nickname}
              onChange={e => setFormData({...formData, nickname: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
              placeholder={isCash ? 'e.g. Cash in Hand' : 'e.g. Emergency Fund'}
            />
          </div>

          {!isCash && (
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Last 4 Digits (Optional)</label>
              <input 
                type="text" 
                maxLength="4"
                pattern="\d{4}"
                value={formData.last4}
                onChange={e => setFormData({...formData, last4: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                placeholder="e.g. 4521"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                For security, do not enter your full account number.
              </span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Current Balance (₹)</label>
            <input 
              type="number" 
              required
              value={formData.balance}
              onChange={e => setFormData({...formData, balance: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
              placeholder="e.g. 15000"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              id="isActive"
              checked={formData.isActive}
              onChange={e => setFormData({...formData, isActive: e.target.checked})}
              style={{ width: '16px', height: '16px' }}
            />
            <label htmlFor="isActive" style={{ fontWeight: 500 }}>Set as Active Account</label>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{editingAccount ? 'Save Changes' : 'Add Account'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
