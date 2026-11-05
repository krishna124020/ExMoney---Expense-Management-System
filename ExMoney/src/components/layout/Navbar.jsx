import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, Settings, UserCircle, Search, X, ChevronRight, PieChart, CreditCard, Crosshair, RefreshCw, FileText, Filter as FilterIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { useTransactions } from '../../context/TransactionsContext';
import { useCategories } from '../../context/CategoriesContext';
import { useBudgets } from '../../context/BudgetsContext';
import { useGoals } from '../../context/GoalsContext';
import { useScheduledTransactions } from '../../context/ScheduledTransactionsContext';
import { useFilters } from '../../context/FilterContext';
import { GlobalFilterModal } from './GlobalFilterModal';

export const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Contexts for search
  const { unreadCount, notifications } = useNotifications();
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const { budgets } = useBudgets();
  const { goals } = useGoals();
  const { scheduledTransactions } = useScheduledTransactions();
  const { activeFilterCount, filterTransactions, filters } = useFilters();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Compute search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results = [];
    
    // Apply global filters to transactions before search
    const filteredTx = filterTransactions(transactions || []);
    const filteredScheduled = filterTransactions(scheduledTransactions || []);
    
    // Transactions
    filteredTx.forEach(t => {
      if (t.description?.toLowerCase().includes(query) || t.category?.toLowerCase().includes(query)) {
        results.push({ type: 'Transaction', id: t.id, title: t.description, subtitle: `₹${Math.abs(t.amount)} • ${t.category}`, icon: CreditCard, path: '/dashboard/transactions' });
      }
    });

    // Categories
    categories?.forEach(c => {
      if (filters.type !== 'All' && c.type !== filters.type.toLowerCase()) return;
      if (c.name?.toLowerCase().includes(query)) {
        results.push({ type: 'Category', id: c.id, title: c.name, subtitle: c.type === 'expense' ? 'Expense Category' : 'Income Category', icon: PieChart, path: '/dashboard/categories' });
      }
    });

    // Budgets
    budgets?.forEach(b => {
      if (filters.categories.length > 0 && !filters.categories.includes(b.category)) return;
      if (b.category?.toLowerCase().includes(query)) {
        results.push({ type: 'Budget', id: b.id, title: `${b.category} Budget`, subtitle: `₹${b.amount} ${b.period}`, icon: PieChart, path: '/dashboard/budgets' });
      }
    });

    // Goals (Filter doesn't heavily apply, maybe check text)
    goals?.forEach(g => {
      if (g.name?.toLowerCase().includes(query)) {
        results.push({ type: 'Goal', id: g.id, title: g.name, subtitle: `Target: ₹${g.targetAmount}`, icon: Crosshair, path: '/dashboard/goals' });
      }
    });

    // Scheduled
    filteredScheduled.forEach(st => {
      if (st.description?.toLowerCase().includes(query)) {
        results.push({ type: 'Scheduled', id: st.id, title: st.description, subtitle: `₹${Math.abs(st.amount)} • ${st.frequency}`, icon: RefreshCw, path: '/dashboard/transactions' });
      }
    });
    
    // Notifications
    notifications?.forEach(n => {
      if (n.title?.toLowerCase().includes(query) || n.message?.toLowerCase().includes(query)) {
         results.push({ type: 'Notification', id: n.id, title: n.title, subtitle: n.message, icon: Bell, path: '/dashboard/notifications' });
      }
    });
    
    // Reports (hardcoded suggestions)
    const reportTypes = ['Income vs Expense', 'Category Spending', 'Cash Flow', 'Budget Variance'];
    reportTypes.forEach(rt => {
      if (rt.toLowerCase().includes(query) || 'report'.includes(query)) {
        results.push({ type: 'Report', id: `report-${rt}`, title: `${rt} Report`, subtitle: 'View detailed analytics', icon: FileText, path: '/dashboard/reports' });
      }
    });

    return results.slice(0, 8); // Limit to 8 results max for UI cleanliness
  }, [searchQuery, transactions, categories, budgets, goals, scheduledTransactions, notifications, filters]);

  const handleResultClick = (path) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <header className="navbar">
      <div className="flex items-center gap-4 flex-1">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        
        {/* Global Search */}
        <div className="global-search-container" ref={searchContainerRef} style={{ position: 'relative', maxWidth: '400px', width: '100%', marginLeft: 'var(--space-4)' }}>
          <div className="global-search-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              className="global-search-input" 
              placeholder="Search transactions, budgets, goals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              style={{
                width: '100%',
                padding: '8px 36px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                outline: 'none',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s ease'
              }}
              onFocusCapture={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlurCapture={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setIsFilterModalOpen(true)}
            style={{
              position: 'absolute',
              right: '-44px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${activeFilterCount > 0 ? 'var(--color-primary)' : 'var(--color-border)'}`,
              backgroundColor: activeFilterCount > 0 ? 'var(--color-primary-light)' : 'var(--color-surface)',
              color: activeFilterCount > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Global Filters"
          >
            <FilterIcon size={18} />
            {activeFilterCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '0.65rem', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {isSearchFocused && searchQuery && (
            <div className="global-search-results" style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 100
            }}>
              {searchResults.length > 0 ? (
                <div style={{ padding: 'var(--space-2)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', padding: 'var(--space-2)', textTransform: 'uppercase' }}>
                    Results
                  </div>
                  {searchResults.map((result, idx) => {
                    const Icon = result.icon;
                    return (
                      <button 
                        key={`${result.type}-${result.id}-${idx}`}
                        className="search-result-item"
                        onClick={() => handleResultClick(result.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-3)',
                          width: '100%',
                          padding: 'var(--space-2) var(--space-3)',
                          border: 'none',
                          background: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          borderRadius: 'var(--radius-sm)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ padding: '8px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
                          <Icon size={16} />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: 'var(--color-text)' }}>{result.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', gap: '8px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{result.type}</span>
                            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>• {result.subtitle}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} color="var(--color-text-muted)" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <Search size={32} style={{ margin: '0 auto var(--space-2)', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>No results found for "{searchQuery}"</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem' }}>Try searching for a transaction, category, or budget</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" style={{ padding: 'var(--space-2)', position: 'relative' }} onClick={() => navigate('/dashboard/notifications')}>
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '6px',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--color-danger)',
              borderRadius: '50%',
              border: '2px solid var(--color-surface)'
            }} />
          )}
        </Button>
        
        <div className="profile-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
          <div 
            className="flex items-center gap-2" 
            style={{ cursor: 'pointer', padding: 'var(--space-1)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', userSelect: 'none' }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <User size={16} />
            </div>
          </div>

          {isDropdownOpen && (
            <div className="profile-dropdown-menu" style={{ 
              position: 'absolute', right: 0, top: 'calc(100% + var(--space-2))', 
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
              minWidth: '200px', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 50
            }}>
              <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>User Account</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>user@example.com</div>
              </div>
              <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); navigate('/dashboard/profile'); }}>
                <UserCircle size={16} /> View Profile
              </button>
              <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); navigate('/dashboard/settings'); }}>
                <Settings size={16} /> Settings
              </button>
              <div style={{ borderTop: '1px solid var(--color-border)' }}></div>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
      <GlobalFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </header>
  );
};
