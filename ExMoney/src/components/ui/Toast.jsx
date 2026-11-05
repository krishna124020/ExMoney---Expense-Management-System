import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './ui.css';

export const Toast = ({ message, type = 'success', onClose }) => {
  return (
    <div className={`toast ${type}`}>
      {type === 'success' ? <CheckCircle size={20} className="text-secondary" /> : <XCircle size={20} className="text-danger" />}
      <span className="font-medium">{message}</span>
    </div>
  );
};

export const ToastContainer = ({ children }) => (
  <div className="toast-container">
    {children}
  </div>
);
