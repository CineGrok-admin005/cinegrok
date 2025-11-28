/**
 * Browse Page
 * 
 * Browse all filmmakers with filtering and sorting
 */

import Navigation from '@/components/Navigation';
import FilmmakerCard from '@/components/FilmmakerCard';
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
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const filmmakers = await getAllFilmmakers();

  // Filter by role if specified
  const filteredFilmmakers = params.role
    ? filmmakers.filter(f =>
      f.raw_form_data.roles?.toLowerCase().includes(params.role!.toLowerCase())
    )
    : filmmakers;

  const roleFilter = params.role;

  return (
    <div className="browse-page">
      <Navigation />

      <div className="container">
        {/* Header */}
        <div className="browse-header">
          <h1>Browse Filmmakers</h1>
          <p className="subtitle">
            {roleFilter
              ? `Showing ${filteredFilmmakers.length} ${roleFilter}${filteredFilmmakers.length !== 1 ? 's' : ''}`
              : `Discover ${filmmakers.length} talented filmmakers`
            }
          </p>
        </div>

        {/* Role Filters */}
        <div className="filter-section">
          <h3>Filter by Role</h3>
          <div className="role-filters">
            <Link
              href="/browse"
              className={`filter-pill ${!roleFilter ? 'active' : ''}`}
            >
              All
            </Link>
            <Link
              href="/browse?role=director"
              className={`filter-pill ${roleFilter === 'director' ? 'active' : ''}`}
            >
              Directors
            </Link>
            <Link
              href="/browse?role=cinematographer"
              className={`filter-pill ${roleFilter === 'cinematographer' ? 'active' : ''}`}
            >
              Cinematographers
            </Link>
            <Link
              href="/browse?role=editor"
              className={`filter-pill ${roleFilter === 'editor' ? 'active' : ''}`}
            >
              Editors
            </Link>
            <Link
              href="/browse?role=writer"
              className={`filter-pill ${roleFilter === 'writer' ? 'active' : ''}`}
            >
              Writers
            </Link>
            <Link
              href="/browse?role=producer"
              className={`filter-pill ${roleFilter === 'producer' ? 'active' : ''}`}
            >
              Producers
            </Link>
            <Link
              href="/browse?role=actor"
              className={`filter-pill ${roleFilter === 'actor' ? 'active' : ''}`}
            >
              Actors
            </Link>
          </div>
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
            <p>No filmmakers found{roleFilter ? ` for role: ${roleFilter}` : ''}.</p>
            <Link href="/browse" className="btn btn-secondary">
              View All Filmmakers
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
