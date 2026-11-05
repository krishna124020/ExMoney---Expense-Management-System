import { format, subMonths, isSameMonth, isSameYear, parseISO, startOfMonth, endOfMonth } from 'date-fns';

// Helper to generate a date string relative to today
const getRelativeDate = (monthsAgo, day) => {
  const date = subMonths(new Date(), monthsAgo);
  date.setDate(day);
  return date.toISOString(); // e.g., '2023-10-15T00:00:00.000Z'
};

export const allTransactions = [
  // THIS MONTH (0 months ago)
  { id: 1, name: 'Salary', category: 'Income', date: getRelativeDate(0, 1), amount: 35000, type: 'income' },
  { id: 2, name: 'Rent', category: 'Housing', date: getRelativeDate(0, 5), amount: 12000, type: 'expense' },
  { id: 3, name: 'Groceries', category: 'Food', date: getRelativeDate(0, 10), amount: 3200, type: 'expense' },
  { id: 4, name: 'Uber', category: 'Transport', date: getRelativeDate(0, 12), amount: 450, type: 'expense' },
  { id: 5, name: 'Netflix', category: 'Entertainment', date: getRelativeDate(0, 15), amount: 499, type: 'expense' },
  { id: 6, name: 'Freelance Project', category: 'Income', date: getRelativeDate(0, 18), amount: 8500, type: 'income' },
  { id: 7, name: 'Electricity Bill', category: 'Bills', date: getRelativeDate(0, 20), amount: 1800, type: 'expense' },
  { id: 8, name: 'Amazon Shopping', category: 'Shopping', date: getRelativeDate(0, 22), amount: 2100, type: 'expense' },

  // LAST MONTH (1 month ago)
  { id: 9, name: 'Salary', category: 'Income', date: getRelativeDate(1, 1), amount: 35000, type: 'income' },
  { id: 10, name: 'Rent', category: 'Housing', date: getRelativeDate(1, 5), amount: 12000, type: 'expense' },
  { id: 11, name: 'Groceries', category: 'Food', date: getRelativeDate(1, 12), amount: 4100, type: 'expense' },
  { id: 12, name: 'Flight Tickets', category: 'Transport', date: getRelativeDate(1, 14), amount: 6500, type: 'expense' },
  { id: 13, name: 'Water Bill', category: 'Bills', date: getRelativeDate(1, 18), amount: 600, type: 'expense' },
  { id: 14, name: 'Restaurant', category: 'Food', date: getRelativeDate(1, 25), amount: 1200, type: 'expense' },

  // 2 MONTHS AGO
  { id: 15, name: 'Salary', category: 'Income', date: getRelativeDate(2, 1), amount: 35000, type: 'income' },
  { id: 16, name: 'Rent', category: 'Housing', date: getRelativeDate(2, 5), amount: 12000, type: 'expense' },
  { id: 17, name: 'Groceries', category: 'Food', date: getRelativeDate(2, 11), amount: 2800, type: 'expense' },
  { id: 18, name: 'Movie Tickets', category: 'Entertainment', date: getRelativeDate(2, 16), amount: 800, type: 'expense' },
  { id: 19, name: 'Gas Station', category: 'Transport', date: getRelativeDate(2, 20), amount: 1500, type: 'expense' },
  { id: 20, name: 'Freelance Project', category: 'Income', date: getRelativeDate(2, 28), amount: 5000, type: 'income' },
  
  // 3 MONTHS AGO
  { id: 21, name: 'Salary', category: 'Income', date: getRelativeDate(3, 1), amount: 35000, type: 'income' },
  { id: 22, name: 'Rent', category: 'Housing', date: getRelativeDate(3, 5), amount: 12000, type: 'expense' },
  { id: 23, name: 'Groceries', category: 'Food', date: getRelativeDate(3, 15), amount: 3500, type: 'expense' },
  { id: 24, name: 'Car Maintenance', category: 'Transport', date: getRelativeDate(3, 22), amount: 4200, type: 'expense' },

  // 4 MONTHS AGO
  { id: 25, name: 'Salary', category: 'Income', date: getRelativeDate(4, 1), amount: 35000, type: 'income' },
  { id: 26, name: 'Rent', category: 'Housing', date: getRelativeDate(4, 5), amount: 12000, type: 'expense' },
  { id: 27, name: 'Groceries', category: 'Food', date: getRelativeDate(4, 10), amount: 3100, type: 'expense' },
];

export const initialScheduledTransactions = [
  { id: 's1', name: 'Salary', category: 'Salary', date: getRelativeDate(0, 1), amount: 35000, type: 'income', frequency: 'monthly' },
  { id: 's2', name: 'Rent', category: 'Housing', date: getRelativeDate(0, 5), amount: 12000, type: 'expense', frequency: 'monthly' },
  { id: 's3', name: 'Electricity', category: 'Bills', date: getRelativeDate(0, 8), amount: 2400, type: 'expense', frequency: 'monthly' },
  { id: 's4', name: 'Netflix', category: 'Entertainment', date: getRelativeDate(0, 10), amount: 649, type: 'expense', frequency: 'monthly' },
  { id: 's5', name: 'SIP', category: 'Investment', date: getRelativeDate(0, 15), amount: 5000, type: 'expense', frequency: 'monthly' },
];

// --- Helper Functions for Dashboard ---

