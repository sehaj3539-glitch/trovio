import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Phone, Mail } from 'lucide-react';

/**
 * Footer Component
 * Semantic <footer> element with brand identity, navigation links, and campus contact info.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="app-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <Compass className="footer-brand-icon" size={26} />
              <span className="footer-brand-name">Trovio</span>
            </div>
            <p className="footer-desc">
              The centralized Lost &amp; Found network. Fast, transparent, and simple.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <nav className="footer-col" aria-label="Footer Navigation">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/directory">Browse Directory</Link></li>
              <li><Link to="/my-reports">My Reports</Link></li>
              <li><Link to="/about">About Trovio</Link></li>
            </ul>
          </nav>

          {/* Support & Helper */}
          <div className="footer-col">
            <h4 className="footer-heading">Support &amp; Help</h4>
            <div className="contact-item">
              <Phone size={15} />
              <span>Helpline: +91 98765 43210</span>
            </div>
            <div className="contact-item">
              <Mail size={15} />
              <span>support@trovio.in</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Trovio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
