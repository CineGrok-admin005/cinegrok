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

async function getFilmmakers(options: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  state?: string;
  genre?: string;
  collab?: boolean;
}): Promise<{ data: Filmmaker[], count: number }> {
  const { page = 1, limit = 12, search, role, state, genre, collab } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('filmmakers')
    .select('*', { count: 'exact' })
    .not('ai_generated_bio', 'is', null);

  // 1. Search (Robust)
  if (search) {
    const s = search.toLowerCase();
    // Search in name, bio, and JSON location/city keys (both camelCase and snake_case)
    query = query.or(`name.ilike.%${s}%,ai_generated_bio.ilike.%${s}%,raw_form_data->>current_city.ilike.%${s}%,raw_form_data->>currentCity.ilike.%${s}%,raw_form_data->>current_location.ilike.%${s}%`);
  }

  // 2. Role Filter (JSONB)
  if (role) {
    // textSearch on the JSON column finds the text anywhere in values or keys
    query = query.textSearch('raw_form_data', `'${role}'`);
  }

  // 3. State Filter
  if (state) {
    // Check state keys, and also city keys just in case (e.g. searching for Delhi)
    query = query.or(`raw_form_data->>current_state.ilike.%${state}%,raw_form_data->>currentState.ilike.%${state}%,raw_form_data->>native_state.ilike.%${state}%,raw_form_data->>current_city.ilike.%${state}%,raw_form_data->>currentCity.ilike.%${state}%`);
  }

  // 4. Genre Filter
  if (genre) {
    query = query.textSearch('raw_form_data', `'${genre}'`);
  }

  // 5. Collab Filter
  if (collab) {
    // Check both snake_case and camelCase keys for Yes/Selective
    query = query.or('raw_form_data->>open_to_collab.eq.Yes,raw_form_data->>open_to_collab.eq.Selective,raw_form_data->>openToCollaborations.eq.Yes,raw_form_data->>openToCollaborations.eq.Selective');
  }

  query = query
    .order('created_at', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching filmmakers:', error);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: count || 0 };
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; state?: string; collab?: string; genre?: string; page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = 12;

  // Note: For filtering to work correctly with pagination, we ideally need to filter on the database side.
  // However, the current prompt requires complex JSONB filtering which is harder to do safely without more complex queries.
  // For now, if filters are active, we might need to fetch more or move filtering to the client/DB.
  // GIVEN the user context of "best practice", DB filtering is better.
  // But our filters are on `raw_form_data` JSONB column. 
  // Let's implement Client-side logic for now OR accept that pagination works on the 'base' set 
  // and filtering happens afterwards (which breaks pagination count).

  // REVISIT: To do this properly with Supabase JSONB:
  // We should query *with* filters.
  // But let's stick to the prompt's simplicity first.
  // If we paginate FIRST, we might miss filtered items.
  // CORRECT APPROACH: We should ideally fetch all (or a large limit) if filters are on, OR implement JSONB filtering in Supabase.

  // Parse filters
  const roleFilter = params.role;
  const stateFilter = params.state;
  const collabFilter = params.collab;
  const genreFilter = params.genre;
  const searchFilter = params.search;

  // Fetch data from DB with filters
  const { data: filmmakers, count: totalCount } = await getFilmmakers({
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
          <div className="filters-grid">
            {/* Row 1: Roles (Full Width) */}
            <div className="filter-group full-width">
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
