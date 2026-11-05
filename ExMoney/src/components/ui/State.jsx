import React from 'react';
import { Loader2 } from 'lucide-react';
import './ui.css';

export const LoadingState = ({ message = 'Loading...' }) => (
  <div className="state-container">
    <Loader2 className="spinner" size={32} />
    <p className="mt-4">{message}</p>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="state-container">
    {Icon && <Icon size={48} style={{ color: 'var(--color-border)', marginBottom: 'var(--space-4)' }} />}
    <h3 className="h3 mb-2">{title}</h3>
    <p className="text-muted mb-4">{description}</p>
    {action && <div>{action}</div>}
  </div>
);
