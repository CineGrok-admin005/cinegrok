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
    {/* Filmmakers Grid */ }
    {
      filteredFilmmakers.length > 0 ? (
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
    )
    }
      </div >
    </div >
  );
  }
