import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, IdCard, Building2, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * SignUp Component
 * Allows students to register a new account stored in browser localStorage.
 * Enforces secure credentials and integrates with AuthContext.
 */
export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    department: 'Computer Science & Engineering',
    phone: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const redirectPath = location.state?.from || '/my-reports';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!formData.name.trim()) {
      return 'Please enter your full name.';
    }

    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      return 'Please enter your Gmail address.';
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!trimmedEmail.toLowerCase().endsWith('@gmail.com') || !gmailRegex.test(trimmedEmail)) {
      return 'Please enter a valid Gmail address (e.g. name@gmail.com).';
    }

    if (!formData.password) {
      return 'Please enter a password.';
    }

    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }

    if (!/[A-Z]/.test(formData.password)) {
      return 'Password must contain at least 1 uppercase letter (A-Z).';
    }

    if (!/[a-z]/.test(formData.password)) {
      return 'Password must contain at least 1 lowercase letter (a-z).';
    }

    if (!/[0-9]/.test(formData.password)) {
      return 'Password must contain at least 1 digit (0-9).';
    }

    if (!/[^a-zA-Z0-9]/.test(formData.password)) {
      return 'Password must contain at least 1 special character (e.g. @, #, $, %).';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    const result = signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      studentId: formData.studentId || `2026STU${Math.floor(1000 + Math.random() * 9000)}`,
      phone: formData.phone || '+91 98765 43210',
      department: formData.department
    });

    if (result.success) {
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate(redirectPath);
      }, 700);
    } else {
      setError(result.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <main className="auth-page">
      <div className="app-container">
        <div className="auth-card-wrapper">
          <div className="auth-card" style={{ maxWidth: '480px' }}>
            <div className="auth-header">
              <div className="auth-icon-badge">
                <UserPlus size={24} />
              </div>
              <h1 className="auth-title">Campus Sign Up</h1>
              <p className="auth-subtitle">
                Create a student account stored in local storage to report items and search the network.
              </p>
            </div>

            {error && (
              <div className="auth-error-banner" role="alert">
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div 
                className="auth-error-banner" 
                style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}
                role="status"
              >
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="name" className="form-label required">
                  Full Name
                </label>
                <div className="input-with-icon">
                  <User className="input-leading-icon" size={16} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Gmail Address */}
              <div className="form-group">
                <label htmlFor="email" className="form-label required">
                  Gmail Address
                </label>
                <div className="input-with-icon">
                  <Mail className="input-leading-icon" size={16} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Student ID & Department */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label htmlFor="studentId" className="form-label">
                    Student ID
                  </label>
                  <div className="input-with-icon">
                    <IdCard className="input-leading-icon" size={16} />
                    <input
                      type="text"
                      id="studentId"
                      name="studentId"
                      placeholder="e.g. 2026CS101"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="department" className="form-label">
                    Department
                  </label>
                  <div className="input-with-icon">
                    <Building2 className="input-leading-icon" size={16} />
                    <input
                      type="text"
                      id="department"
                      name="department"
                      placeholder="e.g. CSE / ECE"
                      value={formData.department}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Contact Phone
                </label>
                <div className="input-with-icon">
                  <Phone className="input-leading-icon" size={16} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label required">
                  Password
                </label>
                <div className="input-with-icon">
                  <Lock className="input-leading-icon" size={16} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Min 8 chars, 1 Upper, 1 Special"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label required">
                  Confirm Password
                </label>
                <div className="input-with-icon">
                  <Lock className="input-leading-icon" size={16} />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-auth-submit" style={{ marginTop: '0.5rem' }}>
                <UserPlus size={16} />
                <span>Create Campus Account</span>
              </button>

              <div className="auth-footer-prompt" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                Already registered?{' '}
                <Link 
                  to="/signin" 
                  state={{ from: redirectPath }} 
                  style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}
                >
                  Sign In here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
