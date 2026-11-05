import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthLayout } from './AuthLayout';
import './Auth.css';

export const PhoneLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!phone) {
      setError('Phone number is required');
      return;
    }
    // Basic validation for length after stripping non-digits
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      navigate('/verify-otp', { state: { phone } });
    }, 1000);
  };

  return (
    <AuthLayout 
      title="Continue with Phone" 
      subtitle="We will send a one-time password to this number."
    >
      <form className="auth-form" onSubmit={handleSendOTP} noValidate>
        
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <div style={{ width: '80px' }}>
            <Input 
              type="text"
              id="countryCode"
              label="Code"
              value="+91"
              disabled
            />
          </div>
          <div style={{ flex: 1 }}>
            <Input 
              type="tel"
              id="phone"
              label="Phone Number"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={error}
              disabled={isLoading}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full mt-4" 
          disabled={isLoading}
        >
          {isLoading ? 'Sending OTP...' : (
            <>
              <Smartphone size={18} /> Send OTP
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
