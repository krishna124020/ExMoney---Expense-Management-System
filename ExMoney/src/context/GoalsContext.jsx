import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockGoals } from '../data/mockData';
import { simulateNetwork } from '../utils/simulateNetwork';

const GoalsContext = createContext();

export const useGoals = () => useContext(GoalsContext);

export const GoalsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState(mockGoals);

  const fetchGoals = async () => {
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
    fetchGoals();
  }, []);
  
  // Future Savings State
  const [futureSavings, setFutureSavings] = useState({
    total: 35000,
    history: [
      { id: 'fs-1', date: '2026-09-01T00:00:00Z', amount: 35000, type: 'Added', note: 'Initial savings' }
    ]
  });

  const addGoal = async (goal) => {
    await simulateNetwork(0.2, 500);
    const newGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const editGoal = async (updatedGoal) => {
    await simulateNetwork(0.2, 500);
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };

  const deleteGoal = async (id) => {
    await simulateNetwork(0.2, 500);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const adjustGoalSavedAmount = async (id, newSavedAmount) => {
    await simulateNetwork(0.2, 500);
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, savedAmount: Math.max(0, newSavedAmount) };
      }
      return g;
    }));
  };

  const addMoneyToGoal = async (id, amountToAdd) => {
    await simulateNetwork(0.2, 500);
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, savedAmount: Math.max(0, g.savedAmount + amountToAdd) };
      }
      return g;
    }));
  };

  const addFutureSavings = async (amount, date, note) => {
    await simulateNetwork(0.2, 500);
    setFutureSavings(prev => {
      const newTotal = Math.max(0, prev.total + amount);
      const newEntry = {
        id: `fs-${Date.now()}`,
        date: date || new Date().toISOString(),
        amount: amount,
        type: 'Added',
        note: note || ''
      };
      return {
        total: newTotal,
        history: [newEntry, ...prev.history]
      };
    });
  };

  const adjustFutureSavings = async (newTotal, date, note) => {
    await simulateNetwork(0.2, 500);
    setFutureSavings(prev => {
      const validTotal = Math.max(0, newTotal);
      const difference = validTotal - prev.total;
      
      const newEntry = {
        id: `fs-${Date.now()}`,
        date: date || new Date().toISOString(),
        amount: difference,
        type: 'Adjusted',
        note: note || ''
      };
      return {
        total: validTotal,
        history: [newEntry, ...prev.history]
      };
    });
  };

  const value = {
    goals,
    isLoading,
    error,
    fetchGoals,
    addGoal,
    editGoal,
    deleteGoal,
    adjustGoalSavedAmount,
    addMoneyToGoal,
    futureSavings,
    addFutureSavings,
    adjustFutureSavings
  };

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};
