export const simulateNetwork = async (probability = 0.2, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Toggle window.FORCE_ERRORS = true in console to force errors
      const shouldFail = window.FORCE_ERRORS !== undefined ? window.FORCE_ERRORS : Math.random() < probability;
      
      if (shouldFail) {
        reject(new Error("A network error occurred. Please try again."));
      } else {
        resolve();
      }
    }, delay);
  });
};
