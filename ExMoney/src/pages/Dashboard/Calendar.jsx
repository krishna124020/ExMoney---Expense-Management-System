import React, { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths,
  addDays,
  subDays,
  isSameDay, 
  isToday, 
  isYesterday,
  isTomorrow,
  parseISO 
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useScheduledTransactions } from '../../context/ScheduledTransactionsContext';
import { getCalendarDays, getOccurrencesForMonth } from '../../utils/calendarUtils';
import { TransactionModal } from './components/TransactionModal';
import { TransactionDetailsModal } from './components/TransactionDetailsModal';
import './Calendar.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.abs(amount));
};

export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Upcoming filters: 'all', 'income', 'expense', 'recurring'
  const [upcomingFilter, setUpcomingFilter] = useState('all');

  const { 
    scheduledTransactions, 
    isLoading,
    error,
    fetchScheduledTransactions,
    addTransaction, 
    editTransaction, 
    deleteTransaction 
  } = useScheduledTransactions();

  // Calculate occurrences and grid data
  const calendarDays = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
  
  const currentMonthOccurrences = useMemo(() => 
    getOccurrencesForMonth(scheduledTransactions, currentMonth), 
  [scheduledTransactions, currentMonth]);

  // Handlers for date navigation
  const prevDay = () => setCurrentMonth(subDays(currentMonth, 1));
  const nextDay = () => setCurrentMonth(addDays(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // Handlers for Modals
  const handleSaveTransaction = (tx) => {
    if (tx.id) {
      editTransaction(tx);
    } else {
      addTransaction(tx);
    }
    setIsAddModalOpen(false);
    setSelectedTransaction(null); // Clear edit state just in case
  };

  const handleEventClick = (occurrence) => {
    // Find the original transaction object to pass to details modal
    const original = scheduledTransactions.find(t => t.id === occurrence.id);
    if (original) {
      setSelectedTransaction(original);
      setIsDetailsOpen(true);
    }
  };

  const handleEditFromDetails = () => {
    setIsDetailsOpen(false);
    setIsAddModalOpen(true);
  };

  // Helper to group occurrences by day string (yyyy-mm-dd)
  const eventsByDay = useMemo(() => {
    const map = {};
    currentMonthOccurrences.forEach(occ => {
      const dayStr = occ.date.split('T')[0];
      if (!map[dayStr]) map[dayStr] = [];
      map[dayStr].push(occ);
    });
    return map;
  }, [currentMonthOccurrences]);

  // Calculate monthly summary
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    currentMonthOccurrences.forEach(occ => {
      if (occ.type === 'income') income += occ.amount;
      if (occ.type === 'expense') expense += occ.amount;
    });
    return { income, expense, net: income - expense };
  }, [currentMonthOccurrences]);

  // Upcoming transactions (next 10 from today)
  const upcomingList = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // For upcoming list, we want to look forward a bit, maybe get occurrences for next few months if current month has none,
    // but for simplicity, let's grab from this month and next month
    const nextMonthOccurrences = getOccurrencesForMonth(scheduledTransactions, addMonths(currentMonth, 1));
    const combined = [...currentMonthOccurrences, ...nextMonthOccurrences];
    
    // Deduplicate by occurrenceId
    const uniqueMap = new Map();
    combined.forEach(occ => uniqueMap.set(occ.occurrenceId, occ));
    const uniqueCombined = Array.from(uniqueMap.values());
    
    let list = uniqueCombined.filter(occ => parseISO(occ.date) >= today);
    
    if (upcomingFilter === 'income') list = list.filter(o => o.type === 'income');
    else if (upcomingFilter === 'expense') list = list.filter(o => o.type === 'expense');
    else if (upcomingFilter === 'recurring') list = list.filter(o => o.frequency && o.frequency !== 'none');
    
    return list.slice(0, 10);
  }, [scheduledTransactions, currentMonth, currentMonthOccurrences, upcomingFilter]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-page-container">
      {/* Header */}
      <div className="calendar-header">
        <div>
          <h1 className="h3" style={{ margin: 0, marginBottom: 'var(--space-1)' }}>Financial Calendar</h1>
          <p className="text-muted text-sm">Plan and keep track of your upcoming income and expenses.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div className="calendar-controls">
            <Button variant="ghost" size="sm" onClick={prevDay}><ChevronLeft size={18} /></Button>
            
            <div className="month-display" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <select 
                value={currentMonth.getDate()} 
                onChange={(e) => {
                  const newDate = new Date(currentMonth);
                  newDate.setDate(parseInt(e.target.value, 10));
                  setCurrentMonth(newDate);
                }}
                style={{
                  border: 'none', background: 'transparent', fontFamily: 'inherit',
                  fontSize: '1rem', fontWeight: '600', color: 'var(--color-text)', cursor: 'pointer', outline: 'none',
                  appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none'
                }}
              >
                {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select 
                value={currentMonth.getMonth()} 
                onChange={(e) => {
                  const newDate = new Date(currentMonth);
                  newDate.setMonth(parseInt(e.target.value, 10));
                  setCurrentMonth(newDate);
                }}
                style={{
                  border: 'none', background: 'transparent', fontFamily: 'inherit',
                  fontSize: '1rem', fontWeight: '600', color: 'var(--color-text)', cursor: 'pointer', outline: 'none',
                  appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none'
                }}
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const d = new Date(2000, i, 1);
                  return <option key={i} value={i}>{format(d, 'MMMM')}</option>;
                })}
              </select>
              <select 
                value={currentMonth.getFullYear()} 
                onChange={(e) => {
                  const newDate = new Date(currentMonth);
                  newDate.setFullYear(parseInt(e.target.value, 10));
                  setCurrentMonth(newDate);
                }}
                style={{
                  border: 'none', background: 'transparent', fontFamily: 'inherit',
                  fontSize: '1rem', fontWeight: '600', color: 'var(--color-text)', cursor: 'pointer', outline: 'none',
                  appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none'
                }}
              >
                {Array.from({ length: new Date().getFullYear() + 10 - 1990 + 1 }).map((_, i) => {
                  const year = 1990 + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>

            <Button variant="ghost" size="sm" onClick={nextDay}><ChevronRight size={18} /></Button>
            {isToday(currentMonth) && <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginLeft: 'var(--space-2)' }}>Today</span>}
            {isYesterday(currentMonth) && <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginLeft: 'var(--space-2)' }}>Yesterday</span>}
            {isTomorrow(currentMonth) && <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginLeft: 'var(--space-2)' }}>Tomorrow</span>}
          </div>
          
          <Button variant="primary" onClick={() => { setSelectedTransaction(null); setIsAddModalOpen(true); }}>
            <Plus size={18} /> Add Scheduled Transaction
          </Button>
        </div>
      </div>

      {error ? (
        <ErrorState title="Failed to Load Calendar" message={error} onRetry={fetchScheduledTransactions} />
      ) : isLoading ? (
        <div className="calendar-main-grid">
          <div className="calendar-grid-container">
            <Skeleton height="600px" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <Skeleton height="200px" />
            <Skeleton height="400px" />
          </div>
        </div>
      ) : scheduledTransactions.length === 0 ? (
        <div className="state-container" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-12) var(--space-4)', marginTop: 'var(--space-6)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <CalendarIcon size={32} />
          </div>
          <h3 className="h3" style={{ marginBottom: 'var(--space-2)' }}>No scheduled transactions</h3>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0 0 var(--space-6) 0' }}>Plan ahead by scheduling your recurring bills, expected income, or future transfers.</p>
          <Button variant="primary" onClick={() => { setSelectedTransaction(null); setIsAddModalOpen(true); }}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Schedule Transaction
          </Button>
        </div>
      ) : (
        <div className="calendar-main-grid">
          
          {/* Left Column: Calendar Grid */}
          <div className="calendar-grid-container">
            <div className="calendar-days-header">
              {daysOfWeek.map(day => (
                <div key={day} className="calendar-day-name">{day}</div>
              ))}
            </div>
            <div className="calendar-grid">
              {calendarDays.map((dayObj, index) => {
                const dayStr = dayObj.date.toISOString().split('T')[0];
                const events = eventsByDay[dayStr] || [];
                const isTodayClass = isToday(dayObj.date) ? 'is-today' : '';
                const currentMonthClass = !dayObj.isCurrentMonth ? 'not-current-month' : '';
                
                const displayEvents = events.slice(0, 3);
                const extraEvents = events.length - 3;

                return (
                  <div key={index} className={`calendar-cell ${isTodayClass} ${currentMonthClass}`}>
                    <div className="cell-date">{format(dayObj.date, 'd')}</div>
                    
                    {displayEvents.map(evt => (
                      <div 
                        key={evt.occurrenceId} 
                        className={`calendar-event ${evt.type}`}
                        onClick={() => handleEventClick(evt)}
                        title={`${evt.name} - ${formatCurrency(evt.amount)}`}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{evt.name}</span>
                        <span>{evt.type === 'income' ? '+' : '-'}{formatCurrency(evt.amount)}</span>
                      </div>
                    ))}
                    
                    {extraEvents > 0 && (
                      <div className="more-events">+{extraEvents} more</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Monthly Summary */}
            <div className="dashboard-card">
              <h3 className="card-title">Summary ({format(currentMonth, 'MMM yyyy')})</h3>
              <div className="monthly-summary">
                <div className="summary-row">
                  <span className="text-muted text-sm">Expected Income</span>
                  <span className="font-semibold text-primary">+{formatCurrency(summary.income)}</span>
                </div>
                <div className="summary-row">
                  <span className="text-muted text-sm">Expected Expenses</span>
                  <span className="font-semibold" style={{ color: 'var(--color-danger)' }}>-{formatCurrency(summary.expense)}</span>
                </div>
                <div className="summary-row" style={{ marginTop: 'var(--space-2)' }}>
                  <span className="font-semibold">Expected Net</span>
                  <span className={`font-bold ${summary.net >= 0 ? 'text-primary' : 'text-danger'}`}>
                    {summary.net >= 0 ? '+' : ''}{formatCurrency(summary.net)}
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming List */}
            <div className="dashboard-card">
              <h3 className="card-title">Upcoming</h3>
              <div className="upcoming-filters">
                {['all', 'income', 'expense', 'recurring'].map(filter => (
                  <button 
                    key={filter}
                    className={`filter-btn ${upcomingFilter === filter ? 'active' : ''}`}
                    onClick={() => setUpcomingFilter(filter)}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              
              <div className="upcoming-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {upcomingList.length > 0 ? upcomingList.map(event => (
                  <div 
                    key={event.occurrenceId} 
                    style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                    className="hover-bg"
                    onClick={() => handleEventClick(event)}
                  >
                    <div style={{ 
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      minWidth: '45px', padding: 'var(--space-1)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>{format(parseISO(event.date), 'MMM')}</span>
                      <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>{format(parseISO(event.date), 'dd')}</span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{event.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', gap: '4px', textTransform: 'capitalize' }}>
                        {event.category} • {event.frequency !== 'none' ? event.frequency : 'One-time'}
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '0.875rem',
                      color: event.type === 'income' ? 'var(--color-primary)' : 'var(--color-danger)'
                    }}>
                      {event.type === 'income' ? '+' : '-'}{formatCurrency(event.amount)}
                    </div>
                  </div>
                )) : (
                  <div className="text-muted text-sm" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                    No upcoming transactions match your filter.
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}

      <TransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setSelectedTransaction(null); }}
        onSave={handleSaveTransaction}
        editingTransaction={selectedTransaction}
      />

      <TransactionDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        transaction={selectedTransaction}
        onEdit={handleEditFromDetails}
        onDelete={deleteTransaction}
      />
    </div>
  );
};
