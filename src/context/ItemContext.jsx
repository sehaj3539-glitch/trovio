import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getStoredItems, saveStoredItems } from '../utils/storage';

const ItemContext = createContext(null);

const API_BASE_URL = '/api/items';

/**
 * ItemProvider component manages all lost and found listings.
 * Integrates dummy REST API (/api/items) with full CRUD operations for college evaluation.
 * Uses fetch(), async/await, try/catch, useState(), and useEffect().
 * Provides loading states, error states, and retry functionality.
 */
export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState(() => getStoredItems());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Helper to normalize item schema so both legacy properties (title, type)
   * and college evaluation schema (itemName, status, reportedBy) work seamlessly.
   */
  const normalizeItem = (raw) => {
    const itemName = raw.itemName || raw.title || 'Untitled Item';
    const title = raw.title || raw.itemName || 'Untitled Item';
    const isLost = (raw.status && raw.status.toLowerCase() === 'lost') || raw.type === 'lost';
    const status = isLost ? 'Lost' : 'Found';
    const type = isLost ? 'lost' : 'found';
    const isResolved = raw.status === 'resolved' || raw.itemStatus === 'resolved' || raw.resolvedDate;

    return {
      ...raw,
      id: String(raw.id),
      itemName,
      title,
      description: raw.description || '',
      category: raw.category || 'General',
      location: raw.location || 'Campus Grounds',
      date: raw.date || new Date().toISOString().split('T')[0],
      status: isResolved ? 'resolved' : status,
      type,
      itemStatus: isResolved ? 'resolved' : 'active',
      image: '', // Pictures removed per requirement
      reportedBy: raw.reportedBy || raw.contact?.name || 'Campus Student',
      ownerId: raw.ownerId || `user_${Date.now()}`
    };
  };

  /**
   * GET /api/items — Fetch all lost and found items from the REST API.
   */
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status} (${response.statusText})`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        const normalized = data.map(normalizeItem);
        setItems(normalized);
        saveStoredItems(normalized);
      } else {
        throw new Error('Invalid data format received from API');
      }
    } catch (err) {
      console.warn('API fetch failed, falling back to local storage cache:', err.message);
      setError(`Failed to connect to Lost & Found API: ${err.message}`);
      // Fall back to cached local storage items if API is unreachable
      const fallback = getStoredItems().map(normalizeItem);
      if (fallback && fallback.length > 0) {
        setItems(fallback);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch from API on initial mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  /**
   * POST /api/items — Create a new lost or found report.
   */
  const addItem = async (itemData) => {
    const tempId = `item_${Date.now()}`;
    const payload = {
      ...itemData,
      id: tempId,
      itemName: itemData.itemName || itemData.title,
      title: itemData.title || itemData.itemName,
      status: itemData.status || (itemData.type === 'found' ? 'Found' : 'Lost'),
      type: itemData.type || (itemData.status?.toLowerCase() === 'found' ? 'found' : 'lost'),
      itemStatus: 'active',
      image: '',
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let savedItem = payload;
      if (response.ok) {
        savedItem = await response.json();
      }

      const normalized = normalizeItem(savedItem);
      setItems((prev) => [normalized, ...prev]);
      saveStoredItems([normalized, ...items]);
      return normalized;
    } catch (err) {
      console.error('Error posting item to API, saving locally:', err);
      const normalized = normalizeItem(payload);
      setItems((prev) => [normalized, ...prev]);
      saveStoredItems([normalized, ...items]);
      return normalized;
    }
  };

  /**
   * PUT or PATCH /api/items/:id — Update an item's details or status.
   */
  const updateItem = async (id, updatedFields) => {
    try {
      await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {
      console.warn('API patch failed, updating local state:', err);
    }

    setItems((prevItems) => {
      const updated = prevItems.map((item) =>
        String(item.id) === String(id) ? normalizeItem({ ...item, ...updatedFields }) : item
      );
      saveStoredItems(updated);
      return updated;
    });
  };

  /**
   * Mark an item as resolved (claimed / recovered).
   */
  const resolveItem = async (id, resolutionNote = 'Marked as resolved by owner') => {
    const fields = {
      status: 'resolved',
      itemStatus: 'resolved',
      resolvedDate: new Date().toISOString().split('T')[0],
      resolutionNote
    };
    await updateItem(id, fields);
  };

  /**
   * Reopen a resolved item back to active status.
   */
  const reopenItem = async (id) => {
    const target = items.find(i => String(i.id) === String(id));
    const originalStatus = target?.type === 'found' ? 'Found' : 'Lost';
    const fields = {
      status: originalStatus,
      itemStatus: 'active',
      resolvedDate: null,
      resolutionNote: null
    };
    await updateItem(id, fields);
  };

  /**
   * DELETE /api/items/:id — Delete an item report.
   */
  const deleteItem = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('API delete failed, removing locally:', err);
    }

    setItems((prevItems) => {
      const updated = prevItems.filter((item) => String(item.id) !== String(id));
      saveStoredItems(updated);
      return updated;
    });
  };

  /**
   * GET by ID helper.
   */
  const getItemById = (id) => {
    return items.find((item) => String(item.id) === String(id));
  };

  /**
   * Direct 1-click Claim Item for Found items.
   */
  const claimItem = async (id) => {
    const fields = {
      status: 'resolved',
      itemStatus: 'resolved',
      resolvedDate: new Date().toISOString().split('T')[0],
      resolutionNote: 'Claimed successfully by owner',
      claimed: true,
      claimPending: false
    };
    await updateItem(id, fields);
  };

  /**
   * Live statistics derived from items.
   */
  const stats = useMemo(() => {
    const total = items.length;
    const lostCount = items.filter((i) => i.type === 'lost' && i.status !== 'resolved').length;
    const foundCount = items.filter((i) => i.type === 'found' && i.status !== 'resolved').length;
    const resolvedCount = items.filter((i) => i.status === 'resolved' || i.itemStatus === 'resolved').length;
    const activeCount = total - resolvedCount;
    const successRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

    return {
      total,
      lostCount,
      foundCount,
      resolvedCount,
      activeCount,
      successRate
    };
  }, [items]);

  return (
    <ItemContext.Provider
      value={{
        items,
        loading,
        error,
        fetchItems,
        addItem,
        updateItem,
        resolveItem,
        reopenItem,
        deleteItem,
        getItemById,
        claimItem,
        stats
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};
