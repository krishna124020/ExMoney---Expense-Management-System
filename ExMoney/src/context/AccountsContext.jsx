import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { simulateNetwork } from '../utils/simulateNetwork';

const AccountsContext = createContext();

export const useAccounts = () => useContext(AccountsContext);

const initialAccounts = [
  { 
    id: 'acc1', 
    bankName: 'HDFC Bank', 
    nickname: 'Personal Savings', 
    accountType: 'Savings', 
    last4: '4521', 
    balance: 45000, 
    iconColor: '#3b82f6', 
    isActive: true 
  },
  { 
    id: 'acc2', 
    bankName: 'State Bank of India', 
    nickname: 'Emergency Fund', 
    accountType: 'Savings', 
    last4: '8712', 
    balance: 18500, 
    iconColor: '#10b981', 
    isActive: true 
  },
  { 
    id: 'acc3', 
    bankName: 'Cash Wallet', 
    nickname: 'Pocket Money', 
    accountType: 'Cash', 
    last4: '', 
    balance: 3000, 
    iconColor: '#f59e0b', 
    isActive: true 
  }
];

export const AccountsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState(initialAccounts);

  const fetchAccounts = async () => {
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
    fetchAccounts();
  }, []);

  const addAccount = async (account) => {
    await simulateNetwork(0.2, 500);
    const newAccount = {
      ...account,
      id: Date.now() + Math.random().toString(36).substring(2, 9),
    };
    setAccounts((prev) => [...prev, newAccount]);
  };

  const editAccount = async (updatedAccount) => {
    await simulateNetwork(0.2, 500);
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
    );
  };

  const deleteAccount = async (id) => {
    await simulateNetwork(0.2, 500);
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const updateAccountBalance = async (id, amountChange) => {
    await simulateNetwork(0.2, 500);
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          return { ...acc, balance: acc.balance + amountChange };
        }
        return acc;
      })
    );
  };

  const { totalAvailableBalance, totalCreditDebt } = useMemo(() => {
    let available = 0;
    let debt = 0;
    
    accounts.forEach((acc) => {
      if (acc.accountType === 'Credit Card' || acc.balance < 0) {
        debt += Math.abs(acc.balance); // Represent debt as a positive amount for display
      } else {
        available += acc.balance;
      }
    });

    return { totalAvailableBalance: available, totalCreditDebt: debt };
  }, [accounts]);

  const value = {
    accounts,
    isLoading,
    error,
    fetchAccounts,
    totalAvailableBalance,
    totalCreditDebt,
    addAccount,
    editAccount,
    deleteAccount,
    updateAccountBalance,
  };

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
};
