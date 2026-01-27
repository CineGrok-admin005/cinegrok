'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/api';
import CineGrokLogo from '@/components/CineGrokLogo';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path ? 'active' : '';

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user } = await getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      }
    };

    checkUser();

    // Polling as a simpler, provider-agnostic alternative to WebSockets/Auth Change
    const interval = setInterval(checkUser, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery)}#browse-results`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navigation">
      <div className="container nav-content">
        {/* Logo */}
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          <CineGrokLogo />
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearch} className="search-form desktop-only">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search by name, film, role, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>

        {/* Desktop Nav Links */}
        <div className="nav-actions desktop-only">
          <Link href="/browse" className={`nav-btn ${isActive('/browse')}`}>Browse</Link>
          <Link href="/pricing" className={`nav-btn ${isActive('/pricing')}`}>Pricing</Link>
          <Link href="/help" className={`nav-btn ${isActive('/help')}`}>Help</Link>
          <Link href="/about" className={`nav-btn ${isActive('/about')}`}>About</Link>

          {user ? (
            <>
              <Link href="/dashboard" className="nav-btn">Dashboard</Link>
              <button onClick={handleLogout} className="nav-btn" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/profile-builder" className="nav-btn nav-btn-primary">Create Profile</Link>
              <Link href="/auth/login" className="nav-btn">Login</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="menu-button mobile-only"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearch} className="search-form">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search by name, film, role, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
          <Link href="/browse" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
            Browse
          </Link>
          <Link href="/pricing" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
            Pricing
          </Link>
          <Link href="/help" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
            Help
          </Link>
          <Link href="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="mobile-link" style={{ textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', width: '100%' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/profile-builder" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                Create Profile
              </Link>
              <Link href="/auth/login" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .navigation {
          background: rgba(252, 252, 250, 0.85); /* Semi-transparent */
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ... (rest of search/logo styles remain similar, focusing on mobile menu) ... */

        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          opacity: 1;
          transition: opacity 0.2s;
        }

        .logo:hover {
          opacity: 0.7;
        }

        .search-form {
          display: flex;
          flex: 1;
          max-width: 400px;
          position: relative;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          flex: 1;
          padding: 0.6rem 1rem 0.6rem 2.5rem;
          border: 1px solid var(--border);
          border-radius: 99px; /* Rounded pill for modern feel */
          font-size: 0.9rem;
          background: rgba(255, 255, 255, 0.5);
          transition: all 0.2s;
          font-family: var(--font-body);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--text-primary);
          background: #fff;
          box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .nav-actions {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-btn {
          font-size: 0.95rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
          color: var(--text-secondary);
          background: transparent;
          font-family: var(--font-body);
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }

        .nav-btn:hover {
          color: var(--text-primary);
          background: rgba(0,0,0,0.03);
        }

        /* "Primary" CTA */
        .nav-btn-primary {
          color: var(--text-primary);
          font-weight: 600;
          border-bottom: 2px solid var(--text-primary);
          border-radius: 0;
          background: transparent;
          padding-bottom: 2px;
        }

        .nav-btn-primary:hover {
          background: transparent;
          color: var(--text-primary);
          opacity: 0.7;
        }

        .menu-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.75rem; /* Larger touch target */
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }
        
        .menu-button:active {
            background: rgba(0,0,0,0.05);
        }

        .mobile-menu {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem 1.5rem;
          padding-top: 4rem; /* More breathing room from top */
          padding-bottom: env(safe-area-inset-bottom, 20px); /* Safe Area */
          background: rgba(252, 252, 250, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid var(--border-light);
          position: fixed; /* Fixed to cover screen reliably */
          width: 100%;
          height: 100vh; /* Full screen menu feel */
          left: 0;
          top: 0;
          justify-content: flex-start; /* Ensure items cascade from top */
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          animation: slideDown 0.3s ease-out forwards;
          z-index: 99; /* Just below nav bar if needed, or above content */
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .mobile-link {
          padding: 1.25rem 0; /* Taller touch targets (approx 60px) */
          display: flex;
          align-items: center;
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 500;
          font-size: 1.1rem; /* Larger text for mobile */
          border-bottom: 1px solid var(--border-light);
          font-family: var(--font-body);
        }

        .mobile-link:last-child {
            border-bottom: none;
        }

        .desktop-only {
          display: none;
        }

        .mobile-only {
          display: flex;
        }

        @media (min-width: 768px) {
          .desktop-only {
            display: flex;
          }

          .mobile-only {
            display: none;
          }
          
          .mobile-menu {
            display: none; /* Ensure no leak on resize */
          }
        }
      `}</style>
    </nav>
  );
}
