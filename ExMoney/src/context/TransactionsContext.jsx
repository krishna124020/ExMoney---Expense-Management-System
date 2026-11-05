import React, { createContext, useContext, useState, useEffect } from 'react';
import { allTransactions } from '../data/mockData';
import { simulateNetwork } from '../utils/simulateNetwork';

const TransactionsContext = createContext();

export const useTransactions = () => {
  return useContext(TransactionsContext);
};

export const TransactionsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Initialize state with allTransactions, adding missing default fields
  const [transactions, setTransactions] = useState(() => {
    return allTransactions.map(tx => ({
      ...tx,
      paymentMethod: tx.paymentMethod || 'UPI', // Default to UPI if missing
      notes: tx.notes || '',
      accountId: tx.accountId || 'acc1' // Tie all past mock data to HDFC Savings by default
    }));
  });

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await simulateNetwork(0.1, 600);
      // Data is already in state, but we simulate the network delay and potential error
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (transaction) => {
    await simulateNetwork(0.2, 500);
    const newTransaction = {
      ...transaction,
      id: Date.now() + Math.random().toString(36).substring(2, 9),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const editTransaction = async (updatedTransaction) => {
    await simulateNetwork(0.2, 500);
    setTransactions(prev => 
      prev.map(tx => tx.id === updatedTransaction.id ? updatedTransaction : tx)
    );
  };

  const deleteTransaction = async (id) => {
    await simulateNetwork(0.2, 500);
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const updateCategoryName = (oldName, newName) => {
    setTransactions(prev => prev.map(tx => 
      tx.category === oldName ? { ...tx, category: newName } : tx
    ));
  };

  const value = {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    updateCategoryName,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};
