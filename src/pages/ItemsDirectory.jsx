import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  PackageSearch,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/common/ItemCard';
import AuthModal from '../components/common/AuthModal';

/**
 * ItemsDirectory Component
 * Displays items fetched from REST API with loading, error, and retry states.
 * Allows filtering by Lost / Found / Resolved / All and searching by Name or Location.
 * Protects Report actions with AuthModal when logged out.
 */
export default function ItemsDirectory() {
  const { items, loading, error, fetchItems } = useItems();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [authModal, setAuthModal] = useState({
    isOpen: false,
    title: 'Sign in required!',
    message: 'Please sign in or create an account before reporting a lost or found item.',
    redirectPath: '/report-lost'
  });

  // URL-driven search and filter state
  const searchTerm = searchParams.get('search') || '';
  const activeFilter = searchParams.get('filter') || 'all';

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const newParams = {};
    if (value) newParams.search = value;
    if (activeFilter !== 'all') newParams.filter = activeFilter;
    setSearchParams(newParams, { replace: true });
  };

  const handleClearSearch = () => {
    const newParams = {};
    if (activeFilter !== 'all') newParams.filter = activeFilter;
    setSearchParams(newParams);
  };

  const handleFilterChange = (filter) => {
    const newParams = {};
    if (searchTerm) newParams.search = searchTerm;
    if (filter !== 'all') newParams.filter = filter;
    setSearchParams(newParams);
  };

  // Protect report click in empty state
  const handleEmptyReportClick = () => {
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

  // Filter items based on active status filter and search query (name or location)
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Filter button match
      const isLost = item.type === 'lost' || item.status === 'Lost';
      const isFound = item.type === 'found' || item.status === 'Found';
      const isResolved = item.status === 'resolved' || item.itemStatus === 'resolved';

      if (activeFilter === 'lost') {
        if (!isLost || isResolved) return false;
      } else if (activeFilter === 'found') {
        if (!isFound || isResolved) return false;
      } else if (activeFilter === 'resolved') {
        if (!isResolved) return false;
      }

      // 2. Search match by Name or Location or Description
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const nameField = (item.itemName || item.title || '').toLowerCase();
        const locationField = (item.location || '').toLowerCase();
        const descField = (item.description || '').toLowerCase();
        const categoryField = (item.category || '').toLowerCase();

        const matchesName = nameField.includes(query);
        const matchesLocation = locationField.includes(query);
        const matchesDesc = descField.includes(query);
        const matchesCategory = categoryField.includes(query);

        return Boolean(matchesName || matchesLocation || matchesDesc || matchesCategory);
      }

      return true;
    });
  }, [items, activeFilter, searchTerm]);

  return (
    <main className="directory-page">
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
        title={authModal.title}
        message={authModal.message}
        redirectPath={authModal.redirectPath}
      />

      <div className="app-container">
        {/* Page Header */}
        <header className="page-header">
          <div>
            <h1 className="page-title">Browse Directory</h1>
            <p className="page-subtitle">
              Search and browse reported lost items, found belongings, and verified returns across campus.
            </p>
          </div>
        </header>

        {/* Directory Controls Card: Search Bar + 4 Filter Buttons */}
        <section className="directory-controls-card simple-controls" aria-label="Directory Filters">
          <div className="controls-primary-row">
            {/* Search Input Box (Search by item name or location) */}
            <div className="directory-search-wrapper">
              <Search className="search-input-icon" size={18} />
              <input
                type="search"
                placeholder="Search by name, location (e.g. Library, Canteen)..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="directory-search-input"
                aria-label="Search items by name or location"
              />
              {searchTerm && (
                <button 
                  onClick={handleClearSearch} 
                  className="search-clear-btn"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Exactly 4 Filter Buttons: All, Lost, Found, Resolved */}
            <div className="type-tabs-group filter-four-buttons" role="tablist" aria-label="Item Filter">
              <button
                role="tab"
                aria-selected={activeFilter === 'all'}
                className={`type-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All
              </button>

              <button
                role="tab"
                aria-selected={activeFilter === 'lost'}
                className={`type-tab-btn type-tab-lost ${activeFilter === 'lost' ? 'active' : ''}`}
                onClick={() => handleFilterChange('lost')}
              >
                Lost
              </button>

              <button
                role="tab"
                aria-selected={activeFilter === 'found'}
                className={`type-tab-btn type-tab-found ${activeFilter === 'found' ? 'active' : ''}`}
                onClick={() => handleFilterChange('found')}
              >
                Found
              </button>

              <button
                role="tab"
                aria-selected={activeFilter === 'resolved'}
                className={`type-tab-btn type-tab-resolved ${activeFilter === 'resolved' ? 'active' : ''}`}
                onClick={() => handleFilterChange('resolved')}
              >
                Resolved
              </button>
            </div>
          </div>
        </section>

        {/* REST API Status Feedback */}
        {loading && (
          <div className="api-loading-state">
            <div className="api-spinner"></div>
            <p className="api-loading-text">Fetching campus lost &amp; found items from REST API...</p>
          </div>
        )}

        {error && (
          <div className="api-error-card">
            <AlertCircle size={32} color="#e11d48" />
            <h3 className="api-error-title">API Request Failed</h3>
            <p className="api-error-desc">{error}</p>
            <button type="button" onClick={fetchItems} className="api-retry-btn">
              <RotateCcw size={16} />
              <span>Retry Fetching Items</span>
            </button>
          </div>
        )}

        {/* Results Summary Bar */}
        {!loading && (
          <div className="results-summary-bar">
            <p className="results-text">
              Showing <strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? 'item' : 'items'}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Item Cards Grid or Empty State */}
        {!loading && filteredItems.length > 0 ? (
          <div className="items-grid">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : !loading ? (
          <div className="empty-results-card">
            <div className="empty-icon-wrap">
              <PackageSearch size={36} />
            </div>
            <h2 className="empty-title">No matching reports found</h2>
            <p className="empty-desc">
              Try adjusting your search keywords, location, or switch to the <strong>All</strong> tab.
            </p>
            <div className="empty-actions">
              <button 
                type="button" 
                onClick={handleEmptyReportClick} 
                className="btn-primary"
                style={{ cursor: 'pointer' }}
              >
                Report a Lost Item
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
