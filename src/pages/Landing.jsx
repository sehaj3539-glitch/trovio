import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  AlertCircle, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/common/ItemCard';
import Stats from '../components/common/Stats';
import AuthModal from '../components/common/AuthModal';

/**
 * Landing Page Component
 * Serves as the primary public storefront for the Trovio Campus network.
 * Enforces authentication gates for reporting and searching per requirements.
 * Integrates with mock REST API (/api/items).
 */
export default function Landing() {
  const { items, loading, error, fetchItems } = useItems();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Auth gate modal state
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    title: 'Sign in required!',
    message: '',
    redirectPath: '/'
  });

  const closeAuthModal = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  };

  // Handle hero search submit with auth check
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    const targetUrl = query ? `/directory?search=${encodeURIComponent(query)}` : '/directory';

    if (!user) {
      setAuthModal({
        isOpen: true,
        title: 'Sign in required!',
        message: 'Please sign in or create an account to search for lost and found items.',
        redirectPath: targetUrl
      });
      return;
    }

    navigate(targetUrl);
  };

  // Handle Report Lost click with auth check
  const handleReportLostClick = (e) => {
    e.preventDefault();
    if (!user) {
      setAuthModal({
        isOpen: true,
        title: 'Sign in required!',
        message: 'Please sign in or create an account before reporting a lost or found item.',
        redirectPath: '/report-lost'
      });
      return;
    }
    navigate('/report-lost');
  };

  // Handle Report Found click with auth check
  const handleReportFoundClick = (e) => {
    e.preventDefault();
    if (!user) {
      setAuthModal({
        isOpen: true,
        title: 'Sign in required!',
        message: 'Please sign in or create an account before reporting a lost or found item.',
        redirectPath: '/report-found'
      });
      return;
    }
    navigate('/report-found');
  };

  // Separate items into 3 distinct categories for the Home page
  const lostItems = items.filter(i => (i.type === 'lost' || i.status === 'Lost') && i.status !== 'resolved' && i.itemStatus !== 'resolved').slice(0, 4);
  const foundItems = items.filter(i => (i.type === 'found' || i.status === 'Found') && i.status !== 'resolved' && i.itemStatus !== 'resolved').slice(0, 4);
  const resolvedItems = items.filter(i => i.status === 'resolved' || i.itemStatus === 'resolved').slice(0, 4);

  return (
    <main className="landing-page">
      {/* Reusable Authentication Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        title={authModal.title}
        message={authModal.message}
        redirectPath={authModal.redirectPath}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="app-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} className="badge-sparkle" />
              <span>Official Campus Lost &amp; Found Network</span>
            </div>

            <h1 className="hero-title">
              Lost It on Campus? <br />
              <span className="gradient-text">Let's Bring It Home.</span>
            </h1>

            <p className="hero-subtitle">
              Trovio connects university students, faculty, and campus security in real time. 
              Search reported items, post what you've found, or report your missing belongings.
            </p>

            {/* Quick Search Bar (Requires Auth on Submit) */}
            <form onSubmit={handleSearchSubmit} className="hero-search-form" role="search">
              <div className="hero-search-input-wrap">
                <Search className="hero-search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by item name (e.g. MacBook, Hydro Flask, ID Card)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="hero-search-input"
                  aria-label="Search lost and found items"
                />
              </div>
              <button type="submit" className="btn-hero-search">
                Search Items
              </button>
            </form>

            {/* Main Action CTAs (Require Auth on Click) */}
            <div className="hero-action-buttons">
              <button 
                type="button"
                onClick={handleReportLostClick} 
                className="btn-cta btn-lost"
                style={{ textAlign: 'left', border: 'none', cursor: 'pointer' }}
              >
                <AlertCircle size={20} />
                <div className="btn-cta-text">
                  <span className="btn-cta-title">Report Lost</span>
                  <span className="btn-cta-sub">File a missing item report</span>
                </div>
              </button>

              <button 
                type="button"
                onClick={handleReportFoundClick} 
                className="btn-cta btn-found"
                style={{ textAlign: 'left', border: 'none', cursor: 'pointer' }}
              >
                <PlusCircle size={20} />
                <div className="btn-cta-text">
                  <span className="btn-cta-title">Report Found</span>
                  <span className="btn-cta-sub">Help reunite an item</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Campus Stats Section */}
      <section className="stats-wrapper-section">
        <div className="app-container">
          <Stats />
        </div>
      </section>

      {/* REST API Status Display: Loading & Error States */}
      {loading && (
        <section className="app-container">
          <div className="api-loading-state">
            <div className="api-spinner"></div>
            <p className="api-loading-text">Loading campus items from REST API...</p>
          </div>
        </section>
      )}

      {error && (
        <section className="app-container">
          <div className="api-error-card">
            <AlertCircle size={32} color="#e11d48" />
            <h3 className="api-error-title">Unable to Connect to REST API</h3>
            <p className="api-error-desc">{error}</p>
            <button type="button" onClick={fetchItems} className="api-retry-btn">
              <RotateCcw size={16} />
              <span>Retry Fetch</span>
            </button>
          </div>
        </section>
      )}

      {/* 1. Lost Items Section */}
      <section className="home-category-section lost-items-section">
        <div className="app-container">
          <div className="section-header-row">
            <div>
              <div className="section-title-wrap">
                <span className="section-category-badge badge-cat-lost">
                  <AlertCircle size={13} />
                  <span>Searching</span>
                </span>
              </div>
              <h2 className="section-heading">Lost Items</h2>
              <p className="section-subheading">Belongings currently reported missing on campus • Lost / Searching</p>
            </div>
          </div>

          <div className="items-grid">
            {lostItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Found Items Section */}
      <section className="home-category-section found-items-section">
        <div className="app-container">
          <div className="section-header-row">
            <div>
              <div className="section-title-wrap">
                <span className="section-category-badge badge-cat-found">
                  <CheckCircle2 size={13} />
                  <span>Available to Claim</span>
                </span>
              </div>
              <h2 className="section-heading">Found Items</h2>
              <p className="section-subheading">Items retrieved across campus waiting to be claimed • Found / Available to Claim</p>
            </div>
          </div>

          <div className="items-grid">
            {foundItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Recently Resolved Items Section */}
      <section className="home-category-section resolved-items-section">
        <div className="app-container">
          <div className="section-header-row">
            <div>
              <div className="section-title-wrap">
                <span className="section-category-badge badge-cat-resolved">
                  <CheckCircle2 size={13} />
                  <span>Success Stories</span>
                </span>
              </div>
              <h2 className="section-heading">Recently Resolved</h2>
              <p className="section-subheading">Belongings successfully reunited with their rightful owners • Resolved</p>
            </div>
          </div>

          <div className="items-grid">
            {resolvedItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* How Trovio Works Section */}
      <section className="how-it-works-section">
        <div className="app-container">
          <div className="text-center section-intro">
            <h2 className="section-heading">How Trovio Works</h2>
            <p className="section-subheading">Three simple steps to recover or return lost belongings on campus</p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon-box step-icon-1">
                <AlertCircle size={28} />
              </div>
              <h3 className="step-title">1. Report in 60 Seconds</h3>
              <p className="step-desc">
                Submit an item report with category, description, and preferred contact info.
              </p>
            </article>

            <article className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon-box step-icon-2">
                <Search size={28} />
              </div>
              <h3 className="step-title">2. Smart Search</h3>
              <p className="step-desc">
                Browse our real-time directory filtered by category and status to locate matching items.
              </p>
            </article>

            <article className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon-box step-icon-3">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="step-title">3. Safely Reconnect</h3>
              <p className="step-desc">
                Verify ownership with the finder or poster, retrieve your item, and mark the listing as Resolved!
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
