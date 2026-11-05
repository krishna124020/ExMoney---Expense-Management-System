import React from 'react';
import './ui.css';

export const Skeleton = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = 'var(--radius-md)', 
  className = '',
  style = {} 
}) => {
  return (
    <div 
      className={`skeleton-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
};
