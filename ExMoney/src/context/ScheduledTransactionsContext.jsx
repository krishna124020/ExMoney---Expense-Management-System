import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialScheduledTransactions } from '../data/mockData';
import { simulateNetwork } from '../utils/simulateNetwork';

const ScheduledTransactionsContext = createContext();

export const useScheduledTransactions = () => {
  return useContext(ScheduledTransactionsContext);
};

export const ScheduledTransactionsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduledTransactions, setScheduledTransactions] = useState(initialScheduledTransactions);

  const fetchScheduledTransactions = async () => {
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
    fetchScheduledTransactions();
  }, []);

  const addTransaction = async (transaction) => {
    await simulateNetwork(0.2, 500);
    const newTx = {
      ...transaction,
      id: Date.now().toString(),
    };
    setScheduledTransactions(prev => [...prev, newTx]);
  };

  const editTransaction = async (updatedTransaction) => {
    await simulateNetwork(0.2, 500);
    setScheduledTransactions(prev => 
      prev.map(tx => tx.id === updatedTransaction.id ? updatedTransaction : tx)
    );
  };

  const deleteTransaction = async (id) => {
    await simulateNetwork(0.2, 500);
    setScheduledTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const value = {
    scheduledTransactions,
    isLoading,
    error,
    fetchScheduledTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction
  };

  return (
    <ScheduledTransactionsContext.Provider value={value}>
      {children}
    </ScheduledTransactionsContext.Provider>
  );
};
