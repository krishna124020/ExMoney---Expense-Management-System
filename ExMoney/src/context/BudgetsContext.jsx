import React, { createContext, useContext, useState, useEffect } from 'react';
import { simulateNetwork } from '../utils/simulateNetwork';

const BudgetsContext = createContext(null);

export const BudgetsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budgets, setBudgets] = useState([
    {
      id: 'b1',
      category: 'Food',
      amount: 8000,
      period: 'Monthly',
      startDate: null,
      endDate: null,
    },
    {
      id: 'b2',
      category: 'Shopping',
      amount: 3000,
      period: 'Monthly',
      startDate: null,
      endDate: null,
    },
    {
      id: 'b3',
      category: 'Entertainment',
      amount: 2000,
      period: 'Monthly',
      startDate: null,
      endDate: null,
    }
  ]);

  const fetchBudgets = async () => {
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
    fetchBudgets();
  }, []);

  const addBudget = async (budget) => {
    await simulateNetwork(0.2, 500);
    setBudgets(prev => [{ ...budget, id: `b${Date.now()}` }, ...prev]);
  };

  const editBudget = async (id, updatedBudget) => {
    await simulateNetwork(0.2, 500);
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updatedBudget } : b));
  };

  const deleteBudget = async (id) => {
    await simulateNetwork(0.2, 500);
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const updateCategoryName = (oldName, newName) => {
    setBudgets(prev => prev.map(b => 
      b.category === oldName ? { ...b, category: newName } : b
    ));
  };

  return (
    <BudgetsContext.Provider value={{ budgets, isLoading, error, fetchBudgets, addBudget, editBudget, deleteBudget, updateCategoryName }}>
      {children}
    </BudgetsContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetsContext);
  if (!context) {
    throw new Error('useBudgets must be used within a BudgetsProvider');
  }
  return context;
};
