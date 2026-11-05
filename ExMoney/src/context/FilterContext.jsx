import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  isWithinInterval, 
  startOfDay, 
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  parseISO
} from 'date-fns';

const FilterContext = createContext();

export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const initialFilterState = {
    dateRange: 'All Time', // 'All Time', 'Today', 'This Week', 'This Month', 'Last Month', 'This Year', 'Custom'
    customDateStart: '',
    customDateEnd: '',
    type: 'All', // 'All', 'Expense', 'Income', 'Transfer'
    categories: [], // Array of category names
    accounts: [], // Array of account IDs
    paymentMethods: [], // Array of method strings
    minAmount: '',
    maxAmount: '',
    status: 'All' // 'All', 'Completed', 'Pending', 'Scheduled'
  };

  const [filters, setFilters] = useState(initialFilterState);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilterState);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.dateRange !== 'All Time') count++;
    if (filters.type !== 'All') count++;
    if (filters.categories.length > 0) count++;
    if (filters.accounts.length > 0) count++;
    if (filters.paymentMethods.length > 0) count++;
    if (filters.minAmount !== '' || filters.maxAmount !== '') count++;
    if (filters.status !== 'All') count++;
    return count;
  }, [filters]);

  // Main utility to filter an array of transactions based on active filters
  const filterTransactions = (transactions) => {
    if (!transactions) return [];
    
    return transactions.filter(tx => {
      // 1. Date Range Filter
      if (filters.dateRange !== 'All Time') {
        const txDate = new Date(tx.date || tx.createdAt || new Date());
        const now = new Date();
        let start, end;
        
        switch (filters.dateRange) {
          case 'Today':
            start = startOfDay(now);
            end = endOfDay(now);
            break;
          case 'This Week':
            start = startOfWeek(now, { weekStartsOn: 1 });
            end = endOfWeek(now, { weekStartsOn: 1 });
            break;
          case 'This Month':
            start = startOfMonth(now);
            end = endOfMonth(now);
            break;
          case 'Last Month':
            const lastMonth = subMonths(now, 1);
            start = startOfMonth(lastMonth);
            end = endOfMonth(lastMonth);
            break;
          case 'This Year':
            start = startOfYear(now);
            end = endOfYear(now);
            break;
          case 'Custom':
            start = filters.customDateStart ? new Date(filters.customDateStart) : new Date('1970-01-01');
            end = filters.customDateEnd ? endOfDay(new Date(filters.customDateEnd)) : new Date('2100-01-01');
            break;
          default:
            start = new Date('1970-01-01');
            end = new Date('2100-01-01');
        }
        
        if (!isWithinInterval(txDate, { start, end })) return false;
      }

      // 2. Type Filter
      if (filters.type !== 'All') {
        const txType = tx.type?.toLowerCase() || (tx.amount < 0 ? 'expense' : 'income');
        if (txType !== filters.type.toLowerCase()) return false;
      }

      // 3. Categories Filter
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(tx.category)) return false;
      }

      // 4. Accounts Filter
      if (filters.accounts.length > 0) {
        if (!filters.accounts.includes(tx.accountId)) return false;
      }

      // 5. Payment Methods Filter
      if (filters.paymentMethods.length > 0) {
        if (!filters.paymentMethods.includes(tx.paymentMethod)) return false;
      }

      // 6. Amount Range Filter
      const absAmount = Math.abs(tx.amount || tx.targetAmount || 0);
      if (filters.minAmount !== '' && absAmount < parseFloat(filters.minAmount)) return false;
      if (filters.maxAmount !== '' && absAmount > parseFloat(filters.maxAmount)) return false;

      // 7. Status Filter
      if (filters.status !== 'All') {
        if (tx.status && tx.status !== filters.status) return false;
      }

      return true;
    });
  };

  const value = {
    filters,
    updateFilter,
    clearAllFilters,
    activeFilterCount,
    filterTransactions,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
