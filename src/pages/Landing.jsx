import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  AlertCircle, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { useItems } from '../context/ItemContext';
import ItemCard from '../components/common/ItemCard';
import Stats from '../components/common/Stats';

/**
 * Landing Page Component
 * Serves as the primary public storefront for the Trovio Campus network.
 * Displays separate sections for Lost Items, Found Items, and Recently Resolved Items.
 */
export default function Landing() {
  const { items } = useItems();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Handle hero quick search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/directory');
    }
  };

  // Separate items into 3 distinct categories for the Home page
  const lostItems = items.filter(i => i.type === 'lost' && i.status !== 'resolved').slice(0, 4);
  const foundItems = items.filter(i => i.type === 'found' && i.status !== 'resolved').slice(0, 4);
  const resolvedItems = items.filter(i => i.status === 'resolved').slice(0, 4);

  return (
    <main className="landing-page">
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

            {/* Quick Search Bar */}
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

            {/* Main Action CTAs */}
            <div className="hero-action-buttons">
              <Link to="/report-lost" className="btn-cta btn-lost">
                <AlertCircle size={20} />
                <div className="btn-cta-text">
                  <span className="btn-cta-title">Report Lost</span>
                  <span className="btn-cta-sub">File a missing item report</span>
                </div>
              </Link>

              <Link to="/report-found" className="btn-cta btn-found">
                <PlusCircle size={20} />
                <div className="btn-cta-text">
                  <span className="btn-cta-title">Report Found</span>
                  <span className="btn-cta-sub">Help reunite an item</span>
                </div>
              </Link>
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
