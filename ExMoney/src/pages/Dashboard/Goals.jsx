import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, IndianRupee, Target, Shield, Plane, Laptop, Car, Home, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Select } from '../../components/ui/Select';
import { useGoals } from '../../context/GoalsContext';
import { AddEditGoalModal } from './components/AddEditGoalModal';
import { AddMoneyModal } from './components/AddMoneyModal';
import { FutureSavingsModal } from './components/FutureSavingsModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { format, isPast, isToday, parseISO } from 'date-fns';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const IconMap = {
  Target: Target,
  Shield: Shield,
  Plane: Plane,
  Laptop: Laptop,
  Car: Car,
  Home: Home,
  IndianRupee: IndianRupee
};

export const Goals = () => {
  const { 
    goals, isLoading, error, fetchGoals,
    deleteGoal, adjustGoalSavedAmount, addMoneyToGoal,
    futureSavings, addFutureSavings, adjustFutureSavings
  } = useGoals();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [activeGoalForMoney, setActiveGoalForMoney] = useState(null);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  const [isFutureSavingsModalOpen, setIsFutureSavingsModalOpen] = useState(false);

  // Calculated Goals with Status
  const enrichedGoals = useMemo(() => {
    return goals.map(goal => {
      const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
      const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
      
      let status = 'Not Started';
      let statusColor = 'var(--color-text-muted)';
      let statusBg = 'var(--color-bg)';
      let progressColor = 'var(--color-primary)';

      const targetDate = parseISO(goal.targetDate);
      const isOverdue = isPast(targetDate) && !isToday(targetDate);

      if (goal.savedAmount >= goal.targetAmount) {
        status = 'Completed';
        statusColor = '#166534'; // darker green text
        statusBg = '#dcfce7'; // light green bg
        progressColor = 'var(--color-secondary)';
      } else if (isOverdue) {
        status = 'Overdue';
        statusColor = '#991b1b'; // dark red
        statusBg = '#fee2e2'; // light red
        progressColor = 'var(--color-danger)';
      } else if (goal.savedAmount > 0) {
        status = 'In Progress';
        statusColor = '#075985'; // dark blue
        statusBg = '#e0f2fe'; // light blue
      }

      return {
        ...goal,
        remaining,
        progress,
        status,
        statusColor,
        statusBg,
        progressColor
      };
    });
  }, [goals]);

  // Filtered Goals
  const filteredGoals = useMemo(() => {
    return enrichedGoals.filter(goal => {
      const matchesSearch = goal.name.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (filter === 'all') return true;
      if (filter === 'not-started') return goal.status === 'Not Started';
      if (filter === 'in-progress') return goal.status === 'In Progress';
      if (filter === 'completed') return goal.status === 'Completed';
      if (filter === 'overdue') return goal.status === 'Overdue';
      return true;
    }).sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
  }, [enrichedGoals, filter, search]);

  // Summary Metrics
  const summary = useMemo(() => {
    const totalTarget = enrichedGoals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = enrichedGoals.reduce((sum, g) => sum + g.savedAmount, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return {
      totalGoals: enrichedGoals.length,
      totalTarget,
      totalSaved,
      overallProgress: Math.min(overallProgress, 100) // cap visual progress
    };
  }, [enrichedGoals]);

  // Handlers
  const handleSaveGoal = (goalData) => {
    if (editingGoal) {
      editGoal({ ...goalData, id: editingGoal.id });
    } else {
      addGoal(goalData);
    }
    setIsAddEditModalOpen(false);
    setEditingGoal(null);
  };

  const handleAddMoney = (action) => {
    if (action.type === 'add') {
      addMoneyToGoal(activeGoalForMoney.id, action.amount);
    } else {
      adjustGoalSavedAmount(activeGoalForMoney.id, action.amount);
    }
    setIsAddMoneyModalOpen(false);
    setActiveGoalForMoney(null);
  };

  const confirmDelete = () => {
    deleteGoal(goalToDelete.id);
    setIsConfirmDeleteOpen(false);
    setGoalToDelete(null);
  };

  const handleFutureSavings = (action) => {
    if (action.type === 'add') {
      addFutureSavings(action.amount, action.date, action.note);
    } else {
      adjustFutureSavings(action.amount, action.date, action.note);
    }
    setIsFutureSavingsModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-2) 0' }}>Goals</h1>
          <p className="text-muted" style={{ margin: 0 }}>Set savings targets and track your progress.</p>
        </div>
        <Button onClick={() => { setEditingGoal(null); setIsAddEditModalOpen(true); }}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Create Goal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="kpi-grid">
        <div className="stat-card">
          <h3 className="stat-card-title">Total Goals</h3>
          <div className="stat-card-value">{summary.totalGoals}</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-card-title">Total Target</h3>
          <div className="stat-card-value">{formatCurrency(summary.totalTarget)}</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-card-title">Total Saved</h3>
          <div className="stat-card-value" style={{ color: 'var(--color-primary)' }}>{formatCurrency(summary.totalSaved)}</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-card-title">Overall Progress</h3>
          <div className="stat-card-value">{summary.overallProgress.toFixed(1)}%</div>
          <div style={{ marginTop: '8px' }}>
            <ProgressBar percentage={summary.overallProgress} color="var(--color-primary)" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search goals..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', flex: '1', minWidth: '200px' }}
        />
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ minWidth: '150px' }}>
          <option value="all">All Statuses</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </Select>
      </div>

      {/* Future Savings Section */}
      <h2 className="h3" style={{ marginBottom: 'var(--space-4)', marginTop: 'var(--space-8)' }}>Future Savings</h2>
      <div className="dashboard-card" style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div className="text-muted" style={{ marginBottom: 'var(--space-2)' }}>Amount Saved</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
              {formatCurrency(futureSavings.total)}
            </div>
            <div className="text-muted" style={{ fontSize: '0.875rem' }}>Set aside for future needs, without a specific target.</div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Button variant="outline" onClick={() => setIsFutureSavingsModalOpen(true)}>Adjust</Button>
            <Button onClick={() => setIsFutureSavingsModalOpen(true)}>
              <Plus size={18} style={{ marginRight: '8px' }} /> Add Money
            </Button>
          </div>
        </div>

        {futureSavings.history && futureSavings.history.length > 0 && (
          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Recent History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {futureSavings.history.slice(0, 5).map(entry => (
                <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2)', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{entry.type} {entry.note && <span className="text-muted font-normal"> - {entry.note}</span>}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{format(parseISO(entry.date), 'MMM dd, yyyy')}</div>
                  </div>
                  <div style={{ fontWeight: 600, color: entry.type === 'Added' ? 'var(--color-primary)' : 'var(--color-text)' }}>
                    {entry.type === 'Added' ? '+' : ''}{formatCurrency(entry.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <h2 className="h3" style={{ marginBottom: 'var(--space-4)' }}>Savings Goals</h2>

      {/* Goals Grid */}
      {error ? (
        <ErrorState title="Failed to Load Goals" message={error} onRetry={fetchGoals} />
      ) : isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          <Skeleton height="250px" />
          <Skeleton height="250px" />
          <Skeleton height="250px" />
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="state-container" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-12) var(--space-4)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            {goals.length === 0 ? <Target size={32} /> : <Search size={32} />}
          </div>
          <h3 className="h3" style={{ marginBottom: 'var(--space-2)' }}>
            {goals.length === 0 ? 'No savings goals yet' : 'No matching goals'}
          </h3>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0 0 var(--space-6) 0' }}>
            {goals.length === 0 
              ? "Create a goal to start tracking progress towards something you're saving for."
              : 'Try changing your filters or search query to see results.'}
          </p>
          {goals.length === 0 ? (
            <Button variant="primary" onClick={() => { setEditingGoal(null); setIsAddEditModalOpen(true); }}>
              <Plus size={18} style={{ marginRight: '8px' }} /> Create Goal
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => { setSearch(''); setFilter('all'); }}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          {filteredGoals.map(goal => {
            const IconComponent = IconMap[goal.icon] || Target;
            
            return (
              <div key={goal.id} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComponent size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <h3 className="h3" style={{ margin: 0, fontSize: '1.125rem' }}>{goal.name}</h3>
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '2px 8px', 
                        borderRadius: 'var(--radius-full)', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        backgroundColor: goal.statusBg,
                        color: goal.statusColor,
                        marginTop: '4px'
                      }}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => { setEditingGoal(goal); setIsAddEditModalOpen(true); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => { setGoalToDelete(goal); setIsConfirmDeleteOpen(true); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-end' }}>
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.875rem' }}>Saved</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(goal.savedAmount)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="text-muted" style={{ fontSize: '0.875rem' }}>Target</div>
                      <div style={{ fontWeight: 500 }}>{formatCurrency(goal.targetAmount)}</div>
                    </div>
                  </div>
                  
                  <ProgressBar percentage={goal.progress} color={goal.progressColor} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.875rem' }}>
                    <span className="text-muted">{goal.progress.toFixed(1)}%</span>
                    <span className="text-muted">Remaining: {formatCurrency(goal.remaining)}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                    Target: {format(parseISO(goal.targetDate), 'MMM dd, yyyy')}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { setActiveGoalForMoney(goal); setIsAddMoneyModalOpen(true); }}
                  >
                    Add Money
                  </Button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddEditGoalModal 
        isOpen={isAddEditModalOpen} 
        onClose={() => { setIsAddEditModalOpen(false); setEditingGoal(null); }} 
        onSave={handleSaveGoal}
        initialData={editingGoal}
      />

      <AddMoneyModal
        isOpen={isAddMoneyModalOpen}
        onClose={() => { setIsAddMoneyModalOpen(false); setActiveGoalForMoney(null); }}
        onSave={handleAddMoney}
        goal={activeGoalForMoney}
      />

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        title="Delete Goal"
        message={`Are you sure you want to delete the "${goalToDelete?.name}" goal? This will remove the goal but will not delete any transactions.`}
        onConfirm={confirmDelete}
        onCancel={() => { setIsConfirmDeleteOpen(false); setGoalToDelete(null); }}
      />

      <FutureSavingsModal
        isOpen={isFutureSavingsModalOpen}
        onClose={() => setIsFutureSavingsModalOpen(false)}
        onSave={handleFutureSavings}
        futureSavings={futureSavings}
      />
    </div>
  );
};
