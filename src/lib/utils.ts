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
        primary: '#8B5CF6', // Purple
        light: '#EDE9FE',
        dark: '#6D28D9',
        gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
    },
    cinematographer: {
        primary: '#3B82F6', // Blue
        light: '#DBEAFE',
        dark: '#1E40AF',
        gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
    },
    editor: {
        primary: '#10B981', // Green
        light: '#D1FAE5',
        dark: '#047857',
        gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    },
    writer: {
        primary: '#F59E0B', // Amber
        light: '#FEF3C7',
        dark: '#D97706',
        gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    },
    producer: {
        primary: '#EF4444', // Red
        light: '#FEE2E2',
        dark: '#B91C1C',
        gradient: 'linear-gradient(135deg, #EF4444, #F87171)',
    },
    actor: {
        primary: '#EC4899', // Pink
        light: '#FCE7F3',
        dark: '#BE185D',
        gradient: 'linear-gradient(135deg, #EC4899, #F472B6)',
    },
    composer: {
        primary: '#8B5CF6', // Purple (music)
        light: '#F3E8FF',
        dark: '#7C3AED',
        gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
    },
    default: {
        primary: '#6B7280', // Gray
        light: '#F3F4F6',
        dark: '#374151',
        gradient: 'linear-gradient(135deg, #6B7280, #9CA3AF)',
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
        badge: '🌱 Emerging',
        color: '#10B981',
        bgColor: '#D1FAE5',
        borderColor: '#6EE7B7',
        icon: '🌱',
    },
    [ExperienceTier.RISING]: {
        badge: '⭐ Rising',
        color: '#3B82F6',
        bgColor: '#DBEAFE',
        borderColor: '#93C5FD',
        icon: '⭐',
    },
    [ExperienceTier.ESTABLISHED]: {
        badge: '🎬 Established',
        color: '#8B5CF6',
        bgColor: '#EDE9FE',
        borderColor: '#C4B5FD',
        icon: '🎬',
    },
    [ExperienceTier.VETERAN]: {
        badge: '🏆 Veteran',
        color: '#D97706',
        bgColor: '#FEF3C7',
        borderColor: '#FCD34D',
        icon: '🏆',
    },
    [ExperienceTier.ACCLAIMED]: {
        badge: '👑 Acclaimed',
        color: '#DC2626',
        bgColor: '#FEE2E2',
        borderColor: '#FCA5A5',
        icon: '👑',
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
