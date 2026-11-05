import React from 'react';
import './ui.css';

import { Spinner } from './Spinner';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  disabled,
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size} ${className}`} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
};
