import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, X, ShieldAlert } from 'lucide-react';

/**
 * AuthModal Component
 * Accessible, responsive centered modal prompting users to sign in or create an account.
 * Supports custom messages, navigation with preserved state, keyboard accessibility (Escape),
 * focus management, and subtle backdrop animation.
 */
export default function AuthModal({
  isOpen,
  onClose,
  title = 'Sign in required!',
  message = 'Please sign in or create an account before reporting a lost or found item.',
  redirectPath = '/'
}) {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Close on Escape key and prevent background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSignIn = () => {
    onClose();
    navigate('/signin', { state: { from: redirectPath } });
  };

  const handleSignUp = () => {
    onClose();
    navigate('/signup', { state: { from: redirectPath } });
  };

  return (
    <div 
      className="auth-modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-desc"
    >
      <div 
        className="auth-modal-dialog" 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (×) */}
        <button
          ref={closeBtnRef}
          type="button"
          className="auth-modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Header Icon */}
        <div className="auth-modal-icon-badge">
          <ShieldAlert size={28} className="auth-modal-icon" />
        </div>

        {/* Modal Title & Message */}
        <h2 id="auth-modal-title" className="auth-modal-title">
          {title}
        </h2>
        <p id="auth-modal-desc" className="auth-modal-message">
          {message}
        </p>

        {/* Action Buttons: Sign In and Sign Up */}
        <div className="auth-modal-actions">
          <button 
            type="button" 
            onClick={handleSignIn} 
            className="btn-primary auth-modal-btn auth-modal-btn-signin"
          >
            <LogIn size={17} />
            <span>Sign In</span>
          </button>
          
          <button 
            type="button" 
            onClick={handleSignUp} 
            className="btn-secondary auth-modal-btn auth-modal-btn-signup"
          >
            <UserPlus size={17} />
            <span>Sign Up</span>
          </button>
        </div>
      </div>
    </div>
  );
}
