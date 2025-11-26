/**
 * Filmmaker Profile Page
 * 
 * Features:
 * - Role-based color theming
 * - Experience tier visualization
 * - Conditional sections (only show if data exists)
 * - Mobile-first responsive layout
 * - Social links integration
 * - Film gallery
 * 
 * Performance: Server-side rendering with aggressive caching
 * SEO: Dynamic metadata for each filmmaker
 */

import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Filmmaker } from '@/lib/api';
import FilmmakerProfileContent from './profile-content';
import {
    calculateTier,
    getRoleColors,
    getTierStyle,
    formatLocation,
    getSocialLinks,
    formatFilms,
    shouldShowSection,
} from '@/lib/utils';

// Revalidate every hour
export const revalidate = 3600;

async function getFilmmaker(id: string): Promise<Filmmaker | null> {
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

export async function generateMetadata({ params }: { params: { id: string } }) {
    const filmmaker = await getFilmmaker(params.id);

    if (!filmmaker) {
        return {
            title: 'Filmmaker Not Found',
        };
    }

    return {
        title: `${filmmaker.name} - ${filmmaker.raw_form_data.roles || 'Filmmaker'} | CineGrok`,
        description: filmmaker.ai_generated_bio?.slice(0, 160) || `Profile of ${filmmaker.name}`,
    };
}

export default async function FilmmakerPage({ params }: { params: { id: string } }) {
    const filmmaker = await getFilmmaker(params.id);

    if (!filmmaker || !filmmaker.ai_generated_bio) {
        notFound();
    }

    const { raw_form_data } = filmmaker;
    const tier = calculateTier(raw_form_data);
    const tierStyle = getTierStyle(tier);
    const roleColors = getRoleColors(raw_form_data.roles);
    const location = formatLocation(raw_form_data);
    const socialLinks = getSocialLinks(raw_form_data);
    const films = formatFilms(raw_form_data.films);

    return (
        <FilmmakerProfileContent
            filmmaker={filmmaker}
            tierStyle={tierStyle}
            roleColors={roleColors}
            location={location}
            socialLinks={socialLinks}
            films={films}
            shouldShowSection={shouldShowSection}
        />
    );
}
