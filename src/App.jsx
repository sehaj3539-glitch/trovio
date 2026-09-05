import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ItemProvider } from './context/ItemContext';
import { initStorage } from './utils/storage';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Landing from './pages/Landing';
import ItemsDirectory from './pages/ItemsDirectory';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import ItemDetails from './pages/ItemDetails';
import SignIn from './pages/SignIn';
import About from './pages/About';
import MyReports from './pages/MyReports';

import './App.css';

/**
 * ScrollToTop Helper
 * Ensures window resets to top when navigating between client routes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * 404 Not Found Page Component
 */
function NotFound() {
  return (
    <main className="app-container not-found-wrapper" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        The page you are looking for does not exist on the Trovio network.
      </p>
      <Link to="/" className="btn-primary">
        Return to Home
      </Link>
    </main>
  );
}

/**
 * Main Trovio Application Root
 * Sets up Context Providers, Client-Side Routing, and Global Layout.
 */
export default function App() {
  // Initialize sample campus seed data in localStorage on initial mount
  useEffect(() => {
    initStorage();
  }, []);

  return (
    <AuthProvider>
      <ItemProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/directory" element={<ItemsDirectory />} />
            <Route path="/report-lost" element={<ReportLost />} />
            <Route path="/report-found" element={<ReportFound />} />
            <Route path="/items/:id" element={<ItemDetails />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/about" element={<About />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ItemProvider>
    </AuthProvider>
  );
}
