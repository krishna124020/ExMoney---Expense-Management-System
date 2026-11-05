import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Phone } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthLayout } from './AuthLayout';
import { SocialLoginButton } from './SocialLoginButton';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      // Simulate network request
      setTimeout(() => {
        setIsLoading(false);
        login(); // Set global auth state
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Log in to manage your expenses and stay in control of your finances."
    >
      <form className="auth-form" onSubmit={handleLogin} noValidate>
        <Input 
          type="email"
          id="email"
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isLoading}
        />

        <Input 
          type={showPassword ? "text" : "password"}
          id="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        <div className="auth-options">
          <label>
            <input 
              type="checkbox" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            Remember me
          </label>
          <a href="#" className="auth-link" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>
            Forgot Password?
          </a>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full mt-2" 
          disabled={isLoading}
          style={{ padding: 'var(--space-3)' }}
        >
          {isLoading ? 'Logging in...' : (
            <>
              <LogIn size={18} /> Login
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
          provider="Phone Number" 
          type="navigation"
          icon={<Phone size={18} />} 
          onClick={() => navigate('/phone-login')}
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
        Don't have an account? <a href="#" className="auth-link" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Create Account</a>
      </div>
    </AuthLayout>
  );
};
