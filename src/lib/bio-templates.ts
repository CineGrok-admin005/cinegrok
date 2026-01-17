/**
 * Deterministic Bio Template Engine
 * 
 * Generates professional filmmaker bios using Wikipedia/IMDb style.
 * No AI/external API dependencies - instant, reliable generation.
 * 
 * Pattern based on Wikipedia biography opening paragraphs:
 * 1. First sentence: Full name + profession + location
 * 2. Following sentences use pronouns or surname (no excessive name repetition)
 * 3. "Known for [specialty]" establishes credibility
 * 4. Achievements/awards mentioned factually
 * 
 * @module lib/bio-templates
 */

import { logger } from './logger';

// ============================================================================
// TYPES
// ============================================================================

export interface BioFormData {
    name?: string;
    stageName?: string;
    roles?: string[];
    primaryRoles?: string[];
    secondaryRoles?: string[];
    genres?: string[];
    preferredGenres?: string[];
    yearsActive?: string;
    years_active?: string;
    visualStyle?: string;
    style?: string;
    creativeInfluences?: string;
    influences?: string;
    creativePhilosophy?: string;
    philosophy?: string;
    beliefAboutCinema?: string;
    belief?: string;
    messageOrIntent?: string;
    message?: string;
    films?: Array<{ title: string; year: string | number }>;
    filmography?: Array<{ title: string; year: string | number }>;
    awards?: string;
    country?: string;
    currentCity?: string;
    currentState?: string;
    current_location?: string;
    nativeCity?: string;
    nativeState?: string;
    nativeCountry?: string;
    languages?: string[];
    openToCollaborations?: string;
}

export type BioTier = 'senior' | 'mid' | 'junior';
export type BioVariant = 1 | 2 | 3;

// ============================================================================
// TEMPLATE HELPERS
// ============================================================================

function determineTier(yearsActive?: string): BioTier {
    if (!yearsActive) return 'junior';
    const years = parseInt(yearsActive.replace(/\D/g, ''));
    if (years >= 10) return 'senior';
    if (years >= 4) return 'mid';
    return 'junior';
}

function formatList(items: string[], maxItems = 3): string {
    if (!items || items.length === 0) return '';
    const limited = items.slice(0, maxItems);
    if (limited.length === 1) return limited[0];
    if (limited.length === 2) return `${limited[0]} and ${limited[1]}`;
    return `${limited.slice(0, -1).join(', ')}, and ${limited[limited.length - 1]}`;
}

function getLocation(data: BioFormData): string {
    if (data.currentCity && data.currentState) {
        return `${data.currentCity}, ${data.currentState}`;
    }
    return data.current_location || data.currentCity || data.currentState || data.country || '';
}

function getOrigin(data: BioFormData): string {
    if (data.nativeCity && data.nativeState) {
        return `${data.nativeCity}, ${data.nativeState}`;
    }
    return data.nativeCity || data.nativeState || data.nativeCountry || '';
}

function getName(data: BioFormData): string {
    return data.stageName || data.name || 'This filmmaker';
}

