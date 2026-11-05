import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';

const PROVIDERS = ['Cash', 'HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Bank of Baroda', 'Kotak Mahindra Bank', 'Yes Bank', 'IndusInd Bank', 'Paytm', 'PhonePe', 'Other'];
const ACCOUNT_TYPES = ['Savings', 'Current', 'Credit Card', 'Wallet'];

export const AddEditAccountModal = ({ isOpen, onClose, onSave, editingAccount }) => {
  const [formData, setFormData] = useState({
    provider: 'HDFC Bank',
    accountType: 'Savings',
    name: '',
    balance: '',
    creditLimit: ''
  });

  useEffect(() => {
    if (editingAccount) {
      let provider = 'Cash';
      let accountType = 'Savings';
      
      if (editingAccount.type === 'Bank Account') {
        provider = editingAccount.bankName || 'HDFC Bank';
        accountType = editingAccount.bankAccountType || 'Savings';
      } else if (editingAccount.type === 'Credit Card') {
        provider = editingAccount.bankName || 'HDFC Bank';
        accountType = 'Credit Card';
      } else if (editingAccount.type === 'Wallet') {
        provider = editingAccount.bankName || 'Paytm';
        accountType = 'Wallet';
      }

      setFormData({
        provider,
        accountType,
        name: editingAccount.nickname || editingAccount.name || '',
        balance: editingAccount.balance.toString(),
        creditLimit: editingAccount.creditLimit ? editingAccount.creditLimit.toString() : ''
      });
    } else {
      setFormData({
        provider: 'HDFC Bank',
        accountType: 'Savings',
        name: '',
        balance: '',
        creditLimit: ''
      });
    }
  }, [editingAccount, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || formData.balance === '') return;
    
    const parsedBalance = parseFloat(formData.balance);
    
    let type = 'Bank Account';
    let bankName = formData.provider;
    let bankAccountType = formData.accountType;

    if (formData.provider === 'Cash') {
      type = 'Cash';
      bankName = undefined;
      bankAccountType = undefined;
    } else if (formData.accountType === 'Credit Card') {
      type = 'Credit Card';
      bankAccountType = undefined;
    } else if (formData.accountType === 'Wallet') {
      type = 'Wallet';
      bankAccountType = undefined;
    }

    const finalData = {
      bankName,
      nickname: formData.name,
      accountType: type,
      balance: parsedBalance,
      isActive: true,
      last4: editingAccount?.last4 || ''
    };
    
    if (type === 'Credit Card' && formData.creditLimit) {
      finalData.creditLimit = parseFloat(formData.creditLimit);
    }
    
    if (editingAccount) {
      finalData.id = editingAccount.id;
    }
    
    onSave(finalData);
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
            {editingAccount ? 'Edit Account' : 'Add Account'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} style={{ padding: '4px' }}>
            <X size={20} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: formData.provider === 'Cash' ? '1fr' : '1fr 1fr', gap: 'var(--space-4)' }}>
            <Select label="Provider / Bank" name="provider" value={formData.provider} onChange={handleChange} required>
              {PROVIDERS.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>

            {formData.provider !== 'Cash' && (
              <Select label="Account Type" name="accountType" value={formData.accountType} onChange={handleChange} required>
                {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            )}
          </div>
          
          <Input 
            label={formData.accountType === 'Credit Card' ? "Card Name" : "Account Name"} 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder={formData.provider === 'Cash' ? "e.g. Cash Wallet" : "e.g. My Savings"}
          />

          <Input 
            label={formData.accountType === 'Credit Card' ? "Current Outstanding Balance (₹)" : "Current Balance (₹)"} 
            name="balance" 
            type="number" 
            step="0.01"
            value={formData.balance} 
            onChange={handleChange} 
            required 
            placeholder="0.00"
          />

          {formData.accountType === 'Credit Card' && formData.provider !== 'Cash' && (
            <Input 
              label="Credit Limit (Optional, ₹)" 
              name="creditLimit" 
              type="number" 
              step="0.01"
              value={formData.creditLimit} 
              onChange={handleChange} 
              placeholder="0.00"
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Account</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
