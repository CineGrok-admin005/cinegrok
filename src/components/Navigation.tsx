/**
 * Navigation Component
 * 
 * Clean, minimalist navigation inspired by best UX practices
 * Features CineGrok branding and subtle theme integration
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-content">
          {/* CineGrok Logo */}
          <Link href="/" className="logo">
            <img src="/logo.svg" alt="CineGrok" className="logo-icon" />
            <span className="logo-text">CineGrok</span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="search-form desktop-only">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>

          {/* Desktop Nav Links */}
          <div className="nav-actions desktop-only">
            <Link href="/browse" className="nav-btn">Browse</Link>
            <Link href="/pricing" className="nav-btn">Pricing</Link>
            <Link href="/about" className="nav-btn">About</Link>

            {user ? (
              <>
                <Link href="/dashboard" className="nav-btn">Dashboard</Link>
                <Link href="/profile-builder" className="nav-btn nav-btn-primary">Edit Profile</Link>
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
                placeholder="Search..."
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
            <Link href="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/profile-builder" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                  Edit Profile
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
      </div>

      <style jsx>{`
        .navigation {
          background: #ffffff;
          border-bottom: 1px solid #f0f0f0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          gap: 2rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .logo:hover {
          opacity: 0.8;
        }

        .logo-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
        }

        .logo-text {
          display: none;
          letter-spacing: -0.02em;
        }

        @media (min-width: 640px) {
          .logo-text {
            display: inline;
          }
        }

        .search-form {
          display: flex;
          flex: 1;
          max-width: 480px;
          position: relative;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: #999;
          pointer-events: none;
        }

        .search-input {
          flex: 1;
          padding: 0.625rem 1rem 0.625rem 2.75rem;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 0.875rem;
          background: #fafafa;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3A7BD5;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.1);
        }

        .search-input::placeholder {
          color: #999;
        }

        .nav-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .nav-btn {
          padding: 0.5rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.2s;
          color: #666;
          background: transparent;
          font-family: inherit;
        }

        .nav-btn:hover {
          color: #1a1a1a;
          background: #f5f5f5;
        }

        .nav-btn-primary {
          background: #3A7BD5;
          color: white;
        }

        .nav-btn-primary:hover {
          background: #2a5fa8;
          color: white;
        }

        .menu-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem 0;
          border-top: 1px solid #f0f0f0;
        }

        .mobile-link {
          padding: 0.75rem 1rem;
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9375rem;
          border-radius: 6px;
          transition: background 0.2s;
          display: block;
          font-family: inherit;
        }

        .mobile-link:hover {
          background: #f5f5f5;
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
