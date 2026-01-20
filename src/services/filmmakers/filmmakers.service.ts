/**
 * Filmmakers Service
 * 
 * Handles all business logic for filmmaker profile operations.
 * Implements Three Box Rule: UI components should not contain data-fetching logic.
 * 
 * @module services/filmmakers
 * @see https://github.com/CineGrok-admin005/cinegrok
 */

import { createSupabaseBrowserClient } from '@/lib/supabase';
import { ProfileData } from '@/components/profile-features/types';
import { mapDatabaseToProfileData } from '@/lib/mappers';
import { sanitizeInput, sanitizeObject } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

// ============================================================================
// ERROR CODES
// ============================================================================

/**
 * Error codes for filmmaker service operations.
 * Format: ERR_[DOMAIN]_[NUMBER] - [Description]
 */
export const FilmmakerErrorCodes = {
    ERR_PROFILE_001: 'Failed to load profile data',
    ERR_PROFILE_002: 'User not authenticated',
    ERR_PROFILE_003: 'Failed to save profile',
    ERR_PROFILE_004: 'Failed to delete draft',
    ERR_PROFILE_005: 'Invalid profile data',
    ERR_DB_001: 'Database connection failed',
    ERR_DB_002: 'Database query failed',
} as const;

export type FilmmakerErrorCode = keyof typeof FilmmakerErrorCodes;

/**
 * Custom error class for filmmaker service operations.
 * Includes error code for structured logging.
 */
export class FilmmakerServiceError extends Error {
    constructor(
        public code: FilmmakerErrorCode,
        message?: string,
        public originalError?: unknown
    ) {
        super(message || FilmmakerErrorCodes[code]);
        this.name = 'FilmmakerServiceError';
    }
}

// ============================================================================
// TYPES
// ============================================================================

/**
 * Result of loading a profile - either existing profile or draft
 */
export interface LoadProfileResult {
    /** The profile data mapped to ProfileData format */
    data: Partial<ProfileData>;
    /** Draft ID if loading from draft (needed for cleanup after publish) */
    draftId: string | null;
    /** Whether this is an existing published profile or a draft */
    source: 'filmmaker' | 'draft' | 'none';
}

/**
 * Result of publishing a profile
 */
export interface PublishProfileResult {
    /** The filmmaker's UUID */
    filmmakerId: string;
    /** Whether this was a new profile or an update */
    isNew: boolean;
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

/**
 * Service for managing filmmaker profiles.
 * 
 * Provides methods for loading, saving, and publishing filmmaker profiles.
 * Uses Supabase as the backend but abstracts away the implementation details.
 * 
 * @example
 * const service = new FilmmakersService();
 * const { data, draftId } = await service.loadProfile(userId);
 */
export class FilmmakersService {
    private supabase = createSupabaseBrowserClient();

    /**
     * Loads profile data for the authenticated user.
     * First checks for an existing published filmmaker profile.
     * Falls back to the most recent draft if no published profile exists.
     * 
     * @param userId - The authenticated user's UUID
     * @returns Profile data, draft ID (if applicable), and source indicator
     * @throws {FilmmakerServiceError} ERR_PROFILE_001 if database query fails
     * @throws {FilmmakerServiceError} ERR_DB_001 if connection fails
     * 
     * @example
     * const { data, draftId, source } = await service.loadProfile('uuid-123');
     * if (source === 'none') {
     *   // User has no existing profile or draft
     * }
     */
    async loadProfile(userId: string): Promise<LoadProfileResult> {
        try {
            // 1. Check for existing published filmmaker profile
            const { data: filmmaker, error: fError } = await this.supabase
                .from('filmmakers')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (filmmaker && filmmaker.raw_form_data) {
                return {
                    data: mapDatabaseToProfileData(filmmaker.raw_form_data),
                    draftId: null,
                    source: 'filmmaker',
                };
            }

            // 2. Check for draft (most recent)
            const { data: draft, error: dError } = await this.supabase
                .from('profile_drafts')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();

            if (draft) {
                return {
                    data: draft.draft_data as Partial<ProfileData>,
                    draftId: draft.id,
                    source: 'draft',
                };
            }

            // 3. No existing data
            return {
                data: {},
                draftId: null,
                source: 'none',
            };

        } catch (error) {
            logger.error('ERR_PROFILE_001', 'Failed to load profile', userId, { error: String(error) });
            throw new FilmmakerServiceError('ERR_PROFILE_001', undefined, error);
        }
    }

