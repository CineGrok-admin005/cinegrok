'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/api';
import CineGrokLogo from '@/components/CineGrokLogo';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

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
      router.push(`/browse?search=${encodeURIComponent(searchQuery)}`);
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
            placeholder="Search filmmakers, roles, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>

        {/* Desktop Nav Links */}
        <div className="nav-actions desktop-only">
          <Link href="/browse" className="nav-btn">Browse</Link>
          <Link href="/pricing" className="nav-btn">Pricing</Link>
          <Link href="/help" className="nav-btn">Help</Link>
          <Link href="/about" className="nav-btn">About</Link>

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
              placeholder="Search filmmakers, roles, or locations..."
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
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
          position: sticky;
          top: 0;
          z-index: 100;
          /* Minimal shadow for editorial feel */
          box-shadow: 0 1px 0 rgba(0,0,0,0.02);
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2rem; /* Added horizontal padding for relaxed spacing */
          gap: 2rem;
        }

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
          border-radius: 4px; /* Sharper */
          font-size: 0.9rem;
          background: transparent;
          transition: all 0.2s;
          font-family: var(--font-body);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--text-primary);
          background: #fff;
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
          padding: 0;
          border: none;
          cursor: pointer;
        }

        .nav-btn:hover {
          color: var(--text-primary);
        }

        /* "Primary" CTA is now just a text link, perhaps bold or underlined */
        .nav-btn-primary {
          color: var(--text-primary);
          font-weight: 600;
          border-bottom: 1px solid var(--text-primary);
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
          padding: 0.5rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 1rem 1.5rem;
          background: var(--bg-primary);
          border-top: 1px solid var(--border-light);
        }

        .mobile-link {
          padding: 1rem 0;
          min-height: 48px;
          display: flex;
          align-items: center;
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
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
        }
      `}</style>
    </nav>
  );
}
