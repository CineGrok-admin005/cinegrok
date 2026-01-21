/**
 * Utility functions for CineGrok
 * 
 * Includes tier calculation, color palette assignment, and data helpers
 */

import { RawFormData, Film } from './api';

/**
 * Role-based color palettes
 * Each role gets a distinct color scheme for instant visual recognition
 */
export const ROLE_COLORS = {
    director: {
        primary: '#18181b', // Zinc 900
        light: '#f4f4f5',
        dark: '#000000',
        gradient: 'linear-gradient(135deg, #18181b, #27272a)',
    },
    cinematographer: {
        primary: '#27272a', // Zinc 800
        light: '#f4f4f5',
        dark: '#18181b',
        gradient: 'linear-gradient(135deg, #27272a, #3f3f46)',
    },
    editor: {
        primary: '#3f3f46', // Zinc 700
        light: '#f4f4f5',
        dark: '#27272a',
        gradient: 'linear-gradient(135deg, #3f3f46, #52525b)',
    },
    writer: {
        primary: '#52525b', // Zinc 600
        light: '#f4f4f5',
        dark: '#3f3f46',
        gradient: 'linear-gradient(135deg, #52525b, #71717a)',
    },
    producer: {
        primary: '#18181b', // Zinc 900
        light: '#f4f4f5',
        dark: '#000000',
        gradient: 'linear-gradient(135deg, #18181b, #27272a)',
    },
    actor: {
        primary: '#27272a', // Zinc 800
        light: '#f4f4f5',
        dark: '#000000',
        gradient: 'linear-gradient(135deg, #27272a, #3f3f46)',
    },
    composer: {
        primary: '#3f3f46', // Zinc 700
        light: '#f4f4f5',
        dark: '#27272a',
        gradient: 'linear-gradient(135deg, #3f3f46, #52525b)',
    },
    default: {
        primary: '#52525b', // Zinc 600
        light: '#f4f4f5',
        dark: '#374151',
        gradient: 'linear-gradient(135deg, #52525b, #71717a)',
    },
} as const;

/**
 * Experience tier definitions
 * Based on number of films, awards, and years active
 */
export enum ExperienceTier {
    EMERGING = 'emerging',      // 0-2 films, 0-2 years
    RISING = 'rising',          // 3-5 films, 2-5 years
    ESTABLISHED = 'established', // 6-10 films, 5-10 years
    VETERAN = 'veteran',        // 11+ films, 10+ years
    ACCLAIMED = 'acclaimed',    // Any tier + significant awards
}

/**
 * Tier-based visual styling
 */
export const TIER_STYLES = {
    [ExperienceTier.EMERGING]: {
        badge: 'Emerging',
        color: '#52525b', // Zinc 600
        bgColor: '#f4f4f5', // Zinc 100
        borderColor: '#e4e4e7', // Zinc 200
        icon: 'sprout',
    },
    [ExperienceTier.RISING]: {
        badge: 'Rising',
        color: '#27272a', // Zinc 800
        bgColor: '#f4f4f5', // Zinc 100
        borderColor: '#d4d4d8', // Zinc 300
        icon: 'star',
    },
    [ExperienceTier.ESTABLISHED]: {
        badge: 'Established',
        color: '#18181b', // Zinc 900
        bgColor: '#f4f4f5', // Zinc 100
        borderColor: '#a1a1aa', // Zinc 400
        icon: 'clapperboard',
    },
    [ExperienceTier.VETERAN]: {
        badge: 'Veteran',
        color: '#000000', // Black
        bgColor: '#f4f4f5',
        borderColor: '#71717a', // Zinc 500
        icon: 'trophy',
    },
    [ExperienceTier.ACCLAIMED]: {
        badge: 'Acclaimed',
        color: '#000000',
        bgColor: '#f4f4f5',
        borderColor: '#d4af37', // Gold 
        icon: 'crown',
    },
} as const;

/**
 * Calculate filmmaker's experience tier
 * 
 * @param data - Raw form data from database
 * @returns Experience tier enum
 */
