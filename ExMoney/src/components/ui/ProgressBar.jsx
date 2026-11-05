import React from 'react';

export const ProgressBar = ({ percentage, color = 'var(--color-primary)' }) => {
  return (
    <div style={{ width: '100%', backgroundColor: 'var(--color-border)', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
      <div 
        style={{ 
          width: `${Math.min(Math.max(percentage, 0), 100)}%`, 
          backgroundColor: color,
          height: '100%',
          transition: 'width 0.3s ease-in-out',
        }} 
      />
    </div>
  );
};