export const getTransactionsByPeriod = (period, sourceTransactions = allTransactions) => {
  const today = new Date();
  let filtered = [];
  
  if (period === 'this-month') {
    filtered = sourceTransactions.filter(tx => isSameMonth(parseISO(tx.date), today));
  } else if (period === 'last-month') {
    const lastMonth = subMonths(today, 1);
    filtered = sourceTransactions.filter(tx => isSameMonth(parseISO(tx.date), lastMonth));
  } else if (period === 'last-30-days') {
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    filtered = sourceTransactions.filter(tx => parseISO(tx.date) >= thirtyDaysAgo && parseISO(tx.date) <= today);
  } else if (period === 'this-year') {
    filtered = sourceTransactions.filter(tx => isSameYear(parseISO(tx.date), today));
  } else {
    // Default to all for 'custom' until custom date picker is built
    filtered = sourceTransactions;
  }
  
  // Sort descending by date
  return filtered.sort((a, b) => parseISO(b.date) - parseISO(a.date));
};

export const calculateKPIs = (period, sourceTransactions = allTransactions) => {
  const currentTransactions = getTransactionsByPeriod(period, sourceTransactions);
  
  // Determine previous period for comparison
  let previousPeriod = '';
  if (period === 'this-month') previousPeriod = 'last-month';
  else if (period === 'last-month') previousPeriod = '2-months-ago';
  else if (period === 'this-year') previousPeriod = 'last-year';
  else previousPeriod = 'none';

  let previousTransactions = [];
  if (previousPeriod !== 'none') {
    const today = new Date();
    if (previousPeriod === 'last-month') {
      const lastMonth = subMonths(today, 1);
      previousTransactions = sourceTransactions.filter(tx => isSameMonth(parseISO(tx.date), lastMonth));
    } else if (previousPeriod === '2-months-ago') {
      const twoMonthsAgo = subMonths(today, 2);
      previousTransactions = sourceTransactions.filter(tx => isSameMonth(parseISO(tx.date), twoMonthsAgo));
    } else if (previousPeriod === 'last-year') {
      const lastYear = new Date(today);
      lastYear.setFullYear(today.getFullYear() - 1);
      previousTransactions = sourceTransactions.filter(tx => isSameYear(parseISO(tx.date), lastYear));
    }
  }

  const calculateTotals = (txs) => {
    const income = txs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = txs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expenses, net: income - expenses };
  };

  const current = calculateTotals(currentTransactions);
  const previous = calculateTotals(previousTransactions);

  const calculateTrend = (curr, prev) => {
    if (prev === 0) return 0;
    return Number((((curr - prev) / prev) * 100).toFixed(1));
  };

  return {
    income: {
      value: current.income,
      trend: calculateTrend(current.income, previous.income),
      isPositive: current.income >= previous.income
    },
    expenses: {
      value: current.expenses,
      trend: calculateTrend(current.expenses, previous.expenses),
      isPositive: current.expenses <= previous.expenses // Less expenses is 'positive' trend visually
    },
    netCashFlow: {
      value: current.net,
      trend: calculateTrend(current.net, previous.net),
      isPositive: current.net >= 0
    },
    // Mock static balance for now, normally calculated from all historical data
    totalBalance: {
      value: 125400 + current.net, 
      trend: calculateTrend(125400 + current.net, 125400 + previous.net),
      isPositive: true
    }
  };
};

export const getChartData = (sourceTransactions = allTransactions) => {
  // Aggregate Income vs Expenses for the last 5 months
  const monthsData = [];
  for (let i = 4; i >= 0; i--) {
    const targetMonth = subMonths(new Date(), i);
    const monthName = format(targetMonth, 'MMM');
    
    const monthTxs = sourceTransactions.filter(tx => isSameMonth(parseISO(tx.date), targetMonth));
    const income = monthTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = monthTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    
    monthsData.push({ month: monthName, income, expenses });
  }
  return monthsData;
};

export const getCategoryData = (transactions) => {
  const expenseTxs = transactions.filter(t => t.type === 'expense');
  const categoryMap = {};
  
  expenseTxs.forEach(tx => {
    categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
  });

  const colors = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#64748b'];
  let colorIndex = 0;

  return Object.keys(categoryMap).map(category => ({
    name: category,
    value: categoryMap[category],
    color: colors[colorIndex++ % colors.length]
  })).sort((a, b) => b.value - a.value);
};

export const getPeriodLabel = (period) => {
  const today = new Date();
  if (period === 'this-month') return format(today, 'MMMM yyyy');
  if (period === 'last-month') return format(subMonths(today, 1), 'MMMM yyyy');
  if (period === 'last-30-days') return 'Last 30 Days';
  if (period === 'this-year') return format(today, 'yyyy');
  if (period === 'custom') return 'Custom Range';
  return '';
};

export const mockGoals = [
  {
    id: 'goal-1',
    name: 'Emergency Fund',
    icon: 'Shield',
    targetAmount: 50000,
    savedAmount: 25000,
    targetDate: '2026-12-31T00:00:00Z',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'goal-2',
    name: 'New Laptop',
    icon: 'Laptop',
    targetAmount: 80000,
    savedAmount: 20000,
    targetDate: '2027-06-30T00:00:00Z',
    createdAt: '2026-03-15T00:00:00Z'
  },
  {
    id: 'goal-3',
    name: 'Vacation',
    icon: 'Plane',
    targetAmount: 40000,
    savedAmount: 40000,
    targetDate: '2026-08-01T00:00:00Z',
    createdAt: '2026-02-01T00:00:00Z'
  }
];
