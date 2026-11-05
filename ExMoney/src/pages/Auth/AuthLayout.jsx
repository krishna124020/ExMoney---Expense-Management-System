import React from 'react';
import { Wallet } from 'lucide-react';
import './Auth.css';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">
            <Wallet size={28} />
            <span>ExMoney</span>
          </div>
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
        </div>
        
        {children}
      </div>
    </div>
  );
};
