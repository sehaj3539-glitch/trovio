import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  AlertCircle, 
  PlusCircle, 
  User, 
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemContext';
import ItemCard from '../components/common/ItemCard';

/**
 * MyReports Dashboard Component
 * Allows authenticated students to monitor and manage their posted lost & found reports.
 * Supports marking reports as resolved, reopening, or deleting with state persistence.
 */
export default function MyReports() {
  const { user } = useAuth();
  const { items, resolveItem, reopenItem, deleteItem } = useItems();
  const location = useLocation();

  const [toastMessage, setToastMessage] = useState(location.state?.message || '');

  // If user is not logged in, show prompt to sign in
  if (!user) {
    return (
      <main className="dashboard-page">
        <div className="app-container">
          <div className="auth-gate-card">
            <div className="auth-gate-icon">
              <User size={36} />
            </div>
            <h1 className="auth-gate-title">Sign In Required</h1>
            <p className="auth-gate-desc">
              Please sign in with your campus credentials to view and manage your reported items.
            </p>
            <div className="auth-gate-actions">
              <Link to="/signin" className="btn-primary">
                Sign In to Account
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Filter items owned by the active user
  const userItems = items.filter(item => item.ownerId === user.id);

  // Compute metrics for the logged-in student
  const activeCount = userItems.filter(i => i.status === 'active').length;
  const resolvedCount = userItems.filter(i => i.status === 'resolved').length;

  const handleResolve = (id) => {
    resolveItem(id, 'Resolved directly from My Reports dashboard');
    setToastMessage('Item report status updated to Resolved!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleReopen = (id) => {
    reopenItem(id);
    setToastMessage('Item report status restored to Active Search.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDelete = (id) => {
    deleteItem(id);
    setToastMessage('Item report has been deleted.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <main className="dashboard-page">
      <div className="app-container">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="alert-toast" role="alert">
            <CheckCheck size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* User Profile Summary Header */}
        <section className="dashboard-profile-card">
          <div className="profile-main-info">
            <div className="dashboard-avatar-initials">
              {user.initials || user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="profile-text">
              <div className="profile-name-row">
                <h1 className="profile-name">{user.name}</h1>
                <span className="profile-badge">Student Reporter</span>
              </div>
              <p className="profile-meta">
                <span>{user.email}</span> • <span>ID: {user.studentId}</span> • <span>{user.department}</span>
              </p>
            </div>
          </div>

          {/* User Specific Metrics */}
          <div className="profile-metrics-row">
            <div className="metric-chip">
              <span className="metric-num">{userItems.length}</span>
              <span className="metric-text">Total Reports</span>
            </div>
            <div className="metric-chip metric-active">
              <span className="metric-num">{activeCount}</span>
              <span className="metric-text">Active Searches</span>
            </div>
            <div className="metric-chip metric-resolved">
              <span className="metric-num">{resolvedCount}</span>
              <span className="metric-text">Reunited / Resolved</span>
            </div>
          </div>
        </section>

        {/* Action Header: Unified My Reports Section */}
        <div className="dashboard-controls-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 className="section-heading" style={{ margin: 0, fontSize: '1.6rem' }}>My Reports</h2>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              background: 'var(--color-primary-light)',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {userItems.length} {userItems.length === 1 ? 'Report' : 'Reports'}
            </span>
          </div>
        </div>

        {/* Listings Display: Shows all Lost and Found reports together */}
        {userItems.length > 0 ? (
          <section className="dashboard-items-grid" aria-label="My reported items list">
            {userItems.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onResolve={handleResolve}
                onReopen={handleReopen}
                onDelete={handleDelete}
              />
            ))}
          </section>
        ) : (
          <div className="empty-dashboard-card">
            <div className="empty-dash-icon">
              <FileText size={36} />
            </div>
            <h2 className="empty-dash-title">No Reports Found</h2>
            <p className="empty-dash-desc">
              You haven't posted any lost or found items yet on Trovio.
            </p>
            <div className="empty-dash-actions">
              <Link to="/report-lost" className="btn-secondary">
                <AlertCircle size={16} />
                <span>Report a Lost Item</span>
              </Link>
              <Link to="/report-found" className="btn-primary">
                <PlusCircle size={16} />
                <span>Report a Found Item</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
