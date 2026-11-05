import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: `sys-${Date.now()}`,
      category: 'System',
      title: 'Welcome to ExMoney',
      message: 'Your financial workspace is ready.',
      date: new Date().toISOString(),
      read: false,
      actionLink: null
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        read: false,
        ...notification
      },
      ...prev
    ]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearRead = () => {
    setNotifications(prev => prev.filter(n => !n.read));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    isLoading,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearRead
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
