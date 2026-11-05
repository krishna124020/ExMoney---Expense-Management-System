import React from 'react';
import './ui.css';

export const Input = ({ 
  label, 
  error, 
  id, 
  rightElement,
  className = '', 
  ...props 
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <div className="input-wrapper">
        <input 
          id={id}
          className={`input-field ${error ? 'error' : ''} ${rightElement ? 'has-right-element' : ''}`} 
          {...props} 
        />
        {rightElement && <div className="input-right-element">{rightElement}</div>}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