export function calculateTier(data: RawFormData): ExperienceTier {
    const films = data.films?.length || 0;
    const yearsActive = parseYearsActive(data.years_active);
    const hasAwards = hasSignificantAwards(data.awards, data.screenings);

    // Acclaimed tier: significant awards regardless of experience
    if (hasAwards && (films >= 3 || yearsActive >= 3)) {
        return ExperienceTier.ACCLAIMED;
    }

    // Veteran: 11+ films or 10+ years
    if (films >= 11 || yearsActive >= 10) {
        return ExperienceTier.VETERAN;
    }

    // Established: 6-10 films or 5-10 years
    if (films >= 6 || yearsActive >= 5) {
        return ExperienceTier.ESTABLISHED;
    }

    // Rising: 3-5 films or 2-5 years
    if (films >= 3 || yearsActive >= 2) {
        return ExperienceTier.RISING;
    }

    // Emerging: default for new filmmakers
    return ExperienceTier.EMERGING;
}

/**
 * Parse years active from string (e.g., "2020-2024" or "5 years")
 */
function parseYearsActive(yearsActive?: string): number {
    if (!yearsActive) return 0;

    // Try to parse range (e.g., "2020-2024")
    const rangeMatch = yearsActive.match(/(\d{4})\s*-\s*(\d{4})/);
    if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        return end - start;
    }

    // Try to parse number (e.g., "5 years")
    const numberMatch = yearsActive.match(/(\d+)/);
    if (numberMatch) {
        return parseInt(numberMatch[1]);
    }

    return 0;
}

/**
 * Check if filmmaker has significant awards
 * Looks for major festival names or award keywords
 */
function hasSignificantAwards(awards?: string, screenings?: string): boolean {
    const text = `${awards || ''} ${screenings || ''}`.toLowerCase();

    const majorFestivals = [
        'cannes', 'sundance', 'venice', 'berlin', 'toronto',
        'tribeca', 'sxsw', 'telluride', 'oscar', 'academy',
        'bafta', 'golden globe', 'emmy', 'winner', 'award',
        'best', 'grand jury', 'audience award'
    ];

    return majorFestivals.some(keyword => text.includes(keyword));
}

/**
 * Get primary role from roles string
 * Used for color palette assignment
 */
export function getPrimaryRole(roles?: string | string[]): keyof typeof ROLE_COLORS {
    if (!roles) return 'default';

    // Convert array to string if needed
    const rolesStr = Array.isArray(roles) ? roles.join(' ') : roles;
    const rolesLower = rolesStr.toLowerCase();

    // Check in priority order
    if (rolesLower.includes('director')) return 'director';
    if (rolesLower.includes('cinematographer') || rolesLower.includes('dp')) return 'cinematographer';
    if (rolesLower.includes('editor')) return 'editor';
    if (rolesLower.includes('writer') || rolesLower.includes('screenwriter')) return 'writer';
    if (rolesLower.includes('producer')) return 'producer';
    if (rolesLower.includes('actor') || rolesLower.includes('actress')) return 'actor';
    if (rolesLower.includes('composer') || rolesLower.includes('music')) return 'composer';

    return 'default';
}

/**
 * Get role color palette
 */
export function getRoleColors(roles?: string | string[]) {
    const role = getPrimaryRole(roles);
    return ROLE_COLORS[role];
}

/**
 * Get tier styling
 */
export function getTierStyle(tier: ExperienceTier) {
    return TIER_STYLES[tier];
}

/**
 * Generate initials from name for avatar fallback
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Format location string
 */
export function formatLocation(data: RawFormData): string | null {
    if (data.current_location) return data.current_location;
    if (data.country) return data.country;
    return null;
}

/**
 * Check if filmmaker has any social links
 */
export function hasSocialLinks(data: RawFormData): boolean {
    return !!(
        data.instagram ||
        data.youtube ||
        data.imdb ||
        data.linkedin ||
        data.twitter ||
        data.facebook ||
        data.website ||
        data.letterboxd
    );
}

/**
 * Get all available social links
 */
export function getSocialLinks(data: RawFormData) {
    return {
        instagram: data.instagram,
        youtube: data.youtube,
        imdb: data.imdb,
        linkedin: data.linkedin,
        twitter: data.twitter,
        facebook: data.facebook,
        website: data.website,
        letterboxd: data.letterboxd,
    };
}

/**
 * Format films for display
 */
export function formatFilms(films?: Film[]): Film[] {
    if (!films || films.length === 0) return [];

    // Sort by year (most recent first)
    return films.sort((a, b) => {
        const yearA = parseInt(a.year || '0');
        const yearB = parseInt(b.year || '0');
        return yearB - yearA;
    });
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Check if section should be displayed
 */
export function shouldShowSection(content?: string | string[] | null): boolean {
    if (!content) return false;
    if (Array.isArray(content)) return content.length > 0;
    return content.trim().length > 0;
}
