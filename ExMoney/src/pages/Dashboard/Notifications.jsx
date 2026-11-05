import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, IndianRupee, Target, CalendarDays, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNotifications } from '../../context/NotificationsContext';
import { format, parseISO, isToday, isYesterday } from 'date-fns';

const formatNotificationDate = (dateString) => {
  const date = parseISO(dateString);
  if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`;
  if (isYesterday(date)) return `Yesterday, ${format(date, 'h:mm a')}`;
  return format(date, 'MMM d, h:mm a');
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Transactions': return IndianRupee;
    case 'Budgets': return Target;
    case 'Goals': return Target;
    case 'Future Savings': return IndianRupee;
    case 'Calendar': return CalendarDays;
    case 'System': return Info;
    default: return Bell;
  }
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'Transactions': return 'var(--color-primary)';
    case 'Budgets': return 'var(--color-danger)';
    case 'Goals': return 'var(--color-secondary)';
    case 'Future Savings': return 'var(--color-primary)';
    case 'Calendar': return 'var(--color-warning)';
    case 'System': return 'var(--color-text-muted)';
    default: return 'var(--color-primary)';
  }
};

export const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearRead } = useNotifications();
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const filters = ['All', 'Unread', 'Transactions', 'Budgets', 'Goals', 'Calendar'];

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.read;
    if (filter === 'Goals') return n.category === 'Goals' || n.category === 'Future Savings';
    return n.category === filter;
  });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <h1 className="h2" style={{ margin: '0 0 var(--space-2) 0' }}>Notifications</h1>
            {unreadCount > 0 && (
              <span style={{ 
                backgroundColor: 'var(--color-danger)', color: 'white', padding: '2px 8px', 
                borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600,
                transform: 'translateY(-4px)'
              }}>
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-muted" style={{ margin: 0 }}>Stay updated with your financial activity and upcoming plans.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Button variant="outline" size="sm" onClick={clearRead} disabled={!notifications.some(n => n.read)}>
            Clear Read
          </Button>
          <Button variant="primary" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle2 size={16} style={{ marginRight: '8px' }} /> Mark all as read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', overflowX: 'auto', paddingBottom: '4px' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              border: filter === f ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: filter === f ? 'var(--color-primary-light)' : 'transparent',
              color: filter === f ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: filter === f ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="state-container" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-12) var(--space-4)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <Bell size={32} />
          </div>
          <h3 className="h3" style={{ marginBottom: 'var(--space-2)' }}>You're all caught up</h3>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0 0 var(--space-6) 0' }}>You don't have any {filter !== 'All' ? filter.toLowerCase() : ''} notifications right now.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filteredNotifications.map(notification => {
            const IconComponent = getCategoryIcon(notification.category);
            const iconColor = getCategoryColor(notification.category);

            return (
              <div 
                key={notification.id} 
                className="dashboard-card" 
                style={{ 
                  display: 'flex', 
                  gap: 'var(--space-4)', 
                  padding: 'var(--space-4)',
                  position: 'relative',
                  borderLeft: notification.read ? 'none' : `4px solid var(--color-primary)`,
                  opacity: notification.read ? 0.7 : 1
                }}
              >
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  backgroundColor: 'var(--color-bg)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  <IconComponent size={20} color={iconColor} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontWeight: notification.read ? 500 : 600, fontSize: '1rem' }}>
                      {notification.title}
                    </h4>
                    <span className="text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', marginLeft: 'var(--space-4)' }}>
                      {formatNotificationDate(notification.date)}
                    </span>
                  </div>
                  <p className="text-muted" style={{ margin: '0 0 var(--space-3) 0', fontSize: '0.875rem' }}>
                    {notification.message}
                  </p>
                  
                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    {notification.actionLink && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          if (!notification.read) markAsRead(notification.id);
                          navigate(notification.actionLink);
                        }}
                      >
                        View {notification.category}
                      </Button>
                    )}
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 500 }}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
