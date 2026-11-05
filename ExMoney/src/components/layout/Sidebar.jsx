import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft,
  Calendar, 
  PieChart, 
  Tags, 
  BarChart3, 
  FileText, 
  Target, 
  Bell, 
  User, 
  Settings,
  Wallet,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ]
  },
  {
    title: 'Money',
    items: [
      { to: '/dashboard/transactions', label: 'Transactions', icon: ArrowRightLeft },
      { to: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
      { to: '/dashboard/budgets', label: 'Budgets', icon: PieChart },
      { to: '/dashboard/categories', label: 'Categories', icon: Tags },
    ]
  },
  {
    title: 'Insights',
    items: [
      { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/dashboard/reports', label: 'Reports', icon: FileText },
    ]
  },
  {
    title: 'Planning',
    items: [
      { to: '/dashboard/goals', label: 'Financial Goals', icon: Target },
    ]
  },
  {
    title: 'System',
    items: [
      { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
      { to: '/dashboard/settings', label: 'Settings', icon: Settings },
      { to: '/dashboard/profile', label: 'Profile', icon: User },
    ]
  }
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 35, display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} 
          onClick={onClose}
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Wallet size={24} color="var(--color-primary)" />
          <span style={{ fontWeight: '600', fontSize: '1.25rem', color: 'var(--color-text)' }}>ExMoney</span>
        </div>
        
        <nav className="sidebar-nav" style={{ paddingBottom: 'var(--space-6)' }}>
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="sidebar-section">
              <div className="sidebar-section-title">{section.title}</div>
              {section.items.map(({ to, label, icon: Icon, exact }) => (
                <NavLink 
                  key={to} 
                  to={to}
                  end={exact}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (window.innerWidth <= 768) onClose();
                  }}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
          
          <div className="sidebar-section">
            <button 
              className="nav-item" 
              onClick={handleLogout}
              style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};
