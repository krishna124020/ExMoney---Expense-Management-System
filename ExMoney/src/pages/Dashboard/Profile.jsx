import React, { useState, useRef } from 'react';
import { User, Landmark, CreditCard, Banknote, Building2, Wallet, Edit2, Trash2, Camera, Plus, Briefcase, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAccounts } from '../../context/AccountsContext';
import { AddAccountModal } from './components/AddAccountModal';

const getAccountIcon = (type) => {
  switch (type) {
    case 'Savings': return Landmark;
    case 'Current': return Building2;
    case 'Salary': return Briefcase;
    case 'Credit Card': return CreditCard;
    case 'Cash': return Banknote;
    default: return Wallet;
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const Profile = () => {
  const { accounts, addAccount, editAccount, deleteAccount } = useAccounts();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isPhotoEnlarged, setIsPhotoEnlarged] = useState(false);
  const fileInputRef = useRef(null);

  // Initial Mock Profile Data
  const initialProfileData = {
    avatar: '',
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+91 98765 43210',
    dob: '1995-08-15',
    gender: 'Female',
    occupation: 'Software Engineer',
    city: 'Mumbai',
    country: 'India'
  };

  const [profileData, setProfileData] = useState(initialProfileData);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleResetProfile = () => {
    setProfileData(initialProfileData);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // In a real app, API call goes here
    alert("Profile saved successfully! (Frontend only)");
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleSaveAccount = (accountData) => {
    if (accountData.id) {
      editAccount(accountData);
    } else {
      addAccount(accountData);
    }
    setIsAddModalOpen(false);
    setEditingAccount(null);
  };

  const openAddAccount = () => {
    setEditingAccount(null);
    setIsAddModalOpen(true);
  };

  const openEditAccount = (account) => {
    setEditingAccount(account);
    setIsAddModalOpen(true);
  };

  const handleRemoveAccount = (accountId) => {
    if (window.confirm("Are you sure you want to remove this account?")) {
      deleteAccount(accountId);
    }
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-2) 0' }}>Profile & Accounts</h1>
          <p className="text-muted" style={{ margin: 0 }}>Manage your personal information and financial accounts.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        
        {/* Section 1: Personal Information Form */}
        <section>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h2 className="h3" style={{ margin: 0 }}>Personal Information</h2>
          </div>
          
          <form className="dashboard-card" onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', padding: 'var(--space-6)' }}>
            
            {/* Avatar Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                style={{ display: 'none' }} 
              />
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', 
                backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                position: 'relative', overflow: 'hidden'
              }}>
                {profileData.avatar ? (
                  <img 
                    src={profileData.avatar} 
                    alt={profileData.fullName} 
                    onClick={() => setIsPhotoEnlarged(true)}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', cursor: 'zoom-in' }} 
                  />
                ) : (
                  <User size={40} />
                )}
                <div onClick={handlePhotoClick} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '24px', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Camera size={12} color="#fff" />
                </div>
              </div>
              <div>
                <Button type="button" variant="outline" size="sm" onClick={handlePhotoClick}>Edit Photo</Button>
              </div>
            </div>

            {/* Form Fields (Single Column) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Full Name</label>
                <input 
                  type="text" name="fullName" value={profileData.fullName} onChange={handleProfileChange} required
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} 
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
                <input 
                  type="email" name="email" value={profileData.email} onChange={handleProfileChange} required
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} 
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Phone Number</label>
                <input 
                  type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} required
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} 
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Date of Birth</label>
                <input 
                  type="date" name="dob" value={profileData.dob} onChange={handleProfileChange} required
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} 
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Gender</label>
                <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', padding: '0.25rem 0' }}>
                  {['Male', 'Female', 'Other', 'Prefer not to say'].map(option => (
                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="gender" 
                        value={option} 
                        checked={profileData.gender === option} 
                        onChange={handleProfileChange} 
                        required 
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '0.875rem' }}>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Occupation</label>
                <input 
                  type="text" name="occupation" value={profileData.occupation} onChange={handleProfileChange} required
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} 
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>City</label>
                <input 
                  type="text" name="city" value={profileData.city} onChange={handleProfileChange} required
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} 
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.875rem' }}>Country</label>
                <input 
                  type="text" name="country" value={profileData.country} onChange={handleProfileChange} required
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} 
                />
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-2)' }}>
              <Button type="button" variant="outline" onClick={handleResetProfile}>Cancel / Reset</Button>
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>
            
          </form>
        </section>

        {/* Section 2: Financial Accounts List */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 className="h3" style={{ margin: 0 }}>Financial Accounts</h2>
            <Button onClick={openAddAccount}>
              <Plus size={18} style={{ marginRight: '8px' }} /> Add Account
            </Button>
          </div>

          <div className="dashboard-card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem', width: '35%' }}>Account</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Type</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Balance</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Status</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => {
                  const Icon = getAccountIcon(acc.accountType);
                  return (
                    <tr key={acc.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div style={{ 
                            width: '36px', height: '36px', borderRadius: '8px', 
                            backgroundColor: `${acc.iconColor || 'var(--color-primary)'}15`, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Icon size={18} color={acc.iconColor || 'var(--color-primary)'} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{acc.bankName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{acc.nickname}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>{acc.accountType}</div>
                        {acc.last4 && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>•••• {acc.last4}</div>}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', verticalAlign: 'middle', fontWeight: 600 }}>
                        {formatCurrency(acc.balance)}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', verticalAlign: 'middle' }}>
                        <span style={{ 
                          display: 'inline-block', padding: '4px 8px', borderRadius: 'var(--radius-full)', 
                          backgroundColor: acc.isActive !== false ? 'var(--color-primary-light)' : 'var(--color-bg)', 
                          color: acc.isActive !== false ? 'var(--color-primary)' : 'var(--color-text-muted)', 
                          fontSize: '0.75rem', fontWeight: 500 
                        }}>
                          {acc.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => openEditAccount(acc)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }} title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleRemoveAccount(acc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', padding: '4px' }} title="Remove">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {accounts.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No financial accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      <AddAccountModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAccount(null);
        }} 
        onSave={handleSaveAccount}
        editingAccount={editingAccount}
      />

      {/* Enlarged Photo Overlay */}
      {isPhotoEnlarged && profileData.avatar && (
        <div 
          onClick={() => setIsPhotoEnlarged(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out'
          }}
        >
          <img 
            src={profileData.avatar} 
            alt="Enlarged profile" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              width: '100%', maxWidth: '320px', height: '320px', 
              borderRadius: '50%', objectFit: 'cover',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              cursor: 'default'
            }} 
          />
          <button 
            onClick={() => setIsPhotoEnlarged(false)}
            style={{
              position: 'absolute', top: 'var(--space-6)', right: 'var(--space-6)',
              background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
              padding: '8px'
            }}
          >
            <X size={32} />
          </button>
        </div>
      )}
    </div>
  );
};
