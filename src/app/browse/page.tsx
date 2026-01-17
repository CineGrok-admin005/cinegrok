/**
 * Browse Page
 * 
 * Browse all filmmakers with filtering and sorting.
 * Uses SupabaseDBService for data fetching (Three Box Rule compliant).
 * 
 * @module app/browse
 */

import Navigation from '@/components/Navigation';
import FilmmakerCard from '@/components/FilmmakerCard';
import FilmmakerCarousel from '@/components/FilmmakerCarousel';
import { dbService } from '@/services';
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

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; state?: string; collab?: string; genre?: string; page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = 12;

  // Parse filters from URL params
  const roleFilter = params.role;
  const stateFilter = params.state;
  const collabFilter = params.collab;
  const genreFilter = params.genre;
  const searchFilter = params.search;

  // Fetch data from DB via service layer (Three Box Rule)
  const { data: filmmakers, count: totalCount } = await dbService.getFilmmakersWithFilters({
    page,
    limit,
    search: searchFilter,
    role: roleFilter,
    state: stateFilter,
    genre: genreFilter,
    collab: collabFilter === 'true'
  });

  const displayFilmmakers = filmmakers;
  const displayCount = totalCount;

  // Calculate pages based on DB count
  const totalPages = Math.ceil(displayCount / limit);



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
    'VFX Artist',
    'Assistant Director',
    'Colorist',
    'Costume Designer',
    'Makeup Artist',
    'Hair Stylist',
    'Gaffer',
    'Key Grip',
    'Boom Operator',
    'Script Supervisor',
    'Location Manager',
    'Stunt Coordinator',
    'Choreographer',
    'Casting Director',
    'Set Decorator',
    'Prop Master',
    'DIT'
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
        {!searchFilter && !roleFilter && !stateFilter && !collabFilter && !genreFilter && (
          <div className="featured-section">
            <h2>Featured Filmmakers</h2>
            <FilmmakerCarousel filmmakers={filmmakers} />
          </div>
        )}

        {/* Filter Section */}
        <div className="filter-container">
          <div className="filters-grid">
            {/* Row 1: Roles (Full Width) */}
            <div className="filter-group full-width">
              <h3>Filter by Role</h3>
              <div className="role-filters">
                <Link href={`/browse?${new URLSearchParams({ ...(stateFilter ? { state: stateFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}), ...(genreFilter ? { genre: genreFilter } : {}) }).toString()}`} className={`filter-pill ${!roleFilter ? 'active' : ''}`}>
                  All
                </Link>
                {/* Primary Roles */}
                {ALL_ROLES.slice(0, 10).map(role => (
                  <Link
                    key={role}
                    href={`/browse?${new URLSearchParams({ role: role.toLowerCase(), ...(stateFilter ? { state: stateFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}), ...(genreFilter ? { genre: genreFilter } : {}) }).toString()}`}
                    className={`filter-pill ${roleFilter === role.toLowerCase() ? 'active' : ''}`}
                  >
                    {role === 'Music Director' ? 'Music Directors' : `${role}s`}
                  </Link>
                ))}
              </div>

              {/* Extended Roles Toggle */}
              <details className="more-states-details" style={{ marginTop: '1rem' }}>
                <summary>Show More Roles</summary>
                <div className="role-filters expanded-states">
                  {ALL_ROLES.slice(10).map(role => (
                    <Link
                      key={role}
                      href={`/browse?${new URLSearchParams({ role: role.toLowerCase(), ...(stateFilter ? { state: stateFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}), ...(genreFilter ? { genre: genreFilter } : {}) }).toString()}`}
                      className={`filter-pill ${roleFilter === role.toLowerCase() ? 'active' : ''}`}
                    >
                      {role}s
                    </Link>
                  ))}
                </div>
              </details>
            </div>

            {/* Row 2: Location (Full Width) */}
            <div className="filter-group full-width">
              <h3>Filter by Location (India)</h3>

              <div className="subsection-header">Major Film Hubs</div>
              <div className="state-filters">
                <Link href={`/browse?${new URLSearchParams({ ...(roleFilter ? { role: roleFilter } : {}), ...(collabFilter ? { collab: collabFilter } : {}), ...(genreFilter ? { genre: genreFilter } : {}) }).toString()}`} className={`filter-pill ${!stateFilter || stateFilter === '' ? 'active' : ''}`}>
                  Anywhere
                </Link>
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

              <details className="more-states-details">
                <summary>Show All States / Regions</summary>
                <div className="state-filters expanded-states">
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

            {/* Row 3: Genre and Availability (Side by Side) */}
            <div className="filter-row-split">
              {/* Genre */}
              <div className="filter-group">
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

              {/* Availability */}
              <div className="filter-group">
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

        <div id="browse-results" className="results-count" style={{ margin: '1rem 0', color: '#666', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            {displayCount < 50 ? (
              `${displayCount} Filmmakers found`
            ) : (
              `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, displayCount)} of ${displayCount} results`
            )}
          </span>
          {totalPages > 1 && (
            <span style={{ fontSize: '0.85rem' }}>
              Page {page} of {totalPages}
            </span>
          )}
        </div>

        {/* Filmmakers Grid */}
        {displayFilmmakers.length > 0 ? (
          <>
            <div className="filmmakers-grid">
              {displayFilmmakers.map((filmmaker) => (
                <FilmmakerCard key={filmmaker.id} filmmaker={filmmaker} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-controls" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '4rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--border-light)'
              }}>
                <Link
                  href={`/browse?${new URLSearchParams({
                    ...params as any, // Cast to any to avoid complex type matching issues
                    page: (page - 1).toString()
                  }).toString()}`}
                  className={`btn btn-secondary ${page <= 1 ? 'disabled' : ''}`}
                  style={{ pointerEvents: page <= 1 ? 'none' : 'auto', opacity: page <= 1 ? 0.5 : 1 }}
                >
                  ← Previous
                </Link>

                <Link
                  href={`/browse?${new URLSearchParams({
                    ...params as any,
                    page: (page + 1).toString()
                  }).toString()}`}
                  className={`btn btn-secondary ${page >= totalPages ? 'disabled' : ''}`}
                  style={{ pointerEvents: page >= totalPages ? 'none' : 'auto', opacity: page >= totalPages ? 0.5 : 1 }}
                >
                  Next →
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state" style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: '#f9f9f9',
            borderRadius: '8px',
            margin: '2rem 0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No filmmakers found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              We couldn't find any matches for your search. Try adjusting your filters or search terms.
            </p>
            <Link href="/browse" className="btn btn-secondary">
              Clear All Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
