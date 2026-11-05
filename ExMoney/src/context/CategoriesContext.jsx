import React, { createContext, useContext, useState, useEffect } from 'react';
import { simulateNetwork } from '../utils/simulateNetwork';

const CategoriesContext = createContext(null);

const DEFAULT_CATEGORIES = [
  // Expenses
  { id: 'c1', name: 'Food', type: 'expense', icon: 'Utensils' },
  { id: 'c2', name: 'Transport', type: 'expense', icon: 'Car' },
  { id: 'c3', name: 'Shopping', type: 'expense', icon: 'ShoppingBag' },
  { id: 'c4', name: 'Bills', type: 'expense', icon: 'FileText' },
  { id: 'c5', name: 'Entertainment', type: 'expense', icon: 'Film' },
  { id: 'c6', name: 'Health', type: 'expense', icon: 'Heart' },
  { id: 'c7', name: 'Education', type: 'expense', icon: 'Book' },
  { id: 'c8', name: 'Travel', type: 'expense', icon: 'Plane' },
  { id: 'c9', name: 'Other', type: 'expense', icon: 'MoreHorizontal' },
  // Income
  { id: 'c10', name: 'Salary', type: 'income', icon: 'Briefcase' },
  { id: 'c11', name: 'Freelance', type: 'income', icon: 'Laptop' },
  { id: 'c12', name: 'Business', type: 'income', icon: 'Building' },
  { id: 'c13', name: 'Investment', type: 'income', icon: 'TrendingUp' },
  { id: 'c14', name: 'Gift', type: 'income', icon: 'Gift' },
  { id: 'c15', name: 'Other Income', type: 'income', icon: 'MoreHorizontal' },
];

export const CategoriesProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await simulateNetwork(0.1, 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (categoryData) => {
    await simulateNetwork(0.2, 500);
    setCategories(prev => [{ ...categoryData, id: `c${Date.now()}` }, ...prev]);
  };

  const editCategory = async (id, updatedData) => {
    await simulateNetwork(0.2, 500);
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteCategory = async (id) => {
    await simulateNetwork(0.2, 500);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CategoriesContext.Provider value={{ categories, isLoading, error, fetchCategories, addCategory, editCategory, deleteCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};
