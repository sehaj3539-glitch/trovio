import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  User, 
  ShieldCheck
} from 'lucide-react';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../context/AuthContext';

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
 * ReportFound Component (Simple, Category-free & Location-free)
 * Fast, clean form to report items found.
 */
export default function ReportFound() {
  const { addItem } = useItems();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    const dateResult = parseAndValidateDate(formData.date, 'Date found');

    setIsSubmitting(true);

    const newItem = addItem({
      title: formData.title.trim(),
      type: 'found',
      description: formData.description.trim(),
      date: dateResult.isoDate || formData.date,
      ownerId: user ? user.id : `guest_${Date.now()}`,
      contact: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || 'N/A',
        preferredMethod: formData.preferredMethod
      }
    });

    setTimeout(() => {
      navigate(`/items/${newItem.id}`, { 
        state: { message: 'Found item notice published successfully!' } 
      });
    }, 200);
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
              <h1 className="form-title">Report a Found Item</h1>
              <p className="form-subtitle">
                Discovered an item? Help reunite it with its owner.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="report-form" noValidate>
              {/* Fieldset 1: Item Details */}
              <fieldset className="form-fieldset">
                <legend className="form-legend">
                  <PlusCircle size={16} />
                  <span>Item Details</span>
                </legend>

                {/* Item Title */}
                <div className="form-group">
                  <label htmlFor="title" className="form-label required">
                    Item Title / Brief Name
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g. Casio Scientific Calculator or Blue Water Bottle"
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
                    Description &amp; Condition
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe general appearance, color, brand, or condition..."
                    value={formData.description}
                    onChange={handleChange}
                    className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                    required
                  />
                  {errors.description && <p className="error-text">{errors.description}</p>}
                </div>
              </fieldset>

              {/* Fieldset 2: Contact Information */}
              <fieldset className="form-fieldset">
                <legend className="form-legend">
                  <User size={16} />
                  <span>Finder's Contact Info</span>
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
                      Email Address
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

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone / WhatsApp (Optional)
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
              </fieldset>

              {/* Submit Row */}
              <div className="form-submit-row">
                <button 
                  type="button" 
                  onClick={() => navigate(-1)} 
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit-found"
                  disabled={isSubmitting}
                >
                  <PlusCircle size={18} />
                  <span>{isSubmitting ? 'Publishing Notice...' : 'Publish Found Notice'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Simple Tips Sidebar */}
          <aside className="form-sidebar" aria-label="Safe return tips">
            <div className="sidebar-card">
              <h3 className="sidebar-card-title">
                <ShieldCheck size={18} />
                <span>Return Guidelines</span>
              </h3>
              <ul className="sidebar-tips-list">
                <li>
                  <strong>Verification:</strong> Before handing over, ask the claimant to describe specific unseen details.
                </li>
                <li>
                  <strong>Direct Contact:</strong> The rightful owner can reach out via your provided email or phone.
                </li>
                <li>
                  <strong>Mark as Resolved:</strong> Once returned, remember to click <em>"Mark as Resolved"</em>.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
