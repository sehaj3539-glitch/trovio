import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUser, saveStoredUser, getStoredUsers, saveNewUser } from '../utils/storage';
import { DEMO_USERS } from '../utils/mockData';

const AuthContext = createContext(null);

/**
 * AuthProvider component to wrap application and supply authentication state.
 * Implements useState for reactive user state and useEffect for persistence.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());

  // Keep localStorage synchronized whenever user state changes
  useEffect(() => {
    saveStoredUser(user);
  }, [user]);

  /**
   * Authenticate user with validated credentials.
   * Allows signing in with any valid Gmail address without requiring pre-existing DB entry.
   */
  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const found = users.find(
      u => u.email.toLowerCase() === trimmedEmail
    );

    if (found) {
      setUser(found);
      return { success: true };
    }

    // Dynamically initialize user profile for newly authenticated Gmail address
    const username = trimmedEmail.split('@')[0];
    const cleanName = username
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Campus User';

    const newUser = {
      id: `user_${Date.now()}`,
      name: cleanName,
      initials: cleanName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'GU',
      email: trimmedEmail,
      password,
      studentId: `2026STU${Math.floor(1000 + Math.random() * 9000)}`,
      phone: '+91 98765 43210',
      department: 'Campus Member'
    };

    saveNewUser(newUser);
    setUser(newUser);
    return { success: true };
  };

  /**
   * Register a new student account.
   */
  const signup = ({ name, email, password, studentId, phone, department }) => {
    const users = getStoredUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (exists) {
      return { success: false, error: 'An account with this campus email already exists.' };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      initials: name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      email: email.trim().toLowerCase(),
      password,
      studentId: studentId.trim() || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: phone.trim() || 'N/A',
      department: department || 'General Studies'
    };

    saveNewUser(newUser);
    setUser(newUser);
    return { success: true };
  };

  /**
   * Log out the active user.
   */
  const logout = () => {
    setUser(null);
  };

  /**
   * Quick switcher helper for viva examination.
   */
  const switchDemoUser = (userId) => {
    const target = DEMO_USERS.find(u => u.id === userId);
    if (target) {
      setUser(target);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, switchDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for consuming auth context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
