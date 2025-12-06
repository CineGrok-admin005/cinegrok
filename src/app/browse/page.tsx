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
  searchParams: Promise<{ role?: string; state?: string; collab?: string }>;
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

      if (!rolesStr.includes(params.role.toLowerCase())) {
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

    // 3. Collab Filter
    if (params.collab === 'true') {
      const isOpen = f.raw_form_data.open_to_collab || '';
      // "Yes" or "Selective" means they are generally open
      if (isOpen !== 'Yes' && isOpen !== 'Selective') {
        return false;
      }
    }

    return true;
  });

  const roleFilter = params.role;
  const stateFilter = params.state;
  const collabFilter = params.collab;

  const ALL_ROLES = [
    'Director', 'Cinematographer', 'Editor', 'Writer', 'Producer',
    'Actor', 'Sound Designer', 'Production Designer', 'Composer', 'VFX Artist'
  ];

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
        {!roleFilter && !stateFilter && !collabFilter && (
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
              <Link href={`/browse?${new URLSearchParams({ ...(stateFilter ? { state: stateFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}) }).toString()}`} className={`filter-pill ${!roleFilter ? 'active' : ''}`}>
                All
              </Link>
              {ALL_ROLES.map(role => (
                <Link
                  key={role}
                  href={`/browse?${new URLSearchParams({ role: role.toLowerCase(), ...(stateFilter ? { state: stateFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}) }).toString()}`}
                  className={`filter-pill ${roleFilter === role.toLowerCase() ? 'active' : ''}`}
                >
                  {role}s
                </Link>
              ))}
            </div>
          </div>

          {/* Location (States) */}
          <div className="filter-header" style={{ marginTop: '1.5rem' }}>
            <h3>Filter by Location (India)</h3>

            {/* Common States (Always Visible) */}
            <div className="state-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Link href={`/browse?${new URLSearchParams({ ...(roleFilter ? { role: roleFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}) }).toString()}`} className={`filter-pill ${!stateFilter ? 'active' : ''}`}>
                Anywhere
              </Link>
              {['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Delhi', 'Telangana', 'West Bengal'].map(state => (
                <Link
                  key={state}
                  href={`/browse?${new URLSearchParams({ state: state, ...(roleFilter ? { role: roleFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}) }).toString()}`}
                  className={`filter-pill ${stateFilter === state ? 'active' : ''}`}
                >
                  {state}
                </Link>
              ))}
            </div>

            {/* Other States (Collapsible Details) */}
            <details className="more-states-details" style={{ width: '100%', marginTop: '0.5rem' }}>
              <summary style={{ cursor: 'pointer', color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem', userSelect: 'none' }}>
                Show All States/Regions
              </summary>
              <div className="state-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem', padding: '0.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
                {INDIAN_STATES.filter(state => !['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Delhi', 'Telangana', 'West Bengal'].includes(state)).map(state => (
                  <Link
                    key={state}
                    href={`/browse?${new URLSearchParams({ state: state, ...(roleFilter ? { role: roleFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}) }).toString()}`}
                    className={`filter-pill ${stateFilter === state ? 'active' : ''}`}
                  >
                    {state}
                  </Link>
                ))}
              </div>
            </details>
          </div>

          {/* Availability */}
          <div className="filter-header" style={{ marginTop: '1.5rem' }}>
            <h3>Availability</h3>
            <div className="role-filters">
              <Link
                href={`/browse?${new URLSearchParams({ ...(roleFilter ? { role: roleFilter } : {}), ...(stateFilter ? { state: stateFilter } : {}) }).toString()}`}
                className={`filter-pill ${!collabFilter ? 'active' : ''}`}
              >
                All
              </Link>
              <Link
                href={`/browse?${new URLSearchParams({ collab: 'true', ...(roleFilter ? { role: roleFilter } : {}), ...(stateFilter ? { state: stateFilter } : {}) }).toString()}`}
                className={`filter-pill ${collabFilter === 'true' ? 'active' : ''}`}
              >
                Open to Collaboration
              </Link>
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
