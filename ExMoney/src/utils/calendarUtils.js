import { 
  addDays, 
  addWeeks, 
  addMonths, 
  addYears, 
  isBefore, 
  isAfter, 
  isSameDay, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth
} from 'date-fns';

/**
 * Generates all occurrences of a scheduled transaction within a specific date range.
 * @param {Object} transaction - The scheduled transaction object
 * @param {Date} rangeStart - Start of the range to check (e.g., start of a month)
 * @param {Date} rangeEnd - End of the range to check (e.g., end of a month)
 * @returns {Array} - Array of transaction occurrences (copies with specific dates)
 */
export const getTransactionOccurrences = (transaction, rangeStart, rangeEnd) => {
  const occurrences = [];
  const startDate = parseISO(transaction.date);
  let endDate = transaction.endDate ? parseISO(transaction.endDate) : null;
  
  // If the transaction ends before our range starts, no occurrences
  if (endDate && isBefore(endDate, rangeStart)) {
    return occurrences;
  }
  
  // If the transaction starts after our range ends, no occurrences
  if (isAfter(startDate, rangeEnd)) {
    return occurrences;
  }

  // Base occurrence object
  const createOccurrence = (currentDate) => ({
    ...transaction,
    occurrenceId: `${transaction.id}-${currentDate.toISOString()}`,
    originalDate: transaction.date,
    date: currentDate.toISOString() // Override date with the occurrence date
  });

  let currentDate = startDate;

  // Advance currentDate to the first occurrence that is >= rangeStart, or until we exceed rangeEnd
  // We have to iterate to find the correct starting point to handle frequency properly
  // For 'none', it's just the start date.
  if (transaction.frequency === 'none' || !transaction.frequency) {
    if ((!isBefore(startDate, rangeStart) || isSameDay(startDate, rangeStart)) && 
        (!isAfter(startDate, rangeEnd) || isSameDay(startDate, rangeEnd))) {
      occurrences.push(createOccurrence(startDate));
    }
    return occurrences;
  }

  // Iteratively find occurrences
  while (!isAfter(currentDate, rangeEnd)) {
    // If there's an end date and we passed it, stop
    if (endDate && isAfter(currentDate, endDate)) {
      break;
    }

    // If current date is within the range, add it
    if ((!isBefore(currentDate, rangeStart) || isSameDay(currentDate, rangeStart)) && 
        (!isAfter(currentDate, rangeEnd) || isSameDay(currentDate, rangeEnd))) {
      occurrences.push(createOccurrence(currentDate));
    }

    // Increment current date based on frequency
    if (transaction.frequency === 'daily') {
      currentDate = addDays(currentDate, 1);
    } else if (transaction.frequency === 'weekly') {
      currentDate = addWeeks(currentDate, 1);
    } else if (transaction.frequency === 'monthly') {
      currentDate = addMonths(currentDate, 1);
    } else if (transaction.frequency === 'yearly') {
      currentDate = addYears(currentDate, 1);
    } else {
      break; // Fallback
    }
  }

  return occurrences;
};

/**
 * Gets all transaction occurrences for a specific month.
 */
export const getOccurrencesForMonth = (transactions, monthDate) => {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  
  let allOccurrences = [];
  transactions.forEach(tx => {
    allOccurrences = [...allOccurrences, ...getTransactionOccurrences(tx, start, end)];
  });
  
  return allOccurrences.sort((a, b) => parseISO(a.date) - parseISO(b.date));
};

/**
 * Generates the calendar grid days (including padding days from prev/next months)
 */
export const getCalendarDays = (monthDate) => {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthStart);
  
  // We want the calendar to start on Sunday (or Monday, depending on locale, startOfWeek defaults to Sunday)
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map(day => ({
    date: day,
    isCurrentMonth: isSameMonth(day, monthStart)
  }));
};
