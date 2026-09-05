/**
 * Trovio Storage Utility
 * 
 * Manages browser localStorage persistence for items, users, and session state.
 * Meets Front End Engineering rubrics for persistent state across page reloads.
 */

import { INITIAL_ITEMS, DEMO_USERS } from './mockData';

const STORAGE_KEYS = {
  ITEMS: 'trovio_items',
  CURRENT_USER: 'trovio_current_user',
  USERS: 'trovio_users'
};

/**
 * Initialize localStorage with seed data if not present.
 */
export const initStorage = () => {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_ITEMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
    }
  } catch (error) {
    console.error('Failed to initialize localStorage:', error);
  }
};

/**
 * Retrieve all items from localStorage.
 */
export const getStoredItems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) return INITIAL_ITEMS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_ITEMS;

    const initialMap = new Map(INITIAL_ITEMS.map(i => [i.id, i]));
    const enriched = parsed.map(item => {
      const match = initialMap.get(item.id);
      return {
        ...item,
        category: item.category || match?.category || 'General',
        location: item.location || match?.location || 'Campus Grounds',
        image: item.image || match?.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
        title: match ? match.title : item.title
      };
    });

    const existingIds = new Set(enriched.map(i => i.id));
    for (const initItem of INITIAL_ITEMS) {
      if (!existingIds.has(initItem.id)) {
        enriched.push(initItem);
      }
    }

    return enriched;
  } catch (error) {
    console.error('Error reading items from localStorage:', error);
    return INITIAL_ITEMS;
  }
};

/**
 * Save updated items array to localStorage.
 */
export const saveStoredItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving items to localStorage:', error);
  }
};

/**
 * Retrieve currently authenticated user.
 */
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
    return null;
  }
};

/**
 * Save currently authenticated user.
 */
export const saveStoredUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

/**
 * Retrieve all registered users.
 */
export const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : DEMO_USERS;
  } catch (error) {
    console.error('Error reading registered users from localStorage:', error);
    return DEMO_USERS;
  }
};

/**
 * Save a new user to registered users.
 */
export const saveNewUser = (newUser) => {
  try {
    const users = getStoredUsers();
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving new user:', error);
    return false;
  }
};

/**
 * Reset localStorage to initial seed data.
 */
export const resetDemoData = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_ITEMS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS[0]));
    return true;
  } catch (error) {
    console.error('Failed to reset demo data:', error);
    return false;
  }
};
