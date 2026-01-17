/**
 * Subscription Service
 * 
 * Handles subscription validation and status checks for CLIENT-SIDE use.
 * Server-side payment handling is done directly in webhook handlers.
 * 
 * @module services/publishing/subscription.service
 */

import { createSupabaseBrowserClient } from '@/lib/supabase';
import { logger } from '@/lib/logger';

// ============================================================================
// ERROR CODES
// ============================================================================

/**
 * Error codes for subscription operations.
 */
export const SubscriptionErrorCodes = {
    ERR_SUBS_001: 'Subscription cancelled after payment failures',
    ERR_SUBS_002: 'Failed to check subscription status',
    ERR_SUBS_003: 'Failed to update subscription',
    WARN_SUBS_FAIL: 'Payment failed, grace period started',
} as const;

export type SubscriptionErrorCode = keyof typeof SubscriptionErrorCodes;

// ============================================================================
// TYPES
// ============================================================================

/**
 * Subscription status types.
 */
export type SubscriptionStatus =
    | 'none'
    | 'active'
    | 'past_due'
    | 'cancelled'
    | 'beta';

/**
 * Result of subscription validation.
 */
export interface SubscriptionCheckResult {
    /** Whether user can publish */
    canPublish: boolean;
    /** Current subscription status */
    status: SubscriptionStatus;
    /** Is user on beta (bypasses payment) */
    isBetaUser: boolean;
    /** If past_due, when grace period ends */
    gracePeriodEnd?: Date;
    /** Reason if cannot publish */
    reason?: string;
}

// ============================================================================
// SERVICE (Client-side only)
// ============================================================================

/**
 * Subscription service for checking payment status.
 * NOTE: This service is for CLIENT-SIDE use only.
 * Server-side payment failure handling is in the webhook handler.
 */
export const subscriptionService = {
    /**
     * Check if user can publish based on subscription status.
     * 
     * BETA LAUNCH: All users can publish for FREE.
     * Payment validation is disabled during beta period.
     * 
     * @param userId - User UUID
     * @returns Subscription check result
     */
    async canUserPublish(userId: string): Promise<SubscriptionCheckResult> {
        // ============================================================
        // BETA LAUNCH: Free publishing for all users
        // Remove this block and uncomment below when enabling payments
        // ============================================================
        logger.info('Beta launch: Free publishing enabled for all users', userId);
        return {
            canPublish: true,
            status: 'beta',
            isBetaUser: true,
        };

        /* === PAYMENT VALIDATION CODE (DISABLED FOR BETA) ===
        try {
            const supabase = createSupabaseBrowserClient();

            // Check if user is a beta user
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('is_beta_user')
                .eq('id', userId)
                .single();

            if (profileError) {
                logger.error('ERR_SUBS_002', 'Failed to check profile', userId, {
                    error: profileError.message
                });
                return {
                    canPublish: false,
                    status: 'none',
                    isBetaUser: false,
                    reason: 'Could not verify account status',
                };
            }

            // Beta users can always publish
            if (profile?.is_beta_user) {
                logger.info('Subscription check bypassed for beta user', userId);
                return {
                    canPublish: true,
                    status: 'beta',
                    isBetaUser: true,
                };
            }

            // Check subscription status
            const { data: subscription, error: subError } = await supabase
                .from('subscriptions')
                .select('status, current_end, grace_period_end')
                .eq('user_id', userId)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (subError) {
                logger.error('ERR_SUBS_002', 'Failed to check subscription', userId, {
                    error: subError.message
                });
                return {
                    canPublish: false,
                    status: 'none',
                    isBetaUser: false,
                    reason: 'Could not verify subscription status',
                };
            }

            // No subscription found
            if (!subscription) {
                return {
                    canPublish: false,
                    status: 'none',
                    isBetaUser: false,
                    reason: 'No active subscription. Subscribe to publish your profile.',
                };
            }

            // Active subscription
            if (subscription.status === 'active') {
                return {
                    canPublish: true,
                    status: 'active',
                    isBetaUser: false,
                };
            }

            // Check grace period
            if (subscription.grace_period_end) {
                const graceEnd = new Date(subscription.grace_period_end);
                if (graceEnd > new Date()) {
                    return {
                        canPublish: true,
                        status: 'past_due',
                        isBetaUser: false,
                        gracePeriodEnd: graceEnd,
                    };
                }
            }

            // Subscription expired
            return {
                canPublish: false,
                status: 'cancelled',
                isBetaUser: false,
                reason: 'Your subscription has expired. Renew to publish.',
            };

        } catch (error) {
            logger.error('ERR_SUBS_002', 'Subscription check failed', userId, {
                error: String(error)
            });
            return {
                canPublish: false,
                status: 'none',
                isBetaUser: false,
                reason: 'Error checking subscription status',
            };
        }
        === END PAYMENT VALIDATION CODE === */
    },
};

