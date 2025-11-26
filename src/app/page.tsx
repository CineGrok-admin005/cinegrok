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
import { supabase } from '@/lib/supabase';
import { Filmmaker } from '@/lib/api';
import HomePageContent from './home-content';

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
    <HomePageContent filmmakers={filmmakers} />
  );
}
