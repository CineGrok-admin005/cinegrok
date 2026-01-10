/**
 * Filmmaker Profile Page
 * 
 * Server component with dynamic metadata
 */

import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/supabase-server';
import { PublicProfileWrapper } from '@/components/profile-features/PublicProfileWrapper';
import { mapDatabaseToProfileData } from '@/lib/mappers';
import Link from 'next/link';

// Revalidate every hour
export const revalidate = 3600;

async function getFilmmaker(id: string) {
  const { data, error } = await supabase
    .from('filmmakers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching filmmaker:', error);
    return null;
  }

  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filmmaker = await getFilmmaker(id);

  if (!filmmaker) {
    return {
      title: 'Filmmaker Not Found',
    };
  }

  return {
    title: `${filmmaker.name} - CineGrok`,
    description: filmmaker.ai_generated_bio?.slice(0, 160) || `Profile of ${filmmaker.name}`,
  };
}

export default async function FilmmakerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filmmaker = await getFilmmaker(id);
  const user = await getUser();

  if (!filmmaker) {
    notFound();
  }

  const profileData = mapDatabaseToProfileData(filmmaker.raw_form_data);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <Navigation />
      <main className="py-0 px-0">
        <PublicProfileWrapper profile={profileData} isLoggedIn={!!user} />
      </main>
    </div>
  );
}

// Helper removed in favor of centralized lib/mappers.ts
