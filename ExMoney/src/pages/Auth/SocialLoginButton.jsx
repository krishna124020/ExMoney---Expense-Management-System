import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';

export const SocialLoginButton = ({ provider, icon, onClick, type = 'oauth' }) => {
  const [error, setError] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (type === 'oauth') {
      // Simulate "Not Configured" for OAuth providers
      setError(true);
      setTimeout(() => setError(false), 3000);
    } else {
      if (onClick) onClick(e);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Button 
        type="button" 
        variant="secondary" 
        className="w-full"
        onClick={handleClick}
        style={{ borderColor: error ? 'var(--color-danger)' : undefined }}
      >
        {icon}
        Continue with {provider}
      </Button>
      {error && (
        <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: 'var(--space-2)', textAlign: 'center' }}>
          {provider} authentication is not configured yet.
        </div>
      )}
    </div>
  );
};
