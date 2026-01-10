'use client';

/**
 * Homepage Content - Client Component
 * Handles the styled-jsx styling and rendering
 */

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import FilmmakerCard from '@/components/FilmmakerCard';
import { Filmmaker } from '@/lib/api';
import { Clapperboard, Camera, Scissors, PenTool, Users, Drama } from 'lucide-react';

interface HomePageContentProps {
  filmmakers: Filmmaker[];
}

export default function HomePageContent({ filmmakers }: HomePageContentProps) {
  return (
    <div className="homepage">
      <Navigation />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Discover Emerging Filmmakers
          </h1>
          <p className="hero-subtitle">
            Explore AI-curated profiles of talented directors, cinematographers, editors, and more
          </p>

          {/* Search handled by Navigation component */}
          <div className="hero-cta">
            <Link href="/browse" className="btn btn-primary btn-large">
              Browse All Filmmakers
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Filmmakers */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Filmmakers</h2>
            <p className="text-muted">
              Recently added profiles with AI-generated bios
            </p>
          </div>

          {filmmakers.length > 0 ? (
            <div className="filmmakers-grid">
              {filmmakers.map((filmmaker) => (
                <FilmmakerCard key={filmmaker.id} filmmaker={filmmaker} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No filmmakers yet. Be the first to submit your profile!</p>
            </div>
          )}

          {filmmakers.length >= 8 && (
            <div className="section-footer">
              <Link href="/browse" className="btn btn-secondary">
                View All Filmmakers →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Browse by Role */}
      <section className="browse-section">
        <div className="container">
          <h2 className="text-center mb-lg">Browse by Role</h2>

          <div className="role-grid">
            <Link href="/browse?role=director" className="role-card director">
              <span className="role-icon"><Clapperboard size={40} strokeWidth={1.5} /></span>
              <span className="role-name">Directors</span>
            </Link>

            <Link href="/browse?role=cinematographer" className="role-card cinematographer">
              <span className="role-icon"><Camera size={40} strokeWidth={1.5} /></span>
              <span className="role-name">Cinematographers</span>
            </Link>

            <Link href="/browse?role=editor" className="role-card editor">
              <span className="role-icon"><Scissors size={40} strokeWidth={1.5} /></span>
              <span className="role-name">Editors</span>
            </Link>

            <Link href="/browse?role=writer" className="role-card writer">
              <span className="role-icon"><PenTool size={40} strokeWidth={1.5} /></span>
              <span className="role-name">Writers</span>
            </Link>

            <Link href="/browse?role=producer" className="role-card producer">
              <span className="role-icon"><Users size={40} strokeWidth={1.5} /></span>
              <span className="role-name">Producers</span>
            </Link>

            <Link href="/browse?role=actor" className="role-card actor">
              <span className="role-icon"><Drama size={40} strokeWidth={1.5} /></span>
              <span className="role-name">Actors</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="text-center text-muted">
            © 2024 CineGrok. Empowering filmmakers with AI.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .homepage {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta {
          margin-top: 2rem;
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        .featured-section {
          padding: 4rem 0;
          background: var(--bg-secondary);
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .filmmakers-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .filmmakers-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .filmmakers-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-muted);
        }

        .section-footer {
          text-align: center;
          margin-top: 3rem;
        }

        .browse-section {
          padding: 4rem 0;
        }

        .role-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .role-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .role-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }

        .role-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem 1rem;
          background: var(--bg-primary);
          border: 2px solid var(--border);
          border-radius: var(--border-radius);
          text-decoration: none;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .role-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .role-card.director {
          border-color: #8B5CF6;
        }

        .role-card.director:hover {
          background: #F5F3FF;
        }

        .role-card.cinematographer {
          border-color: #3B82F6;
        }

        .role-card.cinematographer:hover {
          background: #EFF6FF;
        }

        .role-card.editor {
          border-color: #10B981;
        }

        .role-card.editor:hover {
          background: #ECFDF5;
        }

        .role-card.writer {
          border-color: #F59E0B;
        }

        .role-card.writer:hover {
          background: #FFFBEB;
        }

        .role-card.producer {
          border-color: #EF4444;
        }

        .role-card.producer:hover {
          background: #FEF2F2;
        }

        .role-card.actor {
          border-color: #EC4899;
        }

        .role-card.actor:hover {
          background: #FDF2F8;
        }

        .role-icon {
          font-size: 3rem;
        }

        .role-name {
          font-weight: 600;
          font-size: 1rem;
        }

        .footer {
          margin-top: auto;
          padding: 2rem 0;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border);
        }

        @media (max-width: 767px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .role-icon {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
