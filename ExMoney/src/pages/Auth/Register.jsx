import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Check, Circle, Phone } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthLayout } from './AuthLayout';
import { SocialLoginButton } from './SocialLoginButton';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Password strength state
  const [pwdStrength, setPwdStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    const pwd = formData.password;
    setPwdStrength({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(pwd),
    });
  }, [formData.password]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when modified
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your name.';
    }
    
    if (!formData.email) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone) {
      newErrors.phone = 'Please enter your phone number.';
    } else {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        newErrors.phone = 'Please enter a valid phone number.';
      }
    }

    const isPasswordValid = Object.values(pwdStrength).every(Boolean);
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (!isPasswordValid) {
      newErrors.password = 'Password does not meet the requirements.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Please accept the Terms of Service and Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      // Simulate network request for registration
      setTimeout(() => {
        setIsLoading(false);
        login(); // Set global auth state on successful register
        navigate('/dashboard'); // Route to dashboard (or onboarding later)
      }, 1500);
    }
  };

  const strengthItems = [
    { key: 'length', label: 'At least 8 characters' },
    { key: 'uppercase', label: 'One uppercase letter' },
    { key: 'lowercase', label: 'One lowercase letter' },
    { key: 'number', label: 'One number' },
    { key: 'special', label: 'One special character' }
  ];

  return (
    <AuthLayout 
      title="Create Your Account" 
      subtitle="Start managing your money smarter with ExMoney."
    >
      <form className="auth-form" onSubmit={handleRegister} noValidate>
        
        <Input 
          type="text"
          id="fullName"
          label="Full Name"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          disabled={isLoading}
        />

        <Input 
          type="email"
          id="email"
          label="Email Address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
        />

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
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Input 
            type={showPassword ? "text" : "password"}
            id="password"
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            error={errors.password}
            disabled={isLoading}
            rightElement={
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          
          {(isPasswordFocused || formData.password.length > 0) && (
            <div className="pwd-strength-container">
              {strengthItems.map(item => {
                const isMet = pwdStrength[item.key];
                return (
                  <div key={item.key} className={`pwd-strength-item ${isMet ? 'met' : ''}`}>
                    {isMet ? <Check size={14} /> : <Circle size={14} />}
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Input 
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isLoading}
          rightElement={
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex="-1"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <div className="terms-checkbox">
          <label>
            <input 
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span>
              I agree to the <a href="#" onClick={e => e.preventDefault()} className="auth-link">Terms of Service</a> and <a href="#" onClick={e => e.preventDefault()} className="auth-link">Privacy Policy</a>.
            </span>
          </label>
          {errors.acceptTerms && <div className="input-error mt-1">{errors.acceptTerms}</div>}
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full mt-2" 
          disabled={isLoading}
          style={{ padding: 'var(--space-3)' }}
        >
          {isLoading ? 'Creating Account...' : (
            <>
              <UserPlus size={18} /> Create Account
            </>
          )}
        </Button>
      </form>

      <div className="auth-divider">OR</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <SocialLoginButton 
          provider="Google" 
          icon={
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
          } 
        />
        <SocialLoginButton 
          provider="Facebook" 
          icon={
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          } 
        />
      </div>

      <div className="auth-footer">
        Already have an account? <a href="#" className="auth-link" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Log In</a>
      </div>
    </AuthLayout>
  );
};
