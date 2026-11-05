import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({ 
  title = "Something went wrong", 
  message = "We couldn't load the requested data. Please try again.", 
  onRetry 
}) => {
  return (
    <div className="state-container" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-12) var(--space-4)' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
        <AlertCircle size={32} />
      </div>
      <h3 className="h3" style={{ marginBottom: 'var(--space-2)' }}>{title}</h3>
      <p className="text-muted" style={{ maxWidth: '400px', margin: '0 0 var(--space-6) 0' }}>{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