    /**
     * Publishes a filmmaker profile to the database.
     * Creates a new profile or updates an existing one.
     * Also links the filmmaker ID to the user's profile and cleans up any draft.
     * 
     * @param userId - The authenticated user's UUID
     * @param data - The complete profile data from the wizard
     * @param draftId - Optional draft ID to delete after successful publish
     * @returns The filmmaker ID and whether this was a new profile
     * @throws {FilmmakerServiceError} ERR_PROFILE_003 if save fails
     * @throws {FilmmakerServiceError} ERR_PROFILE_005 if data is invalid
     * 
     * @example
     * const { filmmakerId, isNew } = await service.publishProfile(
     *   userId, 
     *   formData,
     *   draftId
     * );
     */
    async publishProfile(
        userId: string,
        data: ProfileData,
        draftId?: string | null
    ): Promise<PublishProfileResult> {
        try {
            // Sanitize user input before saving
            const sanitizedData = sanitizeObject(data as unknown as Record<string, unknown>) as unknown as ProfileData;

            // Check if profile already exists
            const { data: existingFilmmaker } = await this.supabase
                .from('filmmakers')
                .select('id')
                .eq('user_id', userId)
                .single();

            let filmmakerId = existingFilmmaker?.id;
            const isNew = !filmmakerId;

            // Build the payload with sanitized data
            const payload = this.buildFilmmakerPayload(userId, sanitizedData, isNew);

            if (filmmakerId) {
                // Update existing profile
                const { error } = await this.supabase
                    .from('filmmakers')
                    .update({
                        ...payload,
                        profile_url: undefined, // Don't change URL on update
                    })
                    .eq('id', filmmakerId);

                if (error) {
                    throw new FilmmakerServiceError('ERR_PROFILE_003', error.message, error);
                }
            } else {
                // Insert new profile
                const { data: newProfile, error } = await this.supabase
                    .from('filmmakers')
                    .insert([payload])
                    .select('id')
                    .single();

                if (error) {
                    throw new FilmmakerServiceError('ERR_PROFILE_003', error.message, error);
                }
                filmmakerId = newProfile.id;
            }

            // Link filmmaker to user profile
            await this.supabase
                .from('profiles')
                .update({ filmmaker_id: filmmakerId })
                .eq('id', userId);

            // Clean up draft if provided
            if (draftId) {
                await this.deleteDraft(draftId);
            }

            return { filmmakerId, isNew };

        } catch (error) {
            if (error instanceof FilmmakerServiceError) {
                throw error;
            }
            logger.error('ERR_PROFILE_003', 'Failed to publish profile', userId, { error: String(error) });
            throw new FilmmakerServiceError('ERR_PROFILE_003', undefined, error);
        }
    }

    /**
     * Deletes a profile draft by ID.
     * 
     * @param draftId - The draft UUID to delete
     * @throws {FilmmakerServiceError} ERR_PROFILE_004 if deletion fails
     */
    async deleteDraft(draftId: string): Promise<void> {
        try {
            const { error } = await this.supabase
                .from('profile_drafts')
                .delete()
                .eq('id', draftId);

            if (error) {
                throw new FilmmakerServiceError('ERR_PROFILE_004', error.message, error);
            }
        } catch (error) {
            if (error instanceof FilmmakerServiceError) {
                throw error;
            }
            logger.error('ERR_PROFILE_004', 'Failed to delete draft', undefined, { draftId, error: String(error) });
            throw new FilmmakerServiceError('ERR_PROFILE_004', undefined, error);
        }
    }

