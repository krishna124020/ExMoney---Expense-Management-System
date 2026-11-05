import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Tag, Search } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { useCategories } from '../../context/CategoriesContext';
import { useTransactions } from '../../context/TransactionsContext';
import { useBudgets } from '../../context/BudgetsContext';
import { AddEditCategoryModal } from './components/AddEditCategoryModal';
import { MigrateCategoryModal } from './components/MigrateCategoryModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.abs(amount));
};

export const Categories = () => {
  const { categories, addCategory, editCategory, deleteCategory, isLoading: catsLoading, error: catsError, fetchCategories } = useCategories();
  const { transactions, updateCategoryName: updateTransactionCategory, isLoading: txsLoading, error: txsError, fetchTransactions } = useTransactions();
  const { budgets, updateCategoryName: updateBudgetCategory, isLoading: budgetsLoading, error: budgetsError, fetchBudgets } = useBudgets();
  
  const isLoading = catsLoading || txsLoading || budgetsLoading;
  const loadingError = catsError || txsError || budgetsError;

  const retryLoading = () => {
    if (catsError) fetchCategories();
    if (txsError) fetchTransactions();
    if (budgetsError) fetchBudgets();
  };
  
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const enrichedCategories = useMemo(() => {
    return categories.map(cat => {
      const categoryTransactions = transactions.filter(tx => tx.category === cat.name && tx.type === cat.type);
      const totalAmount = categoryTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
      
      return {
        ...cat,
        transactionCount: categoryTransactions.length,
        totalAmount
      };
    });
  }, [categories, transactions]);

  const filteredCategories = useMemo(() => {
    return enrichedCategories.filter(cat => {
      const matchesType = filterType === 'all' || cat.type === filterType;
      const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [enrichedCategories, filterType, searchQuery]);

  const expenseCategories = filteredCategories.filter(c => c.type === 'expense');
  const incomeCategories = filteredCategories.filter(c => c.type === 'income');

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      if (editingCategory.name !== categoryData.name) {
        // Cascade rename to transactions and budgets
        updateTransactionCategory(editingCategory.name, categoryData.name);
        updateBudgetCategory(editingCategory.name, categoryData.name);
      }
      editCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const attemptDelete = (category) => {
    // Check if category is used
    const isUsedInTransactions = transactions.some(tx => tx.category === category.name && tx.type === category.type);
    const isUsedInBudgets = budgets.some(b => b.category === category.name);

    if (isUsedInTransactions || isUsedInBudgets) {
      setCategoryToDelete(category);
      setIsMigrateModalOpen(true);
    } else {
      setCategoryToDelete(category);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleMigrateAndDelete = (fallbackCategoryName) => {
    if (categoryToDelete && fallbackCategoryName) {
      updateTransactionCategory(categoryToDelete.name, fallbackCategoryName);
      updateBudgetCategory(categoryToDelete.name, fallbackCategoryName);
      deleteCategory(categoryToDelete.id);
    }
    setIsMigrateModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleSimpleDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
    }
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const renderCategoryCard = (cat) => {
    const IconComponent = Icons[cat.icon] || Icons.HelpCircle;
    return (
      <div key={cat.id} className="dashboard-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ 
            backgroundColor: cat.type === 'income' ? 'var(--color-primary-light)' : '#fef2f2',
            color: cat.type === 'income' ? 'var(--color-primary)' : '#ef4444',
            padding: '12px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconComponent size={24} />
          </div>
          <div>
            <h3 className="h3" style={{ margin: '0 0 4px 0' }}>{cat.name}</h3>
            <div className="text-muted text-sm">
              <span style={{ textTransform: 'capitalize' }}>{cat.type}</span> • {cat.transactionCount} transactions
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <div className="h3" style={{ margin: 0 }}>
            {cat.totalAmount > 0 ? formatCurrency(cat.totalAmount) : '—'}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="ghost" size="sm" onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }} style={{ padding: '4px' }}>
              <Edit2 size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => attemptDelete(cat)} style={{ padding: '4px', color: 'var(--color-danger)' }}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 'var(--space-2)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-2) 0' }}>Categories</h1>
          <p className="text-muted" style={{ margin: 0 }}>Organize your income and expenses with categories.</p>
        </div>
        <Button variant="primary" onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Add Category
        </Button>
      </div>

      {/* Filters */}
      <div className="dashboard-card" style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Input 
            placeholder="Search categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="all">All Types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </Select>
      </div>

      {loadingError ? (
        <ErrorState title="Failed to Load Categories" message={loadingError} onRetry={retryLoading} />
      ) : isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
            <Skeleton height="100px" />
            <Skeleton height="100px" />
            <Skeleton height="100px" />
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="state-container" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-12) var(--space-4)', marginTop: 'var(--space-4)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            {categories.length === 0 ? <Tag size={32} /> : <Search size={32} />}
          </div>
          <h3 className="h3" style={{ marginBottom: 'var(--space-2)' }}>
            {categories.length === 0 ? 'No categories yet' : 'No matching categories'}
          </h3>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0 0 var(--space-6) 0' }}>
            {categories.length === 0 
              ? 'Create a custom category to organize your income and expenses exactly how you want.'
              : 'Try changing your filters or search query to see results.'
            }
          </p>
          {categories.length === 0 ? (
            <Button variant="primary" onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}>
              <Plus size={18} /> Add Category
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => { setSearchQuery(''); setFilterType('all'); }}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
          {/* Expense Section */}
          {expenseCategories.length > 0 && (
            <div>
              <h3 className="h3" style={{ marginBottom: 'var(--space-4)' }}>Expense Categories</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
                {expenseCategories.map(renderCategoryCard)}
              </div>
            </div>
          )}

          {/* Income Section */}
          {incomeCategories.length > 0 && (
            <div>
              <h3 className="h3" style={{ marginBottom: 'var(--space-4)' }}>Income Categories</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
                {incomeCategories.map(renderCategoryCard)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddEditCategoryModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCategory(null); }}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        existingCategories={categories}
      />

      <MigrateCategoryModal 
        isOpen={isMigrateModalOpen}
        onClose={() => { setIsMigrateModalOpen(false); setCategoryToDelete(null); }}
        onConfirm={handleMigrateAndDelete}
        categoryToDelete={categoryToDelete}
        existingCategories={categories}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Category"
        message={`Are you sure you want to delete the ${categoryToDelete?.name} category?`}
        onConfirm={handleSimpleDelete}
        onCancel={() => { setIsDeleteDialogOpen(false); setCategoryToDelete(null); }}
        confirmText="Delete Category"
      />
    </div>
  );
};
