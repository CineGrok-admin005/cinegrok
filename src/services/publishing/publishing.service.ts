/**
 * Publishing Service
 * 
 * Handles the Draft-to-Live sync mechanism for filmmaker profiles.
 * Integrates with SubscriptionService for payment validation.
 * 
 * @module services/publishing/publishing.service
 */

import { createSupabaseBrowserClient } from '@/lib/supabase';
import { sanitizeObject } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { subscriptionService, SubscriptionCheckResult } from './subscription.service';
import { ProfileData } from '@/components/profile-features/types';

// ============================================================================
// ERROR CODES
// ============================================================================

/**
 * Error codes for publishing operations.
 */
export const PublishingErrorCodes = {
    INF_PUB_001: 'Profile published successfully',
    INF_PUB_002: 'Draft created from live profile',
    ERR_PUB_001: 'Publish transaction failed',
    ERR_PUB_002: 'Draft not found',
    ERR_PUB_003: 'Not authorized to publish',
} as const;

export type PublishingErrorCode = keyof typeof PublishingErrorCodes;

/**
 * Custom error class for publishing operations.
 */
export class PublishingError extends Error {
    constructor(
        public code: PublishingErrorCode,
        message?: string,
        public originalError?: unknown
    ) {
        super(message || PublishingErrorCodes[code]);
        this.name = 'PublishingError';
    }
}

// ============================================================================
// TYPES
// ============================================================================

/**
 * Result of a publish operation.
 */
export interface PublishResult {
    /** Whether publish was successful */
    success: boolean;
    /** Filmmaker profile ID */
    filmmakerId?: string;
    /** Version number after publish */
    version?: number;
    /** Error message if failed */
    error?: string;
}

/**
 * Result of checking publish eligibility.
 */
export interface CanPublishResult {
    /** Whether user can publish */
    allowed: boolean;
    /** Reason if not allowed */
    reason?: string;
    /** Subscription status details */
    subscription: SubscriptionCheckResult;
}

// ============================================================================
// SERVICE
// ============================================================================

/**
 * Publishing service for Draft-to-Live sync.
 */
export const publishingService = {
    /**
     * Check if user can publish their profile.
     * Validates subscription status and beta eligibility.
     * 
     * @param userId - User UUID
     * @returns Whether publishing is allowed
     * 
     * @example
     * const { allowed, reason } = await publishingService.canPublish(userId);
     * if (!allowed) showPaywallModal(reason);
     */
    async canPublish(userId: string): Promise<CanPublishResult> {
        const subscription = await subscriptionService.canUserPublish(userId);

        return {
            allowed: subscription.canPublish,
            reason: subscription.reason,
            subscription,
        };
    },

    /**
     * Publish draft data to live profile.
     * Uses atomic Postgres transaction for safety.
     * Sanitizes all data before publishing.
     * 
     * @param userId - User UUID
     * @param draftData - Profile data from draft (will be sanitized)
     * @returns Publish result with filmmaker ID
     * @throws {PublishingError} ERR_PUB_001 if transaction fails
     * @throws {PublishingError} ERR_PUB_003 if not authorized
     * 
     * @example
     * try {
     *   const result = await publishingService.publishDraft(userId, draftData);
     *   if (result.success) {
     *     router.push(`/filmmakers/${result.filmmakerId}`);
     *   }
     * } catch (error) {
     *   if (error.code === 'ERR_PUB_003') showPaywall();
     * }
     */
    async publishDraft(userId: string, draftData: ProfileData): Promise<PublishResult> {
        try {
            // Sanitize all user input before publishing
            const sanitizedData = sanitizeObject(draftData as unknown as Record<string, unknown>);

            const supabase = createSupabaseBrowserClient();

            // Call atomic transaction function
            const { data, error } = await supabase.rpc('publish_profile_transaction', {
                p_user_id: userId,
                p_draft_data: sanitizedData,
            });

            if (error) {
                // Check for subscription error
                if (error.message.includes('No active subscription')) {
                    throw new PublishingError('ERR_PUB_003', error.message, error);
                }
                throw new PublishingError('ERR_PUB_001', error.message, error);
            }

            const filmmakerId = data as string;

            // Get version number
            const { data: filmmaker } = await supabase
                .from('filmmakers')
                .select('version')
                .eq('id', filmmakerId)
                .single();

            logger.info('Profile published successfully', userId, {
                code: 'INF_PUB_001',
                filmmakerId,
                version: filmmaker?.version,
            });

            return {
                success: true,
                filmmakerId,
                version: filmmaker?.version,
            };

        } catch (error) {
            if (error instanceof PublishingError) {
                logger.error(error.code, error.message, userId, {
                    error: String(error.originalError),
                });
                return {
                    success: false,
                    error: error.message,
                };
            }

            logger.error('ERR_PUB_001', 'Publish transaction failed', userId, {
                error: String(error),
            });

            return {
                success: false,
                error: 'Failed to publish profile. Please try again.',
            };
        }
    },

    /**
     * Get current draft data for a user.
     * 
     * @param userId - User UUID
     * @returns Draft data or null if no draft exists
     */
    async getDraft(userId: string): Promise<ProfileData | null> {
        try {
            const supabase = createSupabaseBrowserClient();

            const { data: draft, error } = await supabase
                .from('profile_drafts')
                .select('draft_data')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) {
                logger.error('ERR_PUB_002', 'Failed to fetch draft', userId, {
                    error: error.message,
                });
                return null;
            }

            return draft?.draft_data as ProfileData || null;
        } catch (error) {
            logger.error('ERR_PUB_002', 'Draft fetch failed', userId, {
                error: String(error),
            });
            return null;
        }
    },

    /**
     * Check if user has unpublished changes.
     * Compares draft version with live version.
     * 
     * @param userId - User UUID
     * @returns Whether there are unpublished changes
     */
    async hasUnpublishedChanges(userId: string): Promise<boolean> {
        try {
            const supabase = createSupabaseBrowserClient();

            // Get draft last_saved_at
            const { data: draft } = await supabase
                .from('profile_drafts')
                .select('updated_at')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            // Get live last_synced_at
            const { data: filmmaker } = await supabase
                .from('filmmakers')
                .select('last_synced_at')
                .eq('user_id', userId)
                .maybeSingle();

            if (!draft || !filmmaker) return false;

            const draftTime = new Date(draft.updated_at).getTime();
            const liveTime = new Date(filmmaker.last_synced_at).getTime();

            return draftTime > liveTime;
        } catch (error) {
            logger.error('ERR_PUB_002', 'Failed to check unpublished changes', userId, {
                error: String(error),
            });
            return false;
        }
    },

    /**
     * Unpublish a profile (soft delete).
     * Profile data is preserved for potential reactivation.
     * 
     * @param userId - User UUID
     * @param reason - Reason for unpublishing
     */
    async unpublishProfile(userId: string, reason: string): Promise<void> {
        try {
            const supabase = createSupabaseBrowserClient();

            await supabase
                .from('filmmakers')
                .update({
                    is_published: false,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId);

            logger.info('Profile unpublished', userId, { reason });
        } catch (error) {
            logger.error('ERR_PUB_001', 'Unpublish failed', userId, {
                error: String(error),
            });
        }
    },
};
