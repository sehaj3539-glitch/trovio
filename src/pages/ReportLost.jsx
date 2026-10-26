import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AlertCircle, 
  User, 
  Sparkles,
  Lock,
  LogIn,
  UserPlus,
  ArrowLeft
} from 'lucide-react';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/common/AuthModal';

/**
 * Validate and convert DD/MM/YYYY to ISO YYYY-MM-DD
 */
const parseAndValidateDate = (dateStr, fieldLabel = 'Date lost') => {
  if (!dateStr || !dateStr.trim()) {
    return { valid: false, error: `${fieldLabel} is required` };
  }

  const trimmed = dateStr.trim();
  const match = trimmed.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (!match) {
    return { valid: false, error: 'Please enter a valid date in DD/MM/YYYY format' };
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12) {
    return { valid: false, error: 'Month must be between 01 and 12' };
  }

  if (year < 1900 || year > 2100) {
    return { valid: false, error: 'Please enter a valid 4-digit year' };
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return { valid: false, error: `Day must be between 01 and ${daysInMonth} for this month` };
  }

  const enteredDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (enteredDate > today) {
    return { valid: false, error: `${fieldLabel} cannot be in the future` };
  }

  const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return { valid: true, isoDate };
};

/**
 * ReportLost Component
 * Enforces route-level authentication: logged-out users cannot access or submit the form.
 * Displays "Sign in required!" modal and preserves intended destination.
 */
export default function ReportLost() {
  const { addItem } = useItems();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(true);

  // Simple Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    preferredMethod: 'Phone / WhatsApp'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Route-level protection: If not logged in, prevent access to reporting form
  if (!user) {
    return (
      <main className="form-page" style={{ padding: '4rem 1rem' }}>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          title="Sign in required!"
          message="Please sign in or create an account before reporting a lost or found item."
          redirectPath="/report-lost"
        />

        <div className="app-container" style={{ maxWidth: '580px', margin: '0 auto' }}>
          <div className="auth-gate-card" style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div className="auth-gate-icon" style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.12)',
              color: 'var(--color-danger, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <Lock size={32} />
            </div>

            <h1 className="auth-gate-title" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Sign in required!
            </h1>
            <p className="auth-gate-desc" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Please sign in or create an account before reporting a lost or found item.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/signin" 
                state={{ from: '/report-lost' }} 
                className="btn-primary"
                style={{ padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>

              <Link 
                to="/signup" 
                state={{ from: '/report-lost' }} 
                className="btn-secondary"
                style={{ padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <UserPlus size={18} />
                <span>Sign Up</span>
              </Link>
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                <ArrowLeft size={15} />
                <span>Return to Campus Home</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Item title is required';
    if (!formData.description.trim()) newErrors.description = 'Please provide a description';

    const dateResult = parseAndValidateDate(formData.date, 'Date lost');
    if (!dateResult.valid) {
      newErrors.date = dateResult.error;
    }

    if (!formData.name.trim()) newErrors.name = 'Contact name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    const dateResult = parseAndValidateDate(formData.date, 'Date lost');

    setIsSubmitting(true);

    try {
      const newItem = await addItem({
        title: formData.title.trim(),
        itemName: formData.title.trim(),
        type: 'lost',
        status: 'Lost',
        description: formData.description.trim(),
        date: dateResult.isoDate || formData.date,
        ownerId: user ? user.id : `guest_${Date.now()}`,
        reportedBy: formData.name.trim(),
        image: '',
        contact: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || 'N/A',
          preferredMethod: formData.preferredMethod
        }
      });

      navigate(`/items/${newItem.id}`, { 
        state: { message: 'Lost item report submitted successfully to REST API!' } 
      });
    } catch (err) {
      console.error('Failed to submit lost item report:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="form-page">
      <div className="app-container">
        <div className="form-page-layout">
          {/* Main Form Container */}
          <div className="form-card">
            <div className="form-header header-lost">
              <div className="form-header-badge">
                <AlertCircle size={18} />
                <span>Lost Item Report</span>
              </div>
              <h1 className="form-title">Report a Lost Belonging</h1>
              <p className="form-subtitle">
                Provide details about your missing item so others can help identify and return it.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="report-form" noValidate>
              {/* Fieldset 1: Item Details */}
              <fieldset className="form-fieldset">
                <legend className="form-legend">
                  <AlertCircle size={16} />
                  <span>Item Details</span>
                </legend>

                {/* Item Title */}
                <div className="form-group">
                  <label htmlFor="title" className="form-label required">
                    Item Name / Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g. MacBook Pro 14-inch Space Gray"
                    value={formData.title}
                    onChange={handleChange}
                    className={`form-input ${errors.title ? 'input-error' : ''}`}
                    required
                  />
                  {errors.title && <p className="error-text">{errors.title}</p>}
                </div>

                {/* Date Lost */}
                <div className="form-group">
                  <label htmlFor="date" className="form-label required">
                    Date Lost
                  </label>
                  <input
                    type="text"
                    id="date"
                    name="date"
                    placeholder="DD/MM/YYYY"
                    value={formData.date}
                    onChange={handleChange}
                    className={`form-input ${errors.date ? 'input-error' : ''}`}
                    required
                  />
                  {errors.date && <p className="error-text">{errors.date}</p>}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description" className="form-label required">
                    Detailed Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    placeholder="Distinct marks, color, brand, serial number prefix, stickers, where you think you lost it..."
                    value={formData.description}
                    onChange={handleChange}
                    className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                    required
                  ></textarea>
                  {errors.description && <p className="error-text">{errors.description}</p>}
                </div>
              </fieldset>

              {/* Fieldset 2: Contact Information */}
              <fieldset className="form-fieldset">
                <legend className="form-legend">
                  <User size={16} />
                  <span>Reporter Contact Information</span>
                </legend>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label required">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`form-input ${errors.name ? 'input-error' : ''}`}
                      required
                    />
                    {errors.name && <p className="error-text">{errors.name}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label required">
                      Campus / Gmail Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'input-error' : ''}`}
                      required
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
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

                  <div className="form-group">
                    <label htmlFor="preferredMethod" className="form-label">
                      Preferred Contact Method
                    </label>
                    <select
                      id="preferredMethod"
                      name="preferredMethod"
                      value={formData.preferredMethod}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Phone / WhatsApp">Phone / WhatsApp</option>
                      <option value="Email">Email Only</option>
                      <option value="Campus Security Desk">Via Campus Security Desk</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Submit Buttons */}
              <div className="form-submit-row">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary btn-submit-lost"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting to REST API...' : 'Publish Lost Report'}
                </button>
              </div>
            </form>
          </div>

          {/* Tips Sidebar */}
          <aside className="form-tips-sidebar" aria-label="Reporting Tips">
            <div className="tips-card">
              <div className="tips-header">
                <Sparkles size={18} className="tips-icon" />
                <h2 className="tips-title">Quick Campus Tips</h2>
              </div>
              <ul className="tips-list">
                <li>
                  <strong>Be Specific:</strong> Mention unique identifiers like stickers, scratches, or custom wallpapers.
                </li>
                <li>
                  <strong>Check Common Spots:</strong> Did you recheck library lockers, lab tables, or canteen counters?
                </li>
                <li>
                  <strong>Privacy First:</strong> Never share sensitive PINs or passwords in public descriptions.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
