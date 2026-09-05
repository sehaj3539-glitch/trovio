import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  Info 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useItems } from '../../context/ItemContext';

/**
 * Semantic Header & Navbar component for Trovio SPA.
 * Manages responsive menu state and authentication controls.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useItems();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Calculate reports authored by the currently logged-in user
  const userReportsCount = user 
    ? items.filter(item => item.ownerId === user.id).length 
    : 0;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="site-header">
      <div className="app-container header-container">
        {/* Brand Identity */}
        <Link to="/" className="brand-logo" onClick={closeMenus}>
          <div className="brand-icon-wrapper">
            <Compass className="brand-icon" size={24} />
          </div>
          <span className="brand-name">Trovio</span>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/directory" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Search size={16} />
            <span>Browse Directory</span>
          </NavLink>
          <NavLink 
            to="/my-reports" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <FileText size={16} />
            <span>My Reports</span>
            {user && userReportsCount > 0 && (
              <span className="badge-count">{userReportsCount}</span>
            )}
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Info size={16} />
            <span>About</span>
          </NavLink>
        </nav>

        {/* User Account Controls */}
        <div className="header-actions">
          {user ? (
            <div className="user-profile-menu">
              {/* User Dropdown Trigger */}
              <div className="user-badge-container">
                <button 
                  className="user-badge-btn" 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                  aria-label="User profile menu"
                >
                  <span className="user-avatar-initials">
                    {user.initials || user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                  <span className="user-short-name">{user.name.split(' ')[0]}</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="user-dropdown-card">
                    <div className="dropdown-user-header">
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                      <span className="dropdown-id">ID: {user.studentId}</span>
                    </div>

                    <div className="dropdown-divider"></div>

                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/signin" className="btn-primary btn-sm">
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav className="mobile-nav" aria-label="Mobile Navigation">
          <NavLink to="/" className="mobile-nav-link" onClick={closeMenus}>
            Home
          </NavLink>
          <NavLink to="/directory" className="mobile-nav-link" onClick={closeMenus}>
            Browse Directory
          </NavLink>
          <NavLink to="/my-reports" className="mobile-nav-link" onClick={closeMenus}>
            My Reports {user && userReportsCount > 0 ? `(${userReportsCount})` : ''}
          </NavLink>
          <NavLink to="/about" className="mobile-nav-link" onClick={closeMenus}>
            About
          </NavLink>
          {user ? (
            <button className="mobile-nav-link text-danger" onClick={handleLogout}>
              Sign Out ({user.name})
            </button>
          ) : (
            <div className="mobile-auth-row">
              <Link to="/signin" className="btn-primary" onClick={closeMenus} style={{ width: '100%', textAlign: 'center' }}>
                Sign In
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
