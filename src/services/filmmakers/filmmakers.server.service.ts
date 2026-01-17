/**
 * Filmmakers Server Service
 * 
 * Server-side only service for fetching filmmaker data.
 * Used by Server Components to maintain Three Box Rule compliance.
 * 
 * @module services/filmmakers/filmmakers.server.service
 */

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { Database } from '@/lib/supabase';
import { logger } from '@/lib/logger';

type FilmmakerRow = Database['public']['Tables']['filmmakers']['Row'];

// ============================================================================
// SERVER SERVICE CLASS
// ============================================================================

/**
 * Server-side service for filmmaker queries.
 * Uses server Supabase client for secure data access.
 */
export const filmmakersServerService = {
    /**
     * Get a filmmaker by ID.
     * 
     * @param id - Filmmaker UUID
     * @returns Filmmaker data or null if not found
     */
    async getById(id: string): Promise<FilmmakerRow | null> {
        try {
            const supabase = await createSupabaseServerClient();
            const { data, error } = await supabase
                .from('filmmakers')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                logger.error('ERR_DB_002', 'Failed to fetch filmmaker by ID', undefined, {
                    filmmakerId: id,
                    error: error.message
                });
                return null;
            }

            return data;
        } catch (error) {
            logger.error('ERR_DB_001', 'Database connection failed', undefined, {
                error: String(error)
            });
            return null;
        }
    },

    /**
     * Get a filmmaker by user ID.
     * 
     * @param userId - User UUID
     * @returns Filmmaker data or null if not found
     */
    async getByUserId(userId: string): Promise<FilmmakerRow | null> {
        try {
            const supabase = await createSupabaseServerClient();
            const { data, error } = await supabase
                .from('filmmakers')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
                logger.error('ERR_DB_002', 'Failed to fetch filmmaker by user ID', userId, {
                    error: error.message
                });
            }

            return data || null;
        } catch (error) {
            logger.error('ERR_DB_001', 'Database connection failed', userId, {
                error: String(error)
            });
            return null;
        }
    },

    /**
     * Get featured/published filmmakers for homepage.
     * 
     * @param limit - Maximum number to return (default 8)
     * @returns Array of published filmmakers with AI bios
     */
    async getFeatured(limit: number = 8): Promise<FilmmakerRow[]> {
        try {
            const supabase = await createSupabaseServerClient();
            const { data, error } = await supabase
                .from('filmmakers')
                .select('*')
                .eq('status', 'published')
                // .not('ai_generated_bio', 'is', null) // Removed to show new profiles
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                logger.error('ERR_DB_002', 'Failed to fetch featured filmmakers', undefined, {
                    error: error.message
                });
                return [];
            }

            return data || [];
        } catch (error) {
            logger.error('ERR_DB_001', 'Database connection failed', undefined, {
                error: String(error)
            });
            return [];
        }
    },

    /**
     * Get user subscription status.
     * 
     * @param userId - User UUID
     * @returns Active subscription or null
     */
    async getUserSubscription(userId: string) {
        try {
            const supabase = await createSupabaseServerClient();
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'active')
                .single();

            if (error && error.code !== 'PGRST116') {
                logger.error('ERR_DB_002', 'Failed to fetch subscription', userId, {
                    error: error.message
                });
            }

            return data || null;
        } catch (error) {
            logger.error('ERR_DB_001', 'Database connection failed', userId, {
                error: String(error)
            });
            return null;
        }
    },
};
