import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * SignIn Component
 * Authenticates users with Gmail address and strict password validation rules.
 */
export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const redirectPath = location.state?.from || '/my-reports';

  // Comprehensive validation per requirements
  const validateForm = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return 'Please enter a valid Gmail address.';
    }

    // Email validation: must end with @gmail.com
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!trimmedEmail.toLowerCase().endsWith('@gmail.com') || !gmailRegex.test(trimmedEmail)) {
      return 'Please enter a valid Gmail address.';
    }

    if (!password) {
      return 'Please enter your password.';
    }

    // Minimum 8 characters
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }

    // At least 1 uppercase letter (A-Z)
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least 1 uppercase letter (A-Z).';
    }

    // At least 1 lowercase letter (a-z)
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least 1 lowercase letter (a-z).';
    }

    // At least 1 digit (0-9)
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least 1 digit (0-9).';
    }

    // At least 1 special character
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return 'Password must contain at least 1 special character (such as @, #, $, %, !).';
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    const result = login(email, password);
    if (result.success) {
      navigate(redirectPath);
    } else {
      setError(result.error || 'Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <main className="auth-page">
      <div className="app-container">
        <div className="auth-card-wrapper">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon-badge">
                <LogIn size={24} />
              </div>
              <h1 className="auth-title">Campus Sign In</h1>
              <p className="auth-subtitle">
                Sign in with your Gmail credentials to manage your lost &amp; found reports.
              </p>
            </div>

            {error && (
              <div className="auth-error-banner" role="alert">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Gmail Address
                </label>
                <div className="input-with-icon">
                  <Mail className="input-leading-icon" size={16} />
                  <input
                    type="email"
                    id="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-with-icon">
                  <Lock className="input-leading-icon" size={16} />
                  <input
                    type="password"
                    id="password"
                    placeholder="e.g. Hello@123"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-auth-submit">
                <LogIn size={16} />
                <span>Sign In to Trovio</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