function getSurname(data: BioFormData): string {
    const fullName = data.stageName || data.name || '';
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

function getRoles(data: BioFormData): string[] {
    return data.primaryRoles || data.roles || [];
}

function getGenres(data: BioFormData): string[] {
    return data.preferredGenres || data.genres || [];
}

function getFilms(data: BioFormData): Array<{ title: string; year: string | number }> {
    return data.films || data.filmography || [];
}

function getYearsNumber(yearsActive?: string): string {
    if (!yearsActive) return '';
    const match = yearsActive.match(/\d+/);
    return match ? match[0] : '';
}

// Get article "a" or "an" based on first letter
function getArticle(word: string): string {
    if (!word) return 'a';
    const firstLetter = word.charAt(0).toLowerCase();
    return ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? 'an' : 'a';
}

// ============================================================================
// SENIOR TIER TEMPLATES (10+ years)
// Pattern: Established professional with notable body of work
// ============================================================================

const seniorTemplates = {
    1: (data: BioFormData): string => {
        const name = getName(data);
        const surname = getSurname(data);
        const roles = formatList(getRoles(data));
        const location = getLocation(data);
        const origin = getOrigin(data);
        const genres = formatList(getGenres(data), 2);
        const years = getYearsNumber(data.yearsActive || data.years_active);
        const films = getFilms(data);
        const style = data.visualStyle || data.style;

        const roleText = roles || 'filmmaker';
        let bio = `${name} is ${getArticle(roleText)} ${roleText}`;
        if (location) bio += ` based in ${location}`;
        if (origin && origin !== location) bio += `, originally from ${origin}`;
        bio += `.`;

        // Second sentence - use "He/She is" pattern, but since we don't have gender, restructure
        if (years && genres) {
            bio += ` With over ${years} years in the industry, ${surname}'s work spans ${genres}.`;
        } else if (years) {
            bio += ` Active in the film industry for over ${years} years.`;
        } else if (genres) {
            bio += ` Known for work in ${genres}.`;
        }

        if (style) {
            bio += ` ${surname}'s filmmaking is characterized by ${style.toLowerCase()}.`;
        }

        if (films.length > 0) {
            const filmList = films.slice(0, 3).map(f => `${f.title} (${f.year})`).join(', ');
            bio += ` Notable works include ${filmList}.`;
        }

        if (data.awards) {
            bio += ` ${surname} has received ${data.awards}.`;
        }

        return bio.trim();
    },

    2: (data: BioFormData): string => {
        const name = getName(data);
        const surname = getSurname(data);
        const roles = formatList(getRoles(data));
        const location = getLocation(data);
        const genres = formatList(getGenres(data), 2);
        const influences = data.creativeInfluences || data.influences;
        const films = getFilms(data);

        const roleText = roles || 'filmmaker';
        let bio = `${name} is ${getArticle(roleText)} ${roleText}`;
        if (location) bio += ` from ${location}`;
        bio += `.`;

        if (genres) {
            bio += ` Known for work in ${genres}.`;
        }

        if (influences) {
            bio += ` ${surname} cites ${influences} as creative influences.`;
        }

        if (films.length > 0) {
            const filmList = films.slice(0, 3).map(f => `${f.title} (${f.year})`).join(', ');
            bio += ` ${surname}'s filmography includes ${filmList}.`;
        }

        if (data.awards) {
            bio += ` Recipient of ${data.awards}.`;
        }

        return bio.trim();
    },

    3: (data: BioFormData): string => {
        const name = getName(data);
        const surname = getSurname(data);
        const roles = getRoles(data);
        const genres = formatList(getGenres(data), 2);
        const philosophy = data.creativePhilosophy || data.philosophy;
        const films = getFilms(data);
        const years = getYearsNumber(data.yearsActive || data.years_active);
        const location = getLocation(data);

        const roleText = roles.length > 0 ? formatList(roles) : 'filmmaker';
        let bio = `${name} is ${getArticle(roleText)} ${roleText}`;
        if (years) bio += ` with ${years} years of experience`;
        if (location) bio += `, based in ${location}`;
        bio += `.`;

        if (genres) {
            bio += ` ${surname} works primarily in ${genres}.`;
        }

        if (films.length > 0) {
            const filmList = films.slice(0, 2).map(f => `${f.title} (${f.year})`).join(' and ');
            bio += ` Recent projects include ${filmList}.`;
        }

        if (philosophy) {
            bio += ` ${philosophy}`;
        }

        return bio.trim();
    },
};

// ============================================================================
// MID TIER TEMPLATES (4-9 years)
// Pattern: Working professional building a body of work
// ============================================================================

const midTemplates = {
    1: (data: BioFormData): string => {
        const name = getName(data);
        const surname = getSurname(data);
        const roles = formatList(getRoles(data));
        const location = getLocation(data);
        const genres = formatList(getGenres(data), 2);
        const years = getYearsNumber(data.yearsActive || data.years_active);
        const films = getFilms(data);

        const roleText = roles || 'filmmaker';
        let bio = `${name} is ${getArticle(roleText)} ${roleText}`;
        if (location) bio += ` based in ${location}`;
        bio += `.`;

        if (years) {
            bio += ` Active in the industry for ${years} years`;
            if (genres) bio += `, focusing on ${genres}`;
            bio += `.`;
        } else if (genres) {
            bio += ` ${surname}'s focus is ${genres}.`;
        }

        if (films.length > 0) {
            const filmList = films.slice(0, 2).map(f => `${f.title} (${f.year})`).join(' and ');
            bio += ` Recent work includes ${filmList}.`;
        }

        return bio.trim();
    },

    2: (data: BioFormData): string => {
        const name = getName(data);
        const surname = getSurname(data);
        const roles = getRoles(data);
        const location = getLocation(data);
        const genres = formatList(getGenres(data), 2);
        const influences = data.creativeInfluences || data.influences;
        const style = data.visualStyle || data.style;

        const roleText = roles.length > 0 ? formatList(roles) : 'filmmaker';
        let bio = `${name} is ${getArticle(roleText)} ${roleText}`;
        if (location) bio += ` from ${location}`;
        bio += `.`;

        if (genres) {
            bio += ` Known for work in ${genres}.`;
        }

        if (style) {
            bio += ` ${surname}'s approach involves ${style.toLowerCase()}.`;
        }

        if (influences) {
            bio += ` Influenced by ${influences}.`;
        }

        return bio.trim();
    },

    3: (data: BioFormData): string => {
        const name = getName(data);
        const roles = formatList(getRoles(data));
        const location = getLocation(data);
        const films = getFilms(data);
        const philosophy = data.creativePhilosophy || data.philosophy;

        const roleText = roles || 'filmmaker';
        let bio = `${name} is ${getArticle(roleText)} ${roleText}`;
        if (location) bio += ` based in ${location}`;
        bio += `.`;

        if (films.length > 0) {
            const filmList = films.slice(0, 2).map(f => `${f.title} (${f.year})`).join(' and ');
            bio += ` Recent work includes ${filmList}.`;
        }

        if (philosophy) {
            bio += ` ${philosophy}`;
        }

        if (data.openToCollaborations === 'Yes') {
            bio += ` Currently open to collaborations.`;
        }

        return bio.trim();
    },
};

// ============================================================================
// JUNIOR TIER TEMPLATES (0-3 years)
// Pattern: Early career, straightforward introduction
// ============================================================================

const juniorTemplates = {
    1: (data: BioFormData): string => {
        const name = getName(data);
        const roles = formatList(getRoles(data));
        const location = getLocation(data);
        const origin = getOrigin(data);
        const genres = formatList(getGenres(data), 2);

        const roleText = roles || 'filmmaker';
        let bio = `${name} is ${getArticle(roleText)} ${roleText}`;
        if (location) bio += ` based in ${location}`;
        if (origin && origin !== location) bio += `, originally from ${origin}`;
        bio += `.`;

        if (genres) {
            bio += ` Works in ${genres}.`;
        }

        if (data.openToCollaborations === 'Yes') {
            bio += ` Open to collaborations.`;
        }

        return bio.trim();
    },

    2: (data: BioFormData): string => {
        const name = getName(data);
        const roles = getRoles(data);
        const location = getLocation(data);
        const influences = data.creativeInfluences || data.influences;
        const genres = formatList(getGenres(data), 2);

        const roleText = roles.length > 0 ? formatList(roles) : 'filmmaker';
        let bio = `${name} is ${getArticle(roleText)} ${roleText}`;
        if (location) bio += ` from ${location}`;
        bio += `.`;

        if (genres) {
            bio += ` Interested in ${genres}.`;
        }

        if (influences) {
            bio += ` Draws inspiration from ${influences}.`;
        }

        return bio.trim();
    },

    3: (data: BioFormData): string => {
        const name = getName(data);
        const roles = formatList(getRoles(data));
        const location = getLocation(data);
        const philosophy = data.creativePhilosophy || data.philosophy;

        const roleText = roles || 'filmmaker';
        let bio = `${name} is ${getArticle(roleText)} ${roleText}`;
        if (location) bio += ` from ${location}`;
        bio += `.`;

        if (philosophy) {
            bio += ` ${philosophy}`;
        }

        if (data.openToCollaborations === 'Yes') {
            bio += ` Open to collaborations.`;
        }

        return bio.trim();
    },
};

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * Generates a professional bio using Wikipedia/IMDb style templates.
 */
export function generateBioFromTemplate(
    data: BioFormData,
    variant: BioVariant = 1
): string {
    const tier = determineTier(data.yearsActive || data.years_active);

    logger.debug(`Generating bio: tier=${tier}, variant=${variant}`);

    try {
        switch (tier) {
            case 'senior':
                return seniorTemplates[variant](data);
            case 'mid':
                return midTemplates[variant](data);
            case 'junior':
            default:
                return juniorTemplates[variant](data);
        }
    } catch (error) {
        logger.error('ERR_BIO_001', 'Bio template generation failed', undefined, { tier, variant });
        const name = getName(data);
        const roles = formatList(getRoles(data));
        const roleText = roles || 'filmmaker';
        return `${name} is ${getArticle(roleText)} ${roleText}.`;
    }
}

export function getNextVariant(current: BioVariant): BioVariant {
    return ((current % 3) + 1) as BioVariant;
}

export function getBioTier(yearsActive?: string): BioTier {
    return determineTier(yearsActive);
}
