import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  X, 
  PackageSearch
} from 'lucide-react';
import { useItems } from '../context/ItemContext';
import ItemCard from '../components/common/ItemCard';

/**
 * ItemsDirectory Component
 * Simple, streamlined browsing page.
 * Keeps only 4 filter buttons: All, Lost, Found, and Resolved.
 */
export default function ItemsDirectory() {
  const { items } = useItems();
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Filter items based on the active button and search keyword
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Filter button match
      if (activeFilter === 'lost') {
        if (item.type !== 'lost' || item.status === 'resolved') return false;
      } else if (activeFilter === 'found') {
        if (item.type !== 'found' || item.status === 'resolved') return false;
      } else if (activeFilter === 'resolved') {
        if (item.status !== 'resolved') return false;
      }

      // 2. Keyword search matching title or description
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        return Boolean(matchesTitle || matchesDesc);
      }

      return true;
    });
  }, [items, activeFilter, searchTerm]);

  return (
    <main className="directory-page">
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
            {/* Search Input Box */}
            <div className="directory-search-wrapper">
              <Search className="search-input-icon" size={18} />
              <input
                type="search"
                placeholder="Search by keyword, brand, description..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="directory-search-input"
                aria-label="Search items"
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

        {/* Results Summary Bar */}
        <div className="results-summary-bar">
          <p className="results-text">
            Showing <strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Item Cards Grid or Empty State */}
        {filteredItems.length > 0 ? (
          <div className="items-grid">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty-results-card">
            <div className="empty-icon-wrap">
              <PackageSearch size={36} />
            </div>
            <h2 className="empty-title">No matching reports found</h2>
            <p className="empty-desc">
              Try adjusting your search keywords or switch to the <strong>All</strong> tab.
            </p>
            <div className="empty-actions">
              <Link to="/report-lost" className="btn-primary">
                Report a Lost Item
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
