/**
 * Homepage - CineGrok
 * 
 * Features:
 * - Hero section with search
 * - Featured filmmakers grid with tier/role visualization
 * - Browse by role categories
 * - Mobile-first responsive design
 * 
 * Performance: Server-side rendering with caching
 */

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import FilmmakerCard from '@/components/FilmmakerCard';
import AboutSection from '@/components/AboutSection';
import { supabase } from '@/lib/supabase';
import { Filmmaker } from '@/lib/api';
import './homepage.css';

// Revalidate every 5 minutes
export const revalidate = 300;

async function getFeaturedFilmmakers(): Promise<Filmmaker[]> {
  const { data, error } = await supabase
    .from('filmmakers')
    .select('*')
    .not('ai_generated_bio', 'is', null)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching filmmakers:', error);
    return [];
  }

  return data || [];
}

export default async function HomePage() {
  const filmmakers = await getFeaturedFilmmakers();

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

      {/* About CineGrok */}
      <AboutSection />

      {/* Browse by Role */}
      <section className="browse-section">
        <div className="container">
          <h2 className="text-center mb-lg">Browse by Role</h2>

          <div className="role-grid">
            <Link href="/browse?role=director" className="role-card director">
              <span className="role-icon">🎬</span>
              <span className="role-name">Directors</span>
            </Link>

            <Link href="/browse?role=cinematographer" className="role-card cinematographer">
              <span className="role-icon">📹</span>
              <span className="role-name">Cinematographers</span>
            </Link>

            <Link href="/browse?role=editor" className="role-card editor">
              <span className="role-icon">✂️</span>
              <span className="role-name">Editors</span>
            </Link>

            <Link href="/browse?role=writer" className="role-card writer">
              <span className="role-icon">✍️</span>
              <span className="role-name">Writers</span>
            </Link>

            <Link href="/browse?role=producer" className="role-card producer">
              <span className="role-icon">🎭</span>
              <span className="role-name">Producers</span>
            </Link>

            <Link href="/browse?role=actor" className="role-card actor">
              <span className="role-icon">🎪</span>
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
    </div>
  );
}
