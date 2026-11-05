import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useFilters } from '../../context/FilterContext';
import { useCategories } from '../../context/CategoriesContext';
import { useAccounts } from '../../context/AccountsContext';

export const GlobalFilterModal = ({ isOpen, onClose }) => {
  const { filters, updateFilter, clearAllFilters, activeFilterCount } = useFilters();
  const { categories } = useCategories();
  const { accounts } = useAccounts();

  if (!isOpen) return null;

  // Extract unique payment methods dynamically if we had a proper context, 
  // but for now hardcode standard ones per requirement.
  const STANDARD_PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer'];

  const handleCategoryToggle = (categoryName) => {
    const newCats = filters.categories.includes(categoryName)
      ? filters.categories.filter(c => c !== categoryName)
      : [...filters.categories, categoryName];
    updateFilter('categories', newCats);
  };

  const handleAccountToggle = (accountId) => {
    const newAccs = filters.accounts.includes(accountId)
      ? filters.accounts.filter(a => a !== accountId)
      : [...filters.accounts, accountId];
    updateFilter('accounts', newAccs);
  };

  const handlePaymentMethodToggle = (method) => {
    const newMethods = filters.paymentMethods.includes(method)
      ? filters.paymentMethods.filter(m => m !== method)
      : [...filters.paymentMethods, method];
    updateFilter('paymentMethods', newMethods);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        margin: 'var(--space-4)'
      }}>
        {/* Header */}
        <div style={{
          padding: 'var(--space-4)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            Global Filters {activeFilterCount > 0 && <span style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>({activeFilterCount} active)</span>}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-4)', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Date & Type */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Date Range</label>
              <select 
                value={filters.dateRange}
                onChange={(e) => updateFilter('dateRange', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
              >
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="This Year">This Year</option>
                <option value="Custom">Custom Date Range</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Transaction Type</label>
              <select 
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
              >
                <option value="All">All Types</option>
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
          </div>

          {/* Custom Date Inputs */}
          {filters.dateRange === 'Custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Start Date</label>
                <input 
                  type="date"
                  value={filters.customDateStart}
                  onChange={(e) => updateFilter('customDateStart', e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>End Date</label>
                <input 
                  type="date"
                  value={filters.customDateEnd}
                  onChange={(e) => updateFilter('customDateEnd', e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
              </div>
            </div>
          )}

          {/* Categories */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Categories</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories?.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryToggle(c.name)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${filters.categories.includes(c.name) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: filters.categories.includes(c.name) ? 'var(--color-primary-light)' : 'var(--color-bg)',
                    color: filters.categories.includes(c.name) ? 'var(--color-primary)' : 'var(--color-text)',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Accounts & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Accounts</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {accounts?.map(a => (
                  <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={filters.accounts.includes(a.id)}
                      onChange={() => handleAccountToggle(a.id)}
                    />
                    {a.name} (••••{a.last4})
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Status</label>
              <select 
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Payment Method</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {STANDARD_PAYMENT_METHODS.map(m => (
                <button
                  key={m}
                  onClick={() => handlePaymentMethodToggle(m)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${filters.paymentMethods.includes(m) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: filters.paymentMethods.includes(m) ? 'var(--color-primary-light)' : 'var(--color-bg)',
                    color: filters.paymentMethods.includes(m) ? 'var(--color-primary)' : 'var(--color-text)',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Amount Range (₹)</label>
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <input 
                type="number"
                placeholder="Min"
                value={filters.minAmount}
                onChange={(e) => updateFilter('minAmount', e.target.value)}
                style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
              />
              <span style={{ color: 'var(--color-text-muted)' }}>to</span>
              <input 
                type="number"
                placeholder="Max"
                value={filters.maxAmount}
                onChange={(e) => updateFilter('maxAmount', e.target.value)}
                style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
              />
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div style={{
          padding: 'var(--space-4)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          backgroundColor: 'var(--color-bg)'
        }}>
          <Button variant="outline" onClick={clearAllFilters} disabled={activeFilterCount === 0}>
            Clear All
          </Button>
          <Button variant="primary" onClick={onClose}>
            Apply Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </Button>
        </div>
      </div>
    </div>
  );
};
