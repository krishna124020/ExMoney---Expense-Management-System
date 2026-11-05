import React from 'react';
import './ui.css';

export const Spinner = ({ size = 20, color = 'currentColor', className = '' }) => {
  return (
    <svg
      className={`spinner ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};
