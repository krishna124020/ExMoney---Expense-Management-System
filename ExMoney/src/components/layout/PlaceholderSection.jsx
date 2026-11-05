import React from 'react';

export const PlaceholderSection = ({ title }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      textAlign: 'center',
      color: 'var(--color-text-muted)'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🚧</div>
      <h2 className="h3" style={{ color: 'var(--color-text)' }}>{title}</h2>
      <p style={{ maxWidth: '400px', marginTop: 'var(--space-2)' }}>
        This module is currently under construction and will be implemented in a future update.
      </p>
    </div>
  );
};
