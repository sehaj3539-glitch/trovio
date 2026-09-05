import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Gift, 
  ArrowLeft, 
  Check, 
  Trash2, 
  RotateCcw, 
  CheckCheck, 
  MapPin, 
  Tag, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../context/AuthContext';

/**
 * ItemDetails Component
 * Clean, text-based view of Lost and Found listings.
 * - Removed item images / placeholders.
 * - Removed Reporter and Finder contact details.
 * - Removed Share and Listening options.
 * - Direct 1-click Claim Item functionality for Found items with immediate status transition.
 */
export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemById, resolveItem, reopenItem, deleteItem, claimItem } = useItems();
  const { user } = useAuth();

  const item = getItemById(id);

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('Reunited via Trovio network');
  const [toastMessage, setToastMessage] = useState(location.state?.message || '');

  if (!item) {
    return (
      <main className="app-container not-found-wrapper">
        <div className="empty-results-card">
          <AlertCircle size={44} className="text-danger" />
          <h1 className="empty-title">Item Listing Not Found</h1>
          <p className="empty-desc">
            The requested item ID may have been deleted, resolved, or does not exist on Trovio.
          </p>
          <Link to="/directory" className="btn-primary">
            <ArrowLeft size={16} />
            <span>Return to Directory</span>
          </Link>
        </div>
      </main>
    );
  }

  const isOwner = user && user.id === item.ownerId;
  const isResolved = item.status === 'resolved';
  const isLost = item.type === 'lost';

  const formattedDate = new Date(item.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Direct 1-click claim handler for Found items
  const handleDirectClaim = () => {
    if (isResolved || item.claimed) return;
    claimItem(item.id);
    setToastMessage('Item claimed successfully!');
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  const handleConfirmResolve = (e) => {
    e.preventDefault();
    resolveItem(item.id, resolutionNote.trim());
    setShowResolveModal(false);
    setToastMessage('Item has been successfully marked as Resolved!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReopen = () => {
    if (window.confirm('Reopen this listing as an Active Search?')) {
      reopenItem(item.id);
      setToastMessage('Listing status returned to Active Search.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete "${item.title}"?`)) {
      deleteItem(item.id);
      navigate('/directory', { state: { message: 'Item listing was deleted.' } });
    }
  };

  return (
    <main className="item-details-page">
      <div className="app-container">
        {/* Navigation Breadcrumb */}
        <div className="details-top-bar">
          <button onClick={() => navigate(-1)} className="btn-back">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>

        {/* Global Toast / Confirmation Feedback */}
        {toastMessage && (
          <div className="alert-toast" role="alert">
            <CheckCheck size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Item Article */}
        <article className={`item-details-card simple-details-card ${isResolved ? 'resolved-view' : ''}`}>
          {/* Top Status Banner */}
          <header className={`status-banner ${isResolved ? 'status-banner-resolved' : (isLost ? 'status-banner-lost' : 'status-banner-found')}`}>
            <div className="banner-left">
              <span className="banner-type-badge">
                {isLost ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                <span>{isLost ? 'LOST ITEM' : 'FOUND ITEM'}</span>
              </span>

              <span className={`banner-status-badge ${isResolved ? 'badge-resolved-solid' : 'badge-active-solid'}`}>
                {isResolved 
                  ? (item.type === 'found' || item.claimed ? 'Status: CLAIMED' : 'Status: RESOLVED') 
                  : (isLost ? 'Status: LOST / SEARCHING' : 'Status: FOUND / AVAILABLE TO CLAIM')}
              </span>
            </div>

            {/* Owner Controls */}
            {isOwner && (
              <div className="banner-owner-controls">
                <span className="owner-tag">You reported this item</span>
                {!isResolved ? (
                  <button 
                    onClick={() => setShowResolveModal(true)} 
                    className="btn-banner-resolve"
                  >
                    <Check size={15} />
                    <span>Mark as Resolved</span>
                  </button>
                ) : (
                  <button onClick={handleReopen} className="btn-banner-reopen">
                    <RotateCcw size={15} />
                    <span>Reopen Listing</span>
                  </button>
                )}
                <button onClick={handleDelete} className="btn-banner-delete" title="Delete listing">
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </header>

          {/* Details Layout Grid */}
          <div className="simple-details-layout">
            <div className="details-main-pane">
              {/* Meta Pill Row */}
              <div className="category-pill-row" style={{ flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1rem' }}>
                {item.category && (
                  <span className="details-category-pill" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', border: '1px solid var(--color-primary-border)' }}>
                    <Tag size={13} />
                    <span>{item.category}</span>
                  </span>
                )}

                {item.location && (
                  <span className="details-category-pill" style={{ background: 'var(--bg-subtle)', color: 'var(--text-primary)' }}>
                    <MapPin size={13} color="var(--color-primary)" />
                    <span>{item.location}</span>
                  </span>
                )}

                <span className="details-date-pill">
                  <Calendar size={13} />
                  <time dateTime={item.date}>{formattedDate}</time>
                </span>
              </div>

              <h1 className="details-title">{item.title}</h1>

              {/* Reward Badge (Lost Items) */}
              {item.reward && (
                <div className="details-reward-strip">
                  <Gift size={18} className="reward-strip-icon" />
                  <div>
                    <span className="reward-strip-label">Offered Reward:</span>
                    <span className="reward-strip-value">{item.reward}</span>
                  </div>
                </div>
              )}

              {/* Resolution / Claimed Status Notice */}
              {isResolved && (
                <div className="resolved-celebration-box">
                  <CheckCircle2 size={24} className="resolved-check-icon" />
                  <div>
                    <h3 className="resolved-box-title">
                      {item.type === 'found' || item.claimed ? 'Item Claimed & Resolved' : 'Item Reunited & Resolved'}
                    </h3>
                    <p className="resolved-box-desc">
                      {item.resolutionNote || 'Item claimed successfully by owner.'}
                    </p>
                    {item.resolvedDate && (
                      <span className="resolved-date">Date: {item.resolvedDate}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <section className="details-desc-section">
                <h2 className="section-sub-title">Description &amp; Details</h2>
                <p className="details-desc-text">{item.description}</p>
              </section>
            </div>

            {/* Sidebar Pane */}
            <aside className="details-sidebar-pane" aria-label="Actions and Information">
              {/* Found Items: Direct Claim Action or Claimed Status */}
              {!isLost && (
                <>
                  {!isResolved && !item.claimed ? (
                    <div style={{
                      backgroundColor: 'var(--color-found-bg)',
                      border: '1px solid var(--color-found-border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                        <ShieldCheck size={22} color="var(--color-found)" />
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-found-text)', margin: 0 }}>
                          Claim This Item
                        </h3>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        Is this your missing belonging? Click below to claim it directly. This will update the item's status to Claimed and move it to Resolved.
                      </p>
                      <button 
                        onClick={handleDirectClaim} 
                        className="btn-claim-item"
                        style={{ marginTop: 0, cursor: 'pointer' }}
                      >
                        <CheckCircle2 size={18} />
                        <span>Claim Item</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: 'var(--color-resolved-bg)',
                      border: '1px solid var(--color-resolved-border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem',
                      textAlign: 'center'
                    }}>
                      <CheckCircle2 size={36} color="var(--color-resolved)" style={{ margin: '0 auto 0.5rem' }} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-resolved)', marginBottom: '0.35rem' }}>
                        Item Claimed
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                        This item has been successfully claimed and moved to the Resolved section.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Lost Items: Clean Campus Information Notice */}
              {isLost && (
                <div style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <Building2 size={20} color="var(--color-primary)" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Campus Lost Property
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                    If you have spotted or recovered this item on campus, please hand it over to Campus Security Desk or the Central Library helpdesk.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </article>

        {/* Modal: Mark as Resolved (Owner Quick Action) */}
        {showResolveModal && (
          <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-resolve-title">
            <div className="modal-card">
              <div className="modal-header">
                <div className="modal-icon-badge">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h2 id="modal-resolve-title" className="modal-title">Mark Report as Resolved</h2>
                  <p className="modal-subtitle">Update status so others know this item has been returned.</p>
                </div>
              </div>

              <form onSubmit={handleConfirmResolve} className="modal-form">
                <div className="form-group">
                  <label htmlFor="resolutionNote" className="form-label">
                    Resolution Note (Optional)
                  </label>
                  <input
                    type="text"
                    id="resolutionNote"
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="e.g. Returned by classmate, retrieved safely..."
                    className="form-input"
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={() => setShowResolveModal(false)} 
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-confirm-resolve">
                    <Check size={16} />
                    <span>Confirm Resolution</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
