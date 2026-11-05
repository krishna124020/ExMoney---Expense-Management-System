import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check local storage on mount (simulated persistence)
    const storedAuth = localStorage.getItem('exmoney_auth_simulated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('exmoney_auth_simulated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('exmoney_auth_simulated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
