import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Trash2,
  Check,
  RotateCcw,
  MapPin,
  Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useItems } from '../../context/ItemContext';

/**
 * ItemCard Component
 * Displays an individual Lost, Found, or Resolved item card with image, category, location, and status.
 */
export default function ItemCard({ item, onResolve, onReopen, onDelete }) {
  const { user } = useAuth();
  const { resolveItem, reopenItem, deleteItem } = useItems();

  const isOwner = user && user.id === item.ownerId;
  const isResolved = item.status === 'resolved';
  const isLost = item.type === 'lost';

  const formattedDate = new Date(item.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handleQuickResolve = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Mark "${item.title}" as resolved?`)) {
      resolveItem(item.id, 'Resolved via quick dashboard action');
      if (onResolve) onResolve(item.id);
    }
  };

  const handleQuickReopen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Reopen "${item.title}" as an active search?`)) {
      reopenItem(item.id);
      if (onReopen) onReopen(item.id);
    }
  };

  const handleQuickDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove the report "${item.title}"?`)) {
      deleteItem(item.id);
      if (onDelete) onDelete(item.id);
    }
  };

  return (
    <article className={`item-card ${isResolved ? 'is-resolved' : ''} ${isLost ? 'type-lost' : 'type-found'}`}>
      {/* Top Header Strip: Badges & Category */}
      <header className="card-top-strip">
        <div className="card-badges-group">
          {isResolved ? (
            <span className="badge-pill badge-resolved">
              <Check size={12} />
              <span>{item.claimed || item.type === 'found' ? 'Claimed / Resolved' : 'Resolved'}</span>
            </span>
          ) : isLost ? (
            <span className="badge-pill badge-lost">
              <AlertCircle size={12} />
              <span>Lost / Searching</span>
            </span>
          ) : (
            <span className="badge-pill badge-found">
              <CheckCircle2 size={12} />
              <span>Found / Available to Claim</span>
            </span>
          )}
        </div>

        {item.category && (
          <span className="card-category-tag">
            <Tag size={11} />
            <span>{item.category}</span>
          </span>
        )}
      </header>

      {/* Card Body */}
      <div className="item-card-body">
        <h3 className="item-card-title">
          <Link to={`/items/${item.id}`} className="title-link">
            {item.title}
          </Link>
        </h3>

        <p className="item-card-desc">
          {item.description}
        </p>

        {/* Location & Date Meta */}
        <div className="item-meta-row">
          {item.location && (
            <span className="item-meta-item item-meta-location" title={item.location}>
              <MapPin size={13} className="meta-icon" />
              <span className="truncate-text">{item.location}</span>
            </span>
          )}
          <span className="item-meta-item item-meta-date">
            <Calendar size={13} className="meta-icon" />
            <time dateTime={item.date}>{formattedDate}</time>
          </span>
        </div>

        {/* Resolved Banner */}
        {isResolved && (
          <div className="resolved-note-banner">
            <CheckCircle2 size={14} className="resolved-icon" />
            <span>{item.resolutionNote || `Reunited on ${new Date(item.resolvedDate || item.date).toLocaleDateString('en-IN')}`}</span>
          </div>
        )}

        {/* Footer Actions */}
        <footer className="item-card-footer">
          <Link to={`/items/${item.id}`} className="btn-view-details">
            <span>View Details</span>
            <ArrowRight size={15} />
          </Link>

          {/* Owner Quick Controls */}
          {isOwner && (
            <div className="owner-card-actions">
              {!isResolved ? (
                <button 
                  onClick={handleQuickResolve} 
                  className="btn-resolve-quick"
                  title="Mark as Resolved"
                >
                  <Check size={14} />
                  <span>Resolve</span>
                </button>
              ) : (
                <button 
                  onClick={handleQuickReopen} 
                  className="btn-reopen-quick"
                  title="Reopen listing"
                >
                  <RotateCcw size={14} />
                  <span>Reopen</span>
                </button>
              )}
              <button 
                onClick={handleQuickDelete} 
                className="btn-delete-quick"
                title="Delete listing"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </footer>
      </div>
    </article>
  );
}
