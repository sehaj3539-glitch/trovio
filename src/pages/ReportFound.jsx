import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  User, 
  ShieldCheck,
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
const parseAndValidateDate = (dateStr, fieldLabel = 'Date found') => {
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
 * ReportFound Component
 * Enforces route-level authentication: logged-out users cannot access or submit the form.
 * Displays "Sign in required!" modal and preserves intended destination.
 */
export default function ReportFound() {
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
    preferredMethod: 'Email / Phone'
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
          redirectPath="/report-found"
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
              background: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--color-found, #059669)',
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
                state={{ from: '/report-found' }} 
                className="btn-primary"
                style={{ padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>

              <Link 
                to="/signup" 
                state={{ from: '/report-found' }} 
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
    if (!formData.description.trim()) newErrors.description = 'Please describe the found item';

    const dateResult = parseAndValidateDate(formData.date, 'Date found');
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

    const dateResult = parseAndValidateDate(formData.date, 'Date found');

    setIsSubmitting(true);

    try {
      const newItem = await addItem({
        title: formData.title.trim(),
        itemName: formData.title.trim(),
        type: 'found',
        status: 'Found',
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
        state: { message: 'Found item report published successfully to REST API!' } 
      });
    } catch (err) {
      console.error('Failed to submit found item report:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="form-page">
      <div className="app-container">
        <div className="form-page-layout">
          {/* Main Form Container */}
          <div className="form-card">
            <div className="form-header header-found">
              <div className="form-header-badge">
                <PlusCircle size={18} />
                <span>Found Item Report</span>
              </div>
              <h1 className="form-title">Report a Found Belonging</h1>
              <p className="form-subtitle">
                Help a fellow campus student or colleague recover their missing property safely.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="report-form" noValidate>
              {/* Fieldset 1: Item Details */}
              <fieldset className="form-fieldset">
                <legend className="form-legend">
                  <PlusCircle size={16} />
                  <span>Found Item Details</span>
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
                    placeholder="e.g. Blue Casio Scientific Calculator"
                    value={formData.title}
                    onChange={handleChange}
                    className={`form-input ${errors.title ? 'input-error' : ''}`}
                    required
                  />
                  {errors.title && <p className="error-text">{errors.title}</p>}
                </div>

                {/* Date Found */}
                <div className="form-group">
                  <label htmlFor="date" className="form-label required">
                    Date Found
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
                    placeholder="Describe brand, color, location found (e.g. Library 2nd floor), but hold back private details for verification..."
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
                  <span>Finder Contact Information</span>
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
                      <option value="Email / Phone">Email / Phone</option>
                      <option value="Campus Security Desk">Turn In to Security Desk</option>
                      <option value="In-person Meeting">In-person on Campus</option>
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
                  className="btn-primary btn-submit-found"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting to REST API...' : 'Publish Found Report'}
                </button>
              </div>
            </form>
          </div>

          {/* Safety Sidebar */}
          <aside className="form-tips-sidebar" aria-label="Finder Guidelines">
            <div className="tips-card">
              <div className="tips-header">
                <ShieldCheck size={18} className="tips-icon" />
                <h2 className="tips-title">Finder Guidelines</h2>
              </div>
              <ul className="tips-list">
                <li>
                  <strong>Safe Verification:</strong> Ask the claimant to describe something specific (lock screen, markings) before handing it over.
                </li>
                <li>
                  <strong>Meet in Public:</strong> Hand over items in busy campus areas like the Canteen or Security Office.
                </li>
                <li>
                  <strong>Campus Security:</strong> If high-value (laptop, wallet), consider depositing it with Campus Security.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
