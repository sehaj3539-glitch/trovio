import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getStoredItems, saveStoredItems, resetDemoData } from '../utils/storage';

const ItemContext = createContext(null);

/**
 * ItemProvider component manages all lost and found listings.
 * Synchronizes with localStorage and provides CRUD & resolution operations.
 */
export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState(() => getStoredItems());

  // Automatically sync to localStorage on state changes
  useEffect(() => {
    saveStoredItems(items);
  }, [items]);

  /**
   * Add a new lost or found item.
   */
  const addItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: `item_${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setItems((prevItems) => [newItem, ...prevItems]);
    return newItem;
  };

  /**
   * Update an existing item's fields.
   */
  const updateItem = (id, updatedFields) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item
      )
    );
  };

  /**
   * Mark an item as resolved (claimed / recovered).
   */
  const resolveItem = (id, resolutionNote = 'Marked as resolved by owner') => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'resolved',
            resolvedDate: new Date().toISOString().split('T')[0],
            resolutionNote
          };
        }
        return item;
      })
    );
  };

  /**
   * Reopen a resolved item back to active status.
   */
  const reopenItem = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'active',
            resolvedDate: null,
            resolutionNote: null
          };
        }
        return item;
      })
    );
  };

  /**
   * Delete an item listing.
   */
  const deleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  /**
   * Find item by ID.
   */
  const getItemById = (id) => {
    return items.find((item) => item.id === id);
  };

  /**
   * Directly claim a found item and mark it as resolved.
   */
  const claimItem = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'resolved',
            resolvedDate: new Date().toISOString().split('T')[0],
            resolutionNote: 'Claimed successfully by owner',
            claimed: true,
            claimPending: false
          };
        }
        return item;
      })
    );
  };

  /**
   * Reset data to initial mock seed for viva testing.
   */
  const restoreSeedData = () => {
    resetDemoData();
    setItems(getStoredItems());
  };

  /**
   * Computed live stats derived from current items.
   */
  const stats = useMemo(() => {
    const total = items.length;
    const lostCount = items.filter((i) => i.type === 'lost').length;
    const foundCount = items.filter((i) => i.type === 'found').length;
    const resolvedCount = items.filter((i) => i.status === 'resolved').length;
    const activeCount = items.filter((i) => i.status === 'active').length;
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
        addItem,
        updateItem,
        resolveItem,
        reopenItem,
        deleteItem,
        getItemById,
        claimItem,
        restoreSeedData,
        stats
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

/**
 * Custom hook for consuming item context.
 */
export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};
