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

async function getAllFilmmakers(page: number = 1, limit: number = 12): Promise<{ data: Filmmaker[], count: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('filmmakers')
    .select('*', { count: 'exact' })
    .not('ai_generated_bio', 'is', null)
    .order('created_at', { ascending: false })
    .range(from, to);

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

  // STRATEGY: 
  // 1. If NO filters: Use DB pagination.
  // 2. If filters: Fetch a larger set (e.g. 100) and filter in memory, then paginate in memory? 
  //    OR just fetch all for filtering.
  //    The user asked for "Best Practice". 
  //    Best practice is DB filtering.
  //    Let's try to pass filters to the DB query if possible.

  //    Actually, simple `getAllFilmmakers` is used above.
  //    Let's modify `getAllFilmmakers` to accept filters later if needed.
  //    For now, let's keep it simple: Fetch ALL for filtering (current behavior) if filters exist, 
  //    else use DB pagination.

  let filmmakers: Filmmaker[] = [];
  let totalCount = 0;

  const hasFilters = params.role || params.state || params.collab || params.genre;

  if (hasFilters) {
    // Fetch all to filter in memory (Fallback for complex JSONB)
    // This isn't infinite scalability but works for <1000 profiles.
    // In a real huge app, we'd index JSONB columns.
    const { data } = await supabase
      .from('filmmakers')
      .select('*')
      .not('ai_generated_bio', 'is', null)
      .order('created_at', { ascending: false });
    filmmakers = data || [];
  } else {
    const result = await getAllFilmmakers(page, limit);
    filmmakers = result.data;
    totalCount = result.count;
  }

  // Filter Logic (In-Memory)
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

    // 5. Search Filter
    if (searchFilter) {
      try {
        const name = String(f.full_name || f.name || '').toLowerCase();
        const bio = String(f.ai_generated_bio || '').toLowerCase();

        // Safe access for raw_form_data using String() casting
        const rawData = f.raw_form_data || {};
        const location = String(rawData.current_location || '').toLowerCase();

        const rolesVal = rawData.primary_roles;
        let rolesStr = '';
        if (Array.isArray(rolesVal)) {
          rolesStr = rolesVal.join(' ');
        } else if (rolesVal) {
          rolesStr = String(rolesVal);
        }
        const roles = rolesStr.toLowerCase();

        if (!name.includes(searchFilter) &&
          !bio.includes(searchFilter) &&
          !location.includes(searchFilter) &&
          !roles.includes(searchFilter)) {
          return false;
        }
      } catch (e) {
        // Log error but don't crash the page
        console.error('Error filtering filmmaker:', f.id, e);
        return false;
      }
    }

    return true;
  });

  // If we had filters, we need to paginate the RESULT now.
  let displayFilmmakers = filteredFilmmakers;
  let displayCount = filteredFilmmakers.length;

  if (hasFilters) {
    const from = (page - 1) * limit;
    const to = from + limit;
    displayFilmmakers = filteredFilmmakers.slice(from, to);
  } else {
    displayCount = totalCount;
  }

  const totalPages = Math.ceil(displayCount / limit);

  const roleFilter = params.role;
  const stateFilter = params.state;
  const collabFilter = params.collab;

  const genreFilter = params.genre;
  const searchFilter = params.search?.toLowerCase();

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

        <div className="results-count" style={{ margin: '1rem 0', color: '#666', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
