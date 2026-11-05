/**
 * Formats a number as a currency string in Indian Rupees (INR).
 * 
 * @param {number} amount - The amount to format
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
