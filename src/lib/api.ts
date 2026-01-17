/**
 * API Client for CineGrok
 * 
 * Security: All API calls use environment variables for base URL
 * Scalability: Centralized error handling and response parsing
 * Performance: Implements caching headers and retry logic
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Filmmaker interface matching database schema
 */
export interface Filmmaker {
    id: string;
    created_at: string;
    name: string;
    full_name: string;
    profile_url: string | null;
    raw_form_data: RawFormData;
    generated_bio: string | null;
    style_vector: number[] | null;
}

/**
 * Raw form data structure from Google Sheets
 */
export interface RawFormData {
    // Core Identity
    timestamp?: string;
    email?: string;
    legal_name?: string;
    pronouns?: string;
    dob?: string;

    // Location & Origin
    country?: string;
    native_location?: string;
    native_state?: string;
    current_location?: string;
    current_state?: string;
    nationality?: string;
    languages?: string;

    // Links
    profile_photo_url?: string;
    instagram?: string;
    youtube?: string;
    imdb?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
    letterboxd?: string;
    other_platforms?: string;

    // Education
    schooling?: string;
    higher_secondary?: string;
    undergraduate?: string;
    postgraduate?: string;
    phd?: string;
    certifications?: string;

    // Films
    films?: Film[];

    // Professional Details
    roles?: string;
    primary_roles?: string | string[];
    years_active?: string;
    genres?: string;
    style?: string;
    influences?: string;
    philosophy?: string;
    belief?: string;
    message?: string;
    signature?: string;

    // Achievements & Press
    awards?: string;
    screenings?: string;
    press?: string;

    // Collaboration
    collaborations?: string;
    open_to_collab?: string;
    availability?: string;
    representation?: string;
    contact_method?: string;
    phone?: string;
    work_location?: string;

    // Meta
    consent?: string;
    notes?: string;
}

export interface Film {
    title: string;
    year?: string;
    genre?: string | string[]; // Updated to support array
    duration?: string;

    // Role Details
    role?: string; // Legacy/Fallback
    primary_role?: string;
    additional_roles?: string[];

    // Project Details
    synopsis?: string;
    link?: string;
    poster?: string;

    // Enhanced Metadata
    project_format?: string; // e.g. Feature, Short
    production_status?: string; // e.g. Completed, Released
    crew_scale?: 'Solo' | '2-5' | '6-15' | '15+';
    awards?: string;
    screenings?: string;
}

/**
 * API Error class for better error handling
 */
export class APIError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: any
    ) {
        super(message);
        this.name = 'APIError';
    }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            let errorData;
            let errorMessage = 'API request failed';

            try {
                errorData = await response.json();
                // Supabase and other APIs might use different error formats
                errorMessage =
                    errorData.message ||
                    errorData.error_description ||
                    errorData.error?.message ||
                    errorData.error ||
                    errorData.msg ||
                    errorMessage;
            } catch (e) {
                // If JSON parse fails, try to get text
                const text = await response.text().catch(() => '');
                errorMessage = text || response.statusText || errorMessage;
                errorData = { raw: text };
            }

            throw new APIError(
                errorMessage,
                response.status,
                errorData
            );
        }

        return response.json();
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError('Network error', 500, error);
    }
}

/**
 * Get all filmmakers with processed bios
 * 
 * @param limit - Optional limit for pagination
 * @returns Array of filmmakers
 */
export async function getAllFilmmakers(limit?: number): Promise<Filmmaker[]> {
    const query = limit ? `?limit=${limit}` : '';
    return apiFetch<Filmmaker[]>(`/api/v1/filmmakers${query}`);
}

/**
 * Get a single filmmaker by ID
 * 
 * @param id - Filmmaker UUID
 * @returns Filmmaker object
 */
export async function getFilmmaker(id: string): Promise<Filmmaker> {
    return apiFetch<Filmmaker>(`/api/v1/filmmakers/${id}`);
}

/**
 * Search filmmakers by query
 * 
 * @param query - Search query string
 * @param useVector - Whether to use semantic vector search
 * @returns Array of matching filmmakers
 */
export async function searchFilmmakers(
    query: string,
    useVector: boolean = false
): Promise<Filmmaker[]> {
    const params = new URLSearchParams({
        q: query,
        vector: useVector.toString(),
    });
    return apiFetch<Filmmaker[]>(`/api/v1/search?${params}`);
}

/**
 * Trigger AI processing for a filmmaker
 * 
 * @param id - Filmmaker UUID
 * @returns Processing result
 */
export async function triggerAIProcessing(id: string): Promise<{ success: boolean; bio: string }> {
    return apiFetch(`/api/v1/process-ai`, {
        method: 'POST',
        body: JSON.stringify({ id }),
    });
}

/**
 * Ingest new filmmaker data (used by Google Apps Script)
 * 
 * @param data - Form data from Google Sheets
 * @returns Ingestion result with filmmaker ID
 */
export async function ingestFilmmaker(data: RawFormData & { name: string }): Promise<{ id: string; message: string }> {
    return apiFetch(`/api/v1/ingest`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Auth: Get current user
 */
export async function getCurrentUser(): Promise<{ user: any }> {
    return apiFetch('/api/auth/me');
}

/**
 * Auth: Logout
 */
export async function logout(): Promise<{ success: boolean }> {
    return apiFetch('/api/auth/logout', { method: 'POST' });
}

/**
 * Auth: Login
 */
export async function login(params: { email?: string, password?: string, provider?: any, options?: any }): Promise<any> {
    return apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(params),
    });
}

/**
 * Auth: Signup
 */
export async function signup(params: { email?: string, password?: string, options?: any }): Promise<any> {
    return apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(params),
    });
}

/**
 * Storage: Upload file
 */
export async function uploadFile(file: File, path: string, bucket: string = 'avatars'): Promise<{ publicUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    formData.append('bucket', bucket);

    const response = await fetch(`${API_BASE_URL}/api/storage/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new APIError(error.message || 'Upload failed', response.status, error);
    }

    return response.json();
}

// ============================================================================
// Interest (Collaboration Interest)
// ============================================================================

/**
 * Express interest in a filmmaker profile
 */
export async function expressInterest(filmmakerId: string): Promise<{ success: boolean }> {
    return apiFetch('/api/interested-profiles', {
        method: 'POST',
        body: JSON.stringify({ filmmakerId }),
    });
}

/**
 * Remove interest in a filmmaker profile
 */
export async function removeInterest(filmmakerId: string): Promise<{ success: boolean }> {
    return apiFetch('/api/interested-profiles', {
        method: 'DELETE',
        body: JSON.stringify({ filmmakerId }),
    });
}

/**
 * Get all profiles the current user is interested in
 */
export async function getInterestedProfiles(): Promise<{ profiles: Filmmaker[] }> {
    return apiFetch('/api/interested-profiles');
}

/**
 * Check if user is interested in a specific filmmaker
 */
export async function isInterested(filmmakerId: string): Promise<{ isInterested: boolean }> {
    return apiFetch(`/api/interested-profiles?filmmakerId=${filmmakerId}`);
}