    /**
     * Saves profile data as a draft for later publishing.
     * Creates or updates the user's draft in profile_drafts table.
     * 
     * @param userId - The authenticated user's UUID
     * @param data - The profile data to save as draft
     * @returns The draft ID
     * @throws {FilmmakerServiceError} ERR_PROFILE_003 if save fails
     */
    async saveDraft(userId: string, data: Partial<ProfileData>): Promise<string> {
        console.log('[FilmmakersService] saveDraft called for user:', userId);
        try {
            // Check if draft already exists for this user
            console.log('[FilmmakersService] Checking for existing draft...');
            const { data: existingDraft, error: selectError } = await this.supabase
                .from('profile_drafts')
                .select('id')
                .eq('user_id', userId)
                .single();

            console.log('[FilmmakersService] Existing draft check result:', { existingDraft, selectError });

            if (existingDraft) {
                // Update existing draft
                console.log('[FilmmakersService] Updating existing draft:', existingDraft.id);
                const { error: updateError } = await this.supabase
                    .from('profile_drafts')
                    .update({
                        draft_data: data,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', existingDraft.id);

                if (updateError) {
                    console.error('[FilmmakersService] Update error:', updateError);
                    throw new FilmmakerServiceError('ERR_PROFILE_003', updateError.message, updateError);
                }

                console.log('[FilmmakersService] Draft updated successfully');
                return existingDraft.id;
            } else {
                // Create new draft
                console.log('[FilmmakersService] Creating new draft...');
                const { data: newDraft, error } = await this.supabase
                    .from('profile_drafts')
                    .insert({
                        user_id: userId,
                        draft_data: data,
                        step: 6, // Default to final step for publish flow
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                    .select('id')
                    .single();

                console.log('[FilmmakersService] Insert result:', { newDraft, error });

                if (error) {
                    console.error('[FilmmakersService] Insert error:', error);
                    throw new FilmmakerServiceError('ERR_PROFILE_003', error.message, error);
                }

                console.log('[FilmmakersService] New draft created with ID:', newDraft.id);
                return newDraft.id;
            }
        } catch (error) {
            console.error('[FilmmakersService] saveDraft exception:', error);
            if (error instanceof FilmmakerServiceError) {
                throw error;
            }
            logger.error('ERR_PROFILE_003', 'Failed to save draft', userId, { error: String(error) });
            throw new FilmmakerServiceError('ERR_PROFILE_003', 'Failed to save draft', error);
        }
    }

    /**
     * Gets the current authenticated user.
     * 
     * @returns The user object or null if not authenticated
     * @throws {FilmmakerServiceError} ERR_DB_001 if auth check fails
     */
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            if (error) {
                throw new FilmmakerServiceError('ERR_DB_001', error.message, error);
            }
            return user;
        } catch (error) {
            if (error instanceof FilmmakerServiceError) {
                throw error;
            }
            logger.error('ERR_DB_001', 'Auth check failed', undefined, { error: String(error) });
            throw new FilmmakerServiceError('ERR_DB_001', undefined, error);
        }
    }

    // ========================================================================
    // PRIVATE HELPERS
    // ========================================================================

    /**
     * Builds the database payload from ProfileData.
     * Maps camelCase form fields to snake_case database columns.
     * 
     * @param userId - User's UUID
     * @param data - Sanitized profile data
     * @param isNew - Whether this is a new profile (affects profile_url generation)
     * @returns Database-ready payload object
     */
    private buildFilmmakerPayload(
        userId: string,
        data: ProfileData,
        isNew: boolean
    ): Record<string, unknown> {
        const basePayload = {
            user_id: userId,
            name: sanitizeInput(data.stageName) || 'Unnamed Filmmaker',

            // Identity
            stage_name: sanitizeInput(data.stageName),
            legal_name: sanitizeInput(data.legalName),
            email: data.email, // Email validated by Supabase Auth
            pronouns: sanitizeInput(data.pronouns),
            phone: data.phone,

            // Location
            nationality: sanitizeInput(data.nationality),
            country: sanitizeInput(data.country),
            current_city: sanitizeInput(data.currentCity),
            current_state: sanitizeInput(data.currentState),
            native_city: sanitizeInput(data.nativeCity),
            native_state: sanitizeInput(data.nativeState),
            languages: data.languages,
            preferred_contact: sanitizeInput(data.preferredContact),

            // Professional
            primary_roles: data.primaryRoles,
            secondary_roles: data.secondaryRoles,
            years_active: sanitizeInput(data.yearsActive),
            preferred_genres: data.preferredGenres,
            visual_style: sanitizeInput(data.visualStyle),
            creative_influences: sanitizeInput(data.creativeInfluences),
            creative_philosophy: sanitizeInput(data.creativePhilosophy),
            belief_about_cinema: sanitizeInput(data.beliefAboutCinema),
            message_intent: sanitizeInput(data.messageOrIntent),
            creative_signature: sanitizeInput(data.creativeSignature),
            open_to_collaborations: sanitizeInput(data.openToCollaborations),
            availability: sanitizeInput(data.availability),
            preferred_work_location: sanitizeInput(data.preferredWorkLocation),

            // Raw data for flexible fields
            raw_form_data: data,
            generated_bio: '',
            status: 'published',
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Only generate profile_url for new profiles
        if (isNew) {
            const slug = (data.stageName || 'user')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            return {
                ...basePayload,
                profile_url: `${slug}-${Date.now()}`,
            };
        }

        return basePayload;
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Singleton instance for use in client components.
 * Import this in your components rather than creating new instances.
 * 
 * @example
 * import { filmmakersService } from '@/services/filmmakers';
 * const profile = await filmmakersService.loadProfile(userId);
 */
export const filmmakersService = new FilmmakersService();
