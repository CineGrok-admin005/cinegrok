import { ProfileData, FilmographyEntry } from '@/components/profile-features/types';

/**
 * Maps database/raw form data to the modern ProfileData interface.
 * Ensures that strings are converted to arrays where expected.
 * Handles both legacy (snake_case) and new (camelCase) formats.
 */
export function mapDatabaseToProfileData(data: any): ProfileData {
    if (!data) {
        return createEmptyProfileData();
    }

    // If already in new format with camelCase and arrays, prioritize it
    // But still run through mapping to ensure type safety
    const raw = data;

    const getArray = (val: any): string[] => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
            // Split by comma first
            let parts = val.split(',').map(s => s.trim()).filter(Boolean);
            // If we only got one part, and it looks like it might have spaces (but isn't a complex role like "Art Director")
            // OR if it's clearly bunched like "DIRECTOREDITOR"
            // Wait, let's keep it simple: split by comma, then if no commas, check for common bunching patterns or just spaces.
            if (parts.length === 1 && !val.includes(',')) {
                // If it contains multiple known uppercase roles like DIRECTOR, EDITOR, etc without spaces
                // But that's complex. Let's just catch the space case first.
                if (val.includes(' ') && !val.match(/Assistant|Associate|Executive|Art|Creative/i)) {
                    parts = val.split(/\s+/).map(s => s.trim()).filter(Boolean);
                }
            }
            return parts;
        }
        return [];
    };

    const filmography: FilmographyEntry[] = Array.isArray(raw.filmography)
        ? raw.filmography.map(mapFilmEntry)
        : (Array.isArray(raw.films) ? raw.films.map(mapFilmEntry) : []);

    return {
        // Identity
        stageName: raw.stageName || raw.name || '',
        legalName: raw.legalName || raw.legal_name || raw.legalname || '',
        email: raw.email || '',
        phone: raw.phone || '',
        pronouns: raw.pronouns || '',
        dateOfBirth: raw.dateOfBirth || raw.dob || '',
        profilePhoto: raw.profilePhoto || raw.profile_photo_url || '',

        // Location
        country: raw.country || '',
        currentState: raw.currentState || raw.current_state || '',
        nativeState: raw.nativeState || raw.native_state || '',
        currentCity: raw.currentCity || raw.current_location || '',
        nativeCity: raw.nativeCity || raw.native_location || '',
        nationality: raw.nationality || '',
        languages: raw.languages || '',
        preferredContact: raw.preferredContact || raw.preferred_contact || '',

        // Professional
        primaryRoles: getArray(raw.primaryRoles || raw.roles),
        secondaryRoles: getArray(raw.secondaryRoles),
        customRole: raw.customRole || '',
        customRoleType: raw.customRoleType || null,
        yearsActive: raw.yearsActive || raw.years_active || '',
        preferredGenres: getArray(raw.preferredGenres || raw.genres),
        visualStyle: raw.visualStyle || raw.style || '',
        creativeInfluences: raw.creativeInfluences || raw.influences || '',
        creativePhilosophy: raw.creativePhilosophy || raw.philosophy || '',
        beliefAboutCinema: raw.beliefAboutCinema || raw.belief || '',
        messageOrIntent: raw.messageOrIntent || raw.message || '',
        creativeSignature: raw.creativeSignature || raw.signature || '',
        openToCollaborations: raw.openToCollaborations || raw.open_to_collab || '',
        availability: raw.availability || '',
        preferredWorkLocation: raw.preferredWorkLocation || raw.work_location || '',

        // Filmography
        filmography,

        // Social
        instagram: raw.instagram || '',
        youtube: raw.youtube || '',
        imdb: raw.imdb || '',
        linkedin: raw.linkedin || '',
        twitter: raw.twitter || '',
        facebook: raw.facebook || '',
        website: raw.website || '',
        letterboxd: raw.letterboxd || '',

        // Education
        educationTraining: raw.educationTraining || '', // Fallback for general text
        schooling: raw.schooling || '',
        higherSecondary: raw.higherSecondary || raw.higher_secondary || '',
        undergraduate: raw.undergraduate || '',
        postgraduate: raw.postgraduate || '',
        phd: raw.phd || '',
        certifications: raw.certifications || '',

        // Status
        isComplete: raw.isComplete || false,
        lastUpdated: raw.lastUpdated || raw.updated_at ? new Date(raw.lastUpdated || raw.updated_at) : new Date(),
    };
}

function mapFilmEntry(f: any): FilmographyEntry {
    return {
        id: f.id || Math.random().toString(36).substr(2, 9),
        title: f.title || '',
        year: f.year || '',
        format: f.format || f.project_format || '',
        status: f.status || f.production_status || '',
        primaryRole: f.primaryRole || f.primary_role || f.role || '',
        additionalRoles: Array.isArray(f.additionalRoles) ? f.additionalRoles : (Array.isArray(f.additional_roles) ? f.additional_roles : []),
        crewScale: f.crewScale || f.crew_scale || '',
        genres: Array.isArray(f.genres) ? f.genres : (typeof f.genre === 'string' ? [f.genre] : (Array.isArray(f.genre) ? f.genre : [])),
        synopsis: f.synopsis || '',
        posterUrl: f.posterUrl || f.poster_url || f.poster || '',
        watchLink: f.watchLink || f.link || '',
    };
}

function createEmptyProfileData(): ProfileData {
    return {
        stageName: '',
        email: '',
        country: '',
        primaryRoles: [],
        secondaryRoles: [],
        filmography: [],
        isComplete: false,
        lastUpdated: new Date(),
    };
}
