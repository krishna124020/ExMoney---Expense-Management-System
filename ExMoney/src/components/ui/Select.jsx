import React from 'react';
import './ui.css';

export const Select = ({ 
  label, 
  error, 
  id, 
  options = [], 
  className = '', 
  children,
  ...props 
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <select 
        id={id}
        className={`input-field ${error ? 'error' : ''}`} 
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
        {children}
      </select>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
