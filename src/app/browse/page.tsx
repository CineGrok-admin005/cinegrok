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
import { INDIAN_STATES } from '@/lib/constants';
import Link from 'next/link';
import './browse.css';

export const metadata = {
  title: 'Browse Filmmakers - CineGrok',
  description: 'Find your creative crew. Discover emerging filmmakers, collaborators, and talent.',
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
  searchParams: Promise<{ role?: string; state?: string; collab?: string; genre?: string }>;
}) {
  const params = await searchParams;
  const filmmakers = await getAllFilmmakers();

  // Filter Logic
  const filteredFilmmakers = filmmakers.filter(f => {
    // Safety check for raw_form_data
    if (!f.raw_form_data) return false;

    // 1. Role Filter
    if (params.role) {
      const rolesData = f.raw_form_data.roles;
      let rolesStr = '';

      if (Array.isArray(rolesData)) {
        rolesStr = rolesData.join(' ').toLowerCase();
      } else if (typeof rolesData === 'string') {
        rolesStr = rolesData.toLowerCase();
      }

      const searchRole = params.role.toLowerCase();
      // Special handling for Music Director / Composer Mapping
      if (searchRole === 'music director' || searchRole === 'composer') {
        if (!rolesStr.includes('music director') && !rolesStr.includes('composer')) {
          return false;
        }
      } else {
        if (!rolesStr.includes(searchRole)) {
          return false;
        }
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

    // 3. Collab Filter
    if (params.collab === 'true') {
      const isOpen = f.raw_form_data.open_to_collab || '';
      // "Yes" or "Selective" means they are generally open
      if (isOpen !== 'Yes' && isOpen !== 'Selective') {
        return false;
      }
    }

    // 4. Genre Filter
    if (params.genre) {
      const genresData = f.raw_form_data.genres; // Array or string
      let genreStr = '';
      if (Array.isArray(genresData)) genreStr = genresData.join(' ').toLowerCase();
      else if (typeof genresData === 'string') genreStr = genresData.toLowerCase();

      if (!genreStr.includes(params.genre.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const roleFilter = params.role;
  const stateFilter = params.state;
  const collabFilter = params.collab;
  const genreFilter = params.genre;

  // Ordered by popularity/industry standard as requested
  const ALL_ROLES = [
    'Director',
    'Cinematographer',
    'Editor',
    'Writer',
    'Producer',
    'Actor',
    'Sound Designer',
    'Production Designer',
    'Music Director',
    'VFX Artist'
  ];

  const GENRES = [
    'Drama', 'Comedy', 'Thriller', 'Horror', 'Documentary',
    'Sci-Fi', 'Action', 'Romance', 'Animation'
  ];

  return (
    <div className="browse-page">
      <Navigation />

      {/* Hero Section */}
      <div className="browse-header">
        <div className="container">
          <h1>Find Your Creative Crew</h1>
          <p className="subtitle">
            Discover emerging filmmakers, collaborators, and talent.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Featured Carousel */}
        {!roleFilter && !stateFilter && !collabFilter && !genreFilter && (
          <div className="featured-section">
            <h2>Featured Filmmakers</h2>
            <FilmmakerCarousel filmmakers={filmmakers} />
          </div>
        )}

        {/* Filter Section */}
        <div className="filter-container">

          {/* Roles */}
          <div className="filter-header">
            <h3>Filter by Role</h3>
            <div className="role-filters">
              <Link href={`/browse?${new URLSearchParams({ ...(stateFilter ? { state: stateFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}), ...(genreFilter ? { genre: genreFilter } : {}) }).toString()}`} className={`filter-pill ${!roleFilter ? 'active' : ''}`}>
                All
              </Link>
              {ALL_ROLES.map(role => (
                <Link
                  key={role}
                  href={`/browse?${new URLSearchParams({ role: role.toLowerCase(), ...(stateFilter ? { state: stateFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}), ...(genreFilter ? { genre: genreFilter } : {}) }).toString()}`}
                  className={`filter-pill ${roleFilter === role.toLowerCase() ? 'active' : ''}`}
                >
                  {role === 'Music Director' ? 'Music Directors' : `${role}s`}
                </Link>
              ))}
            </div>
          </div>

          {/* Location (States) */}
          <div className="filter-header" style={{ marginTop: '1.5rem' }}>
            <h3>Filter by Location (India)</h3>

            {/* Common States (Major Hubs) */}
            <h4 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem', fontWeight: 'normal' }}>Major Film Hubs</h4>
            <div className="state-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Link href={`/browse?${new URLSearchParams({ ...(roleFilter ? { role: roleFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}), ...(genreFilter ? { genre: genreFilter } : {}) }).toString()}`} className={`filter-pill ${!stateFilter ? 'active' : ''}`}>
                Anywhere
              </Link>
              {/* Ordered alphabetically or by importance?  Keeping major list as per user request/custom */}
              {['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Delhi', 'Telangana', 'West Bengal'].map(state => (
                <Link
                  key={state}
                  href={`/browse?${new URLSearchParams({ state: state, ...(roleFilter ? { role: roleFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}), ...(genreFilter ? { genre: genreFilter } : {}) }).toString()}`}
                  className={`filter-pill ${stateFilter === state ? 'active' : ''}`}
                >
                  {state}
                </Link>
              ))}
            </div>

            {/* Other States (Collapsible) */}
            <details className="more-states-details" style={{ width: '100%', marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', color: '#3A7BD5', fontSize: '0.9rem', marginBottom: '0.5rem', userSelect: 'none', fontWeight: 500 }}>
                Show All States / Regions
              </summary>
              <div className="state-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
                {INDIAN_STATES.filter(state => !['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Delhi', 'Telangana', 'West Bengal'].includes(state)).map(state => (
                  <Link
                    key={state}
                    href={`/browse?${new URLSearchParams({ state: state, ...(roleFilter ? { role: roleFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}), ...(genreFilter ? { genre: genreFilter } : {}) }).toString()}`}
                    className={`filter-pill ${stateFilter === state ? 'active' : ''}`}
                  >
                    {state}
                  </Link>
                ))}
              </div>
            </details>
          </div>

          {/* Genre & Availability Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '1.5rem' }}>

            {/* Genre */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div className="filter-header">
                <h3>Filter by Genre</h3>
                <div className="role-filters">
                  <Link href={`/browse?${new URLSearchParams({ ...(roleFilter ? { role: roleFilter } : {}), ...(stateFilter ? { state: stateFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}) }).toString()}`} className={`filter-pill ${!genreFilter ? 'active' : ''}`}>
                    All
                  </Link>
                  {GENRES.map(genre => (
                    <Link
                      key={genre}
                      href={`/browse?${new URLSearchParams({ genre: genre.toLowerCase(), ...(roleFilter ? { role: roleFilter } : {}), ...(stateFilter ? { state: stateFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}) }).toString()}`}
                      className={`filter-pill ${genreFilter === genre.toLowerCase() ? 'active' : ''}`}
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div className="filter-header">
                <h3>Availability</h3>
                <div className="role-filters">
                  <Link
                    href={`/browse?${new URLSearchParams({ ...(roleFilter ? { role: roleFilter } : {}), ...(stateFilter ? { state: stateFilter } : {}), ...(genreFilter ? { genre: genreFilter } : {}) }).toString()}`}
                    className={`filter-pill ${!collabFilter ? 'active' : ''}`}
                  >
                    All
                  </Link>
                  <Link
                    href={`/browse?${new URLSearchParams({ collab: 'true', ...(roleFilter ? { role: roleFilter } : {}), ...(stateFilter ? { state: stateFilter } : {}), ...(genreFilter ? { genre: genreFilter } : {}) }).toString()}`}
                    className={`filter-pill ${collabFilter === 'true' ? 'active' : ''}`}
                  >
                    Open to Collaboration
                  </Link>
                </div>
              </div>
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
