/**
 * Browse Page
 * 
 * Browse all filmmakers with filtering and sorting
 */

import Navigation from '@/components/Navigation';
import FilmmakerCard from '@/components/FilmmakerCard';
import FilmmakerCarousel from '@/components/FilmmakerCarousel';
import { supabase } from '@/lib/supabase';
import { Filmmaker } from '@/lib/api';
import Link from 'next/link';
import './browse.css';

export const metadata = {
  title: 'Browse Filmmakers - CineGrok',
  description: 'Discover talented filmmakers from around the world. Filter by role, experience, and style.',
};

// Revalidate every 5 minutes
export const revalidate = 300;

async function getAllFilmmakers(): Promise<Filmmaker[]> {
  const { data, error } = await supabase
    .from('filmmakers')
    .select('*')
    .not('ai_generated_bio', 'is', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching filmmakers:', error);
    return [];
  }

  return data || [];
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; state?: string }>;
}) {
  const params = await searchParams;
  const filmmakers = await getAllFilmmakers();

  // Filter Logic
  const filteredFilmmakers = filmmakers.filter(f => {
    // Safety check for raw_form_data
    if (!f.raw_form_data) return false;

    // 1. Role Filter
    if (params.role) {
      if (!f.raw_form_data.roles?.toLowerCase().includes(params.role.toLowerCase())) {
        return false;
      }
    }

    // 2. State Filter
    if (params.state) {
      const currentState = f.raw_form_data.current_state || '';
      const nativeState = f.raw_form_data.native_state || '';
      // Check both current and native state for maximum discovery
      if (!currentState.includes(params.state) && !nativeState.includes(params.state)) {
        return false;
      }
    }

    return true;
  });

  const roleFilter = params.role;
  const stateFilter = params.state;

  // Get unique states for filter dropdown
  // We use a predefined list from constants, but we mark active ones?
  // For simplicity MVP, we just show the full Indian States list in UI

  return (
    <div className="browse-page">
      <Navigation />

      <div className="container">
        {/* Hero Section */}
        <div className="browse-header">
          <h1>Browse Filmmakers</h1>
          <p className="subtitle">
            Discover emerging filmmakers, collaborators, and talent.
          </p>
        </div>

        {/* Featured Carousel */}
        {!roleFilter && !stateFilter && (
          <div className="featured-section">
            <h2>Featured Filmmakers</h2>
            <FilmmakerCarousel filmmakers={filmmakers} />
          </div>
        )}

        {/* Filter Section */}
        <div className="filter-container">
          <div className="filter-header">
            <h3>Filter by Role</h3>
            <div className="role-filters">
              <Link href={`/browse?${new URLSearchParams({ ...(stateFilter ? { state: stateFilter } : {}) }).toString()}`} className={`filter-pill ${!roleFilter ? 'active' : ''}`}>
                All
              </Link>
              {['Director', 'Cinematographer', 'Editor', 'Writer', 'Producer', 'Actor'].map(role => (
                <Link
                  key={role}
                  href={`/browse?${new URLSearchParams({ role: role.toLowerCase(), ...(stateFilter ? { state: stateFilter } : {}) }).toString()}`}
                  className={`filter-pill ${roleFilter === role.toLowerCase() ? 'active' : ''}`}
                >
                  {role}s
                </Link>
              ))}
            </div>
          </div>

          <div className="filter-header" style={{ marginTop: '1.5rem' }}>
            <h3>Filter by Location (India)</h3>
            <div className="state-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Link href={`/browse?${new URLSearchParams({ ...(roleFilter ? { role: roleFilter } : {}) }).toString()}`} className={`filter-pill ${!stateFilter ? 'active' : ''}`}>
                Anywhere
              </Link>
              {/* Show only popular states initially to avoid clutter, or a subset */}
              {['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Delhi', 'Telangana', 'West Bengal'].map(state => (
                <Link
                  key={state}
                  href={`/browse?${new URLSearchParams({ state: state, ...(roleFilter ? { role: roleFilter } : {}) }).toString()}`}
                  className={`filter-pill ${stateFilter === state ? 'active' : ''}`}
                >
                  {state}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="results-count" style={{ margin: '1rem 0', color: '#666' }}>
          Showing {filteredFilmmakers.length} result{filteredFilmmakers.length !== 1 ? 's' : ''}
        </div>

        {/* Filmmakers Grid */}
        {filteredFilmmakers.length > 0 ? (
          <div className="filmmakers-grid">
            {filteredFilmmakers.map((filmmaker) => (
              <FilmmakerCard key={filmmaker.id} filmmaker={filmmaker} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No filmmakers found matching your criteria.</p>
            <Link href="/browse" className="btn btn-secondary">
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
