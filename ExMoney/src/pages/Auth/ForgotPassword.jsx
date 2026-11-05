import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthLayout } from './AuthLayout';
import './Auth.css';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate sending email
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1200);
  };

  if (isSuccess) {
    return (
      <AuthLayout 
        title="Check your email" 
        subtitle="We've sent a password reset link to your email address."
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-6)', padding: 'var(--space-4) 0' }}>
          <CheckCircle size={64} style={{ color: 'var(--color-secondary)' }} />
          
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <form className="auth-form" onSubmit={handleReset} noValidate>
        
        <Input 
          type="email"
          id="email"
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          disabled={isLoading}
        />

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full mt-2" 
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : (
            <>
              <Send size={18} /> Send Reset Link
            </>
          )}
        </Button>
      </form>

      <div className="auth-footer">
        <a href="#" className="auth-link" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={16} /> Back to Login
        </a>
      </div>
    </AuthLayout>
  );
};
