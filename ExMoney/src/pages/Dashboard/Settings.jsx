import React, { useState } from 'react';
import { Sliders, CreditCard, PieChart, Bell, Shield, Lock, User, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Toast, ToastContainer } from '../../components/ui/Toast';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import './Settings.css';

const TABS = [
  { id: 'general', label: 'General', description: 'Basic application settings', icon: Sliders },
  { id: 'transaction', label: 'Transaction Preferences', description: 'Defaults for adding transactions', icon: CreditCard },
  { id: 'budget', label: 'Budget & Financial Alerts', description: 'Manage budget thresholds and alerts', icon: PieChart },
  { id: 'notifications', label: 'Notification Preferences', description: 'Email and push notifications', icon: Bell },
  { id: 'security', label: 'Privacy & Security', description: 'Password, authentication, and data', icon: Shield },
  { id: 'account', label: 'Account', description: 'Account deletion and management', icon: User },
];

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [toastMsg, setToastMsg] = useState('');

  // General Settings State
  const initialGeneralState = {
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    language: 'English',
    firstDayOfWeek: 'Monday',
    theme: 'System Default',
    amountDisplay: '₹45,000'
  };
  
  const [generalState, setGeneralState] = useState(initialGeneralState);

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralState(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveGeneral = () => {
    // Mock save
    setToastMsg("Settings saved successfully!");
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleResetGeneral = () => {
    setGeneralState(initialGeneralState);
  };

  // Transaction Preferences State
  const initialTransactionState = {
    defaultTransactionType: 'Expense',
    defaultAccountId: 'hdfc-4521',
    defaultCategoryId: 'food',
    rememberLastAccount: true,
    rememberLastCategory: true,
    confirmBeforeDelete: true,
    defaultTransactionView: 'List',
    showNotes: true,
    showAccountName: true,
    showCategory: true
  };

  const [transactionState, setTransactionState] = useState(initialTransactionState);

  const handleTransactionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTransactionState(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSaveTransaction = () => {
    // Mock save
    setToastMsg("Transaction preferences saved.");
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleResetTransaction = () => {
    setTransactionState(initialTransactionState);
  };

  // Budget & Financial Alerts State
  const initialBudgetState = {
    budgetLimitAlerts: true,
    budgetLimitThreshold: '90%',
    overspendingAlerts: true,
    lowBalanceAlert: false,
    lowBalanceThreshold: '5000',
    goalProgressAlerts: true,
    upcomingBillAlerts: true,
    upcomingBillTimeframe: '3 days',
    monthlySummary: true
  };

  const [budgetState, setBudgetState] = useState(initialBudgetState);

  const handleBudgetChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBudgetState(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSaveBudget = () => {
    setToastMsg("Budget & Alert preferences saved.");
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleResetBudget = () => {
    setBudgetState(initialBudgetState);
  };

  // Notification Preferences State
  const initialNotificationState = {
    emailNotifications: true,
    pushNotifications: true,
    budgetAlertsNotif: true,
    goalSavingsUpdates: true,
    billReminders: true,
    monthlySummaryNotif: true,
    generalUpdates: false,
    notificationSound: true,
    quietHours: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00'
  };

  const [notificationState, setNotificationState] = useState(initialNotificationState);

  const handleNotificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationState(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSaveNotification = () => {
    setToastMsg("Notification preferences saved.");
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleResetNotification = () => {
    setNotificationState(initialNotificationState);
  };

  // Security State
  const initialSecurityState = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    transactionPin: false,
    pin: '',
    hideFinancialInfo: false,
    autoLogout: '30 minutes'
  };

  const [securityState, setSecurityState] = useState(initialSecurityState);
  
  // Dialogs state
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecurityState(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSaveSecurity = () => {
    if (securityState.newPassword && securityState.newPassword !== securityState.confirmPassword) {
      setToastMsg("Passwords do not match.");
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }
    setToastMsg("Security preferences saved.");
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleResetSecurity = () => {
    setSecurityState(initialSecurityState);
  };

  // Account State
  const initialAccountState = {
    newEmail: '',
    confirmEmail: '',
    newPhone: '',
  };
  const [accountState, setAccountState] = useState(initialAccountState);

  const [showSignOutAllDialog, setShowSignOutAllDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountState(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAccount = () => {
    if (accountState.newEmail && accountState.newEmail !== accountState.confirmEmail) {
      setToastMsg("Emails do not match.");
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }
    setToastMsg("Account settings saved.");
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleResetAccount = () => {
    setAccountState(initialAccountState);
  };

  const handleClearData = () => {
    setToastMsg("Local data cleared.");
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSignOutAll = () => {
    setToastMsg("Signed out of all other devices.");
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDeactivateAccount = () => {
    setToastMsg("Account deactivated.");
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDeleteAccount = () => {
    setToastMsg("Account deletion requested.");
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="dashboard-container settings-page">
      <div className="dashboard-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-2) 0' }}>Settings</h1>
          <p className="text-muted" style={{ margin: 0 }}>Manage your application preferences and configurations.</p>
        </div>
      </div>

      <div className="settings-container">
        {/* Sidebar Navigation */}
        <div className="settings-sidebar dashboard-card">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`settings-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="settings-nav-icon">
                  <Icon size={20} />
                </div>
                <div className="settings-nav-text">
                  <span className="settings-nav-label">{tab.label}</span>
                  <span className="settings-nav-desc">{tab.description}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="settings-content dashboard-card">
          {activeTab === 'general' && (
            <div className="animation-fade-in settings-section">
              <div className="settings-section-header">
                <h2 className="h3">General Settings</h2>
                <p className="text-muted">Configure the basic functionality of your application.</p>
              </div>
              
              <div className="settings-form">
                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <Select
                      label="Currency"
                      name="currency"
                      value={generalState.currency}
                      onChange={handleGeneralChange}
                      options={[
                        { value: 'INR', label: 'INR (₹)' },
                        { value: 'USD', label: 'USD ($)' },
                        { value: 'EUR', label: 'EUR (€)' },
                        { value: 'GBP', label: 'GBP (£)' },
                        { value: 'JPY', label: 'JPY (¥)' },
                        { value: 'CAD', label: 'CAD ($)' },
                        { value: 'AUD', label: 'AUD ($)' },
                        { value: 'CHF', label: 'CHF (Fr)' },
                      ]}
                    />
                    <span className="settings-form-help">Default currency for all transactions and budgets.</span>
                  </div>

                  <div className="settings-form-group">
                    <Select
                      label="Amount Display"
                      name="amountDisplay"
                      value={generalState.amountDisplay}
                      onChange={handleGeneralChange}
                      options={[
                        { value: '₹45,000', label: '₹45,000 (No Decimals)' },
                        { value: '₹45,000.00', label: '₹45,000.00 (With Decimals)' },
                      ]}
                    />
                    <span className="settings-form-help">How monetary amounts are displayed.</span>
                  </div>
                </div>

                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <Select
                      label="Date Format"
                      name="dateFormat"
                      value={generalState.dateFormat}
                      onChange={handleGeneralChange}
                      options={[
                        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                      ]}
                    />
                    <span className="settings-form-help">Display format for transaction dates.</span>
                  </div>

                  <div className="settings-form-group">
                    <Select
                      label="First Day of Week"
                      name="firstDayOfWeek"
                      value={generalState.firstDayOfWeek}
                      onChange={handleGeneralChange}
                      options={[
                        { value: 'Monday', label: 'Monday' },
                        { value: 'Sunday', label: 'Sunday' },
                      ]}
                    />
                    <span className="settings-form-help">Starting day for weekly reports and calendars.</span>
                  </div>
                </div>

                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <Select
                      label="Language"
                      name="language"
                      value={generalState.language}
                      onChange={handleGeneralChange}
                      options={[
                        { value: 'English', label: 'English' },
                        { value: 'Hindi', label: 'Hindi' },
                        { value: 'Spanish', label: 'Spanish' },
                        { value: 'French', label: 'French' },
                        { value: 'German', label: 'German' },
                        { value: 'Italian', label: 'Italian' },
                        { value: 'Portuguese', label: 'Portuguese' },
                        { value: 'Chinese', label: 'Chinese' },
                        { value: 'Japanese', label: 'Japanese' },
                      ]}
                    />
                    <span className="settings-form-help">Interface language.</span>
                  </div>

                  <div className="settings-form-group">
                    <Select
                      label="Theme"
                      name="theme"
                      value={generalState.theme}
                      onChange={handleGeneralChange}
                      options={[
                        { value: 'System Default', label: 'System Default' },
                        { value: 'Light', label: 'Light' },
                        { value: 'Dark', label: 'Dark' },
                      ]}
                    />
                    <span className="settings-form-help">Application visual theme.</span>
                  </div>
                </div>
                
                <hr className="settings-divider" />

                <div className="settings-actions">
                  <Button variant="outline" onClick={handleResetGeneral}>Reset Changes</Button>
                  <Button variant="primary" onClick={handleSaveGeneral}>Save Changes</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transaction' && (
            <div className="animation-fade-in settings-section">
              <div className="settings-section-header">
                <h2 className="h3">Transaction Preferences</h2>
                <p className="text-muted">Customize how ExMoney handles and displays your transactions.</p>
              </div>
              
              <div className="settings-form">
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>1. Default Transaction Settings</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <Select
                      label="Default Transaction Type"
                      name="defaultTransactionType"
                      value={transactionState.defaultTransactionType}
                      onChange={handleTransactionChange}
                      options={[
                        { value: 'Expense', label: 'Expense' },
                        { value: 'Income', label: 'Income' },
                      ]}
                    />
                  </div>
                </div>

                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <Select
                      label="Default Account"
                      name="defaultAccountId"
                      value={transactionState.defaultAccountId}
                      onChange={handleTransactionChange}
                      options={[
                        { value: 'hdfc-4521', label: 'HDFC Bank ••••4521' },
                        { value: 'sbi-8712', label: 'State Bank of India ••••8712' },
                        { value: 'cash', label: 'Cash Wallet' },
                      ]}
                    />
                  </div>
                  <div className="settings-form-group">
                    <Select
                      label="Default Category"
                      name="defaultCategoryId"
                      value={transactionState.defaultCategoryId}
                      onChange={handleTransactionChange}
                      options={[
                        { value: 'food', label: 'Food' },
                        { value: 'transport', label: 'Transport' },
                        { value: 'shopping', label: 'Shopping' },
                        { value: 'bills', label: 'Bills' },
                        { value: 'entertainment', label: 'Entertainment' },
                        { value: 'salary', label: 'Salary' },
                        { value: 'other', label: 'Other' },
                      ]}
                    />
                  </div>
                </div>

                <hr className="settings-divider" />
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>2. Transaction Behavior</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Remember Last Used Account</span>
                      <span className="settings-form-help">Automatically use the account selected for your previous transaction.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="rememberLastAccount" checked={transactionState.rememberLastAccount} onChange={handleTransactionChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Remember Last Used Category</span>
                      <span className="settings-form-help">Automatically use the category selected for your previous transaction.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="rememberLastCategory" checked={transactionState.rememberLastCategory} onChange={handleTransactionChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Confirm Before Deleting</span>
                      <span className="settings-form-help">Ask for confirmation before permanently deleting a transaction.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="confirmBeforeDelete" checked={transactionState.confirmBeforeDelete} onChange={handleTransactionChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <hr className="settings-divider" />
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>3. Transaction Display</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <Select
                      label="Default Transaction View"
                      name="defaultTransactionView"
                      value={transactionState.defaultTransactionView}
                      onChange={handleTransactionChange}
                      options={[
                        { value: 'List', label: 'List' },
                        { value: 'Compact List', label: 'Compact List' },
                      ]}
                    />
                  </div>
                </div>

                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Show Transaction Notes</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="showNotes" checked={transactionState.showNotes} onChange={handleTransactionChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Show Account Name</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="showAccountName" checked={transactionState.showAccountName} onChange={handleTransactionChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Show Category</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="showCategory" checked={transactionState.showCategory} onChange={handleTransactionChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <hr className="settings-divider" />

                <div className="settings-actions">
                  <Button variant="outline" onClick={handleResetTransaction}>Reset Changes</Button>
                  <Button variant="primary" onClick={handleSaveTransaction}>Save Changes</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="animation-fade-in settings-section">
              <div className="settings-section-header">
                <h2 className="h3">Budget & Financial Alerts</h2>
                <p className="text-muted">Manage your notifications and thresholds for budgets and balances.</p>
              </div>
              
              <div className="settings-form">
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>1. Budget Alerts</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Budget Limit Alerts</span>
                      <span className="settings-form-help">Get notified when you approach your budget limit.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="budgetLimitAlerts" checked={budgetState.budgetLimitAlerts} onChange={handleBudgetChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                {budgetState.budgetLimitAlerts && (
                  <div className="settings-form-row">
                    <div className="settings-form-group" style={{ marginLeft: 'var(--space-4)' }}>
                      <Select
                        label="Alert Threshold"
                        name="budgetLimitThreshold"
                        value={budgetState.budgetLimitThreshold}
                        onChange={handleBudgetChange}
                        options={[
                          { value: '50%', label: '50% of budget' },
                          { value: '75%', label: '75% of budget' },
                          { value: '90%', label: '90% of budget' },
                          { value: '100%', label: '100% (When exceeded)' },
                        ]}
                      />
                    </div>
                  </div>
                )}
                
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Overspending Alerts</span>
                      <span className="settings-form-help">Alert when your spending exceeds a specific budget.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="overspendingAlerts" checked={budgetState.overspendingAlerts} onChange={handleBudgetChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <hr className="settings-divider" />
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>2. Balance & Goals</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Low Balance Alert</span>
                      <span className="settings-form-help">Get notified when your account balance falls below a minimum.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="lowBalanceAlert" checked={budgetState.lowBalanceAlert} onChange={handleBudgetChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                {budgetState.lowBalanceAlert && (
                  <div className="settings-form-row">
                    <div className="settings-form-group" style={{ marginLeft: 'var(--space-4)', maxWidth: '200px' }}>
                      <Input
                        label="Minimum Balance Threshold"
                        type="number"
                        name="lowBalanceThreshold"
                        value={budgetState.lowBalanceThreshold}
                        onChange={handleBudgetChange}
                        min="0"
                      />
                    </div>
                  </div>
                )}
                
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Goal Progress Alerts</span>
                      <span className="settings-form-help">Notify when savings goals reach important milestones.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="goalProgressAlerts" checked={budgetState.goalProgressAlerts} onChange={handleBudgetChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <hr className="settings-divider" />
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>3. Scheduled & Summaries</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Upcoming Bill / Scheduled Transaction Alerts</span>
                      <span className="settings-form-help">Reminders for upcoming scheduled transactions.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="upcomingBillAlerts" checked={budgetState.upcomingBillAlerts} onChange={handleBudgetChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                {budgetState.upcomingBillAlerts && (
                  <div className="settings-form-row">
                    <div className="settings-form-group" style={{ marginLeft: 'var(--space-4)' }}>
                      <Select
                        label="Notify Me"
                        name="upcomingBillTimeframe"
                        value={budgetState.upcomingBillTimeframe}
                        onChange={handleBudgetChange}
                        options={[
                          { value: '1 day', label: '1 day before' },
                          { value: '3 days', label: '3 days before' },
                          { value: '7 days', label: '7 days before' },
                        ]}
                      />
                    </div>
                  </div>
                )}
                
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Monthly Financial Summary</span>
                      <span className="settings-form-help">Receive a monthly summary of your income, expenses, and savings.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="monthlySummary" checked={budgetState.monthlySummary} onChange={handleBudgetChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <hr className="settings-divider" />

                <div className="settings-actions">
                  <Button variant="outline" onClick={handleResetBudget}>Reset Changes</Button>
                  <Button variant="primary" onClick={handleSaveBudget}>Save Changes</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animation-fade-in settings-section">
              <div className="settings-section-header">
                <h2 className="h3">Notification Preferences</h2>
                <p className="text-muted">Manage how and when ExMoney contacts you.</p>
              </div>
              
              <div className="settings-form">
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>1. Delivery Methods</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Email Notifications</span>
                      <span className="settings-form-help">Receive alerts and summaries via your registered email address.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="emailNotifications" checked={notificationState.emailNotifications} onChange={handleNotificationChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Push Notifications</span>
                      <span className="settings-form-help">Receive instant push notifications on your device.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="pushNotifications" checked={notificationState.pushNotifications} onChange={handleNotificationChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <hr className="settings-divider" />
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>2. Alert Types</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Budget Alerts</span>
                      <span className="settings-form-help">Notifications related to budget limits and overspending.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="budgetAlertsNotif" checked={notificationState.budgetAlertsNotif} onChange={handleNotificationChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Goal & Savings Updates</span>
                      <span className="settings-form-help">Notifications about savings goals and progress.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="goalSavingsUpdates" checked={notificationState.goalSavingsUpdates} onChange={handleNotificationChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Bill & Scheduled Reminders</span>
                      <span className="settings-form-help">Reminders for upcoming scheduled transactions.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="billReminders" checked={notificationState.billReminders} onChange={handleNotificationChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Monthly Financial Summary</span>
                      <span className="settings-form-help">Receive your monthly financial summary report.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="monthlySummaryNotif" checked={notificationState.monthlySummaryNotif} onChange={handleNotificationChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">General & Promotional Updates</span>
                      <span className="settings-form-help">News, tips, and promotional offers from ExMoney.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="generalUpdates" checked={notificationState.generalUpdates} onChange={handleNotificationChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <hr className="settings-divider" />
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>3. Sound & Timing</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Notification Sound</span>
                      <span className="settings-form-help">Play a sound when a notification is received.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="notificationSound" checked={notificationState.notificationSound} onChange={handleNotificationChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Quiet Hours</span>
                      <span className="settings-form-help">Mute all notifications during specific hours.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="quietHours" checked={notificationState.quietHours} onChange={handleNotificationChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                {notificationState.quietHours && (
                  <div className="settings-form-row">
                    <div className="settings-form-group" style={{ marginLeft: 'var(--space-4)', maxWidth: '200px' }}>
                      <Input
                        label="Start Time"
                        type="time"
                        name="quietHoursStart"
                        value={notificationState.quietHoursStart}
                        onChange={handleNotificationChange}
                      />
                    </div>
                    <div className="settings-form-group" style={{ maxWidth: '200px' }}>
                      <Input
                        label="End Time"
                        type="time"
                        name="quietHoursEnd"
                        value={notificationState.quietHoursEnd}
                        onChange={handleNotificationChange}
                      />
                    </div>
                  </div>
                )}

                <hr className="settings-divider" />

                <div className="settings-actions">
                  <Button variant="outline" onClick={handleResetNotification}>Reset Changes</Button>
                  <Button variant="primary" onClick={handleSaveNotification}>Save Changes</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animation-fade-in settings-section">
              <div className="settings-section-header">
                <h2 className="h3">Privacy & Security</h2>
                <p className="text-muted">Manage your password, authentication, data, and session security.</p>
              </div>
              
              <div className="settings-form">
                <h3 className="h5" style={{ marginBottom: '-10px' }}>1. Change Password</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group" style={{ position: 'relative' }}>
                    <Input
                      label="Current Password"
                      type="password"
                      name="currentPassword"
                      value={securityState.currentPassword}
                      onChange={handleSecurityChange}
                    />
                    <a href="#" className="text-primary" style={{ fontSize: '0.8rem', position: 'absolute', top: '2px', right: '0', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); setToastMsg('Password reset link sent to your email.'); setTimeout(() => setToastMsg(''), 3000); }}>Forgot password?</a>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <Input
                      label="New Password"
                      type="password"
                      name="newPassword"
                      value={securityState.newPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  <div className="settings-form-group">
                    <Input
                      label="Confirm New Password"
                      type="password"
                      name="confirmPassword"
                      value={securityState.confirmPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                </div>

                <hr className="settings-divider" />
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>2. Advanced Security</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Two-Factor Authentication (2FA)</span>
                      <span className="settings-form-help">Status: {securityState.twoFactorAuth ? 'Enabled' : 'Disabled'}. Add an extra layer of security.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="twoFactorAuth" checked={securityState.twoFactorAuth} onChange={handleSecurityChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Transaction PIN</span>
                      <span className="settings-form-help">Require a PIN for adding or modifying transactions.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="transactionPin" checked={securityState.transactionPin} onChange={handleSecurityChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
                {securityState.transactionPin && (
                  <div className="settings-form-row">
                    <div className="settings-form-group" style={{ marginLeft: 'var(--space-4)', maxWidth: '200px' }}>
                      <Input
                        label="Enter 4-Digit PIN"
                        type="password"
                        name="pin"
                        maxLength="4"
                        value={securityState.pin}
                        onChange={handleSecurityChange}
                      />
                    </div>
                  </div>
                )}

                <div className="settings-form-row">
                  <div className="settings-form-group settings-toggle-group">
                    <div className="settings-toggle-text">
                      <span className="settings-form-label">Hide Financial Information</span>
                      <span className="settings-form-help">Mask sensitive amounts like balances and totals on the dashboard.</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" name="hideFinancialInfo" checked={securityState.hideFinancialInfo} onChange={handleSecurityChange} />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <hr className="settings-divider" />
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>3. Session Management</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <Select
                      label="Auto Logout"
                      name="autoLogout"
                      value={securityState.autoLogout}
                      onChange={handleSecurityChange}
                      options={[
                        { value: '15 minutes', label: '15 minutes' },
                        { value: '30 minutes', label: '30 minutes' },
                        { value: '1 hour', label: '1 hour' },
                        { value: 'Never', label: 'Never' },
                      ]}
                    />
                    <span className="settings-form-help">Automatically log out after a period of inactivity.</span>
                  </div>
                </div>
                
                <div className="settings-form-group" style={{ marginTop: 'var(--space-4)' }}>
                  <span className="settings-form-label" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Recent Login Activity</span>
                  <div className="dashboard-card" style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border)', boxShadow: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>Windows - Chrome</strong>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>Location: Mumbai, India • Status: Active now</div>
                      </div>
                      <Button variant="outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Sign out</Button>
                    </div>
                  </div>
                </div>

                <hr className="settings-divider" />
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>4. Privacy & Data</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <span className="settings-form-label">Export Financial Data</span>
                    <span className="settings-form-help">Download a complete record of your transactions, accounts, and budgets in CSV format.</span>
                    <Button variant="outline" style={{ alignSelf: 'flex-start', marginTop: 'var(--space-2)' }}>Download CSV</Button>
                  </div>
                </div>

                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <span className="settings-form-label">Clear Local Data</span>
                    <span className="settings-form-help">Clear all cached data stored on this device. This will not delete your account data on the server.</span>
                    <Button variant="outline" onClick={() => setShowClearDataDialog(true)} style={{ alignSelf: 'flex-start', marginTop: 'var(--space-2)' }}>Clear Data</Button>
                  </div>
                </div>

                <hr className="settings-divider" />

                <div className="settings-actions">
                  <Button variant="outline" onClick={handleResetSecurity}>Reset Changes</Button>
                  <Button variant="primary" onClick={handleSaveSecurity}>Save Changes</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="animation-fade-in settings-section">
              <div className="settings-section-header">
                <h2 className="h3">Account Management</h2>
                <p className="text-muted">Manage your account credentials, connections, and lifecycle.</p>
              </div>
              
              <div className="settings-form">
                <h3 className="h5" style={{ marginBottom: '-10px' }}>1. Update Credentials</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <Input
                      label="New Email Address"
                      type="email"
                      name="newEmail"
                      value={accountState.newEmail}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="settings-form-group">
                    <Input
                      label="Confirm New Email"
                      type="email"
                      name="confirmEmail"
                      value={accountState.confirmEmail}
                      onChange={handleAccountChange}
                    />
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group" style={{ maxWidth: '300px' }}>
                    <Input
                      label="Update Phone Number"
                      type="tel"
                      name="newPhone"
                      placeholder="+1 (555) 000-0000"
                      value={accountState.newPhone}
                      onChange={handleAccountChange}
                    />
                  </div>
                </div>

                <hr className="settings-divider" />
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>2. Connected Accounts</h3>
                <div className="settings-form-group">
                  <div className="dashboard-card" style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border)', boxShadow: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        </div>
                        <div>
                          <strong>Google</strong>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Connected as user@example.com</div>
                        </div>
                      </div>
                      <Button variant="outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Disconnect</Button>
                    </div>
                  </div>
                </div>

                <hr className="settings-divider" />
                
                <h3 className="h5" style={{ marginBottom: '-10px' }}>3. Session Actions</h3>
                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <Button variant="outline" style={{ alignSelf: 'flex-start' }} onClick={() => { setToastMsg('Signed out.'); setTimeout(() => setToastMsg(''), 3000); }}>Sign Out</Button>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <span className="settings-form-label">Sign Out of All Devices</span>
                    <span className="settings-form-help">Log out of all active sessions across all devices immediately.</span>
                    <Button variant="outline" onClick={() => setShowSignOutAllDialog(true)} style={{ alignSelf: 'flex-start', marginTop: 'var(--space-2)' }}>Sign Out All</Button>
                  </div>
                </div>

                <hr className="settings-divider" />

                <div className="settings-actions">
                  <Button variant="outline" onClick={handleResetAccount}>Reset Changes</Button>
                  <Button variant="primary" onClick={handleSaveAccount}>Save Changes</Button>
                </div>
                
                <h3 className="h5" style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-4)', color: 'rgb(239, 68, 68)' }}>Danger Zone</h3>
                <div className="dashboard-card" style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', boxShadow: 'none' }}>
                  
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <h4 className="h6" style={{ margin: '0 0 var(--space-1) 0' }}>Deactivate Account</h4>
                    <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: 'var(--space-3)' }}>
                      Temporarily disable your account. Your data will be preserved, but you won't be able to log in until you reactivate it.
                    </p>
                    <Button variant="outline" onClick={() => setShowDeactivateDialog(true)}>Deactivate Account</Button>
                  </div>

                  <hr className="settings-divider" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }} />

                  <div>
                    <h4 className="h6" style={{ margin: '0 0 var(--space-1) 0', color: 'rgb(239, 68, 68)' }}>Delete Account Permanently</h4>
                    <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: 'var(--space-3)' }}>
                      Once you delete your account, there is no going back. This will permanently delete all your financial data, budgets, and settings.
                    </p>
                    <Button variant="danger" onClick={() => setShowDeleteAccountDialog(true)}>Delete My Account</Button>
                  </div>

                </div>
              </div>
            </div>
          )}

          {activeTab !== 'general' && activeTab !== 'transaction' && activeTab !== 'budget' && activeTab !== 'notifications' && activeTab !== 'security' && activeTab !== 'account' && (
            <div className="animation-fade-in settings-placeholder">
              <div className="settings-placeholder-icon">
                {React.createElement(TABS.find(t => t.id === activeTab)?.icon || Sliders, { size: 48 })}
              </div>
              <h3 className="h4">{TABS.find(t => t.id === activeTab)?.label}</h3>
              <p className="text-muted">This settings section has not been implemented yet.</p>
            </div>
          )}
        </div>
      </div>

      {toastMsg && (
        <ToastContainer>
          <Toast 
            message={toastMsg} 
            type="success" 
            onClose={() => setToastMsg('')} 
            icon={<CheckCircle2 size={20} />}
          />
        </ToastContainer>
      )}

      <ConfirmDialog
        isOpen={showClearDataDialog}
        onClose={() => setShowClearDataDialog(false)}
        onConfirm={handleClearData}
        title="Clear Local Data"
        message="Are you sure you want to clear all locally cached data? You will need to log in again to sync your information."
        confirmText="Clear Data"
      />

      <ConfirmDialog
        isOpen={showDeleteAccountDialog}
        onClose={() => setShowDeleteAccountDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure? This action cannot be undone and all your financial data will be permanently deleted."
        confirmText="Delete Account"
        isDanger={true}
      />

      <ConfirmDialog
        isOpen={showSignOutAllDialog}
        onClose={() => setShowSignOutAllDialog(false)}
        onConfirm={handleSignOutAll}
        title="Sign Out of All Devices"
        message="This will log you out of all active sessions on other devices. You will need to log back in on those devices."
        confirmText="Sign Out All"
      />

      <ConfirmDialog
        isOpen={showDeactivateDialog}
        onClose={() => setShowDeactivateDialog(false)}
        onConfirm={handleDeactivateAccount}
        title="Deactivate Account"
        message="Are you sure you want to temporarily deactivate your account? Your data will be saved, but your account will be disabled."
        confirmText="Deactivate Account"
        isDanger={true}
      />
    </div>
  );
};
