import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const phone = location.state?.phone || 'your number';
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!otp) {
      setError('OTP is required');
      return;
    }
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      login();
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Verify Your Number" 
      subtitle={`We've sent a 6-digit code to ${phone}.`}
    >
      <form className="auth-form" onSubmit={handleVerify} noValidate>
        
        <Input 
          type="text"
          id="otp"
          label="6-Digit OTP"
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          error={error}
          disabled={isLoading}
          style={{ letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.25rem' }}
        />

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full mt-2" 
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : (
            <>
              <CheckCircle size={18} /> Verify OTP
            </>
          )}
        </Button>
      </form>

      <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ fontSize: '0.875rem' }}>
          {countdown > 0 ? (
            <span className="text-muted">Resend OTP in {countdown}s</span>
          ) : (
            <a href="#" className="auth-link" onClick={(e) => {
              e.preventDefault();
              setCountdown(30);
              // Trigger resend logic here
            }}>
              Resend OTP
            </a>
          )}
        </div>

        <a href="#" className="auth-link text-muted" onClick={(e) => { e.preventDefault(); navigate('/phone-login'); }} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <ArrowLeft size={16} /> Change phone number
        </a>
      </div>
    </AuthLayout>
  );
};
