/**
 * Subscription Service
 * 
 * Handles subscription validation, status checks, and beta claiming.
 * Uses Three-Box Sync pattern with PublishingService integration.
 * 
 * @module services/publishing/subscription.service
 */

import { createSupabaseBrowserClient } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ProfileData } from '@/components/profile-features/types';

// ============================================================================
// ERROR CODES
// ============================================================================

export const SubscriptionErrorCodes = {
    ERR_SUBS_001: 'Subscription cancelled after payment failures',
    ERR_SUBS_002: 'Failed to check subscription status',
    ERR_SUBS_003: 'Failed to update subscription',
    ERR_SUBS_004: 'Failed to claim beta subscription',
    ERR_SUBS_005: 'Plan not found',
    WARN_SUBS_FAIL: 'Payment failed, grace period started',
    INF_SUBS_001: 'Beta subscription claim started',
    INF_SUBS_002: 'Beta subscription claimed successfully',
} as const;

export type SubscriptionErrorCode = keyof typeof SubscriptionErrorCodes;

// ============================================================================
// TYPES
// ============================================================================

export type SubscriptionStatus =
    | 'none'
    | 'active'
    | 'past_due'
    | 'cancelled'
    | 'beta';

export interface SubscriptionCheckResult {
    canPublish: boolean;
    status: SubscriptionStatus;
    isBetaUser: boolean;
    gracePeriodEnd?: Date;
    reason?: string;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    display_name: string;
    amount: number;          // In subunits (paise)
    original_amount: number; // For strike-through display
    currency: string;
    interval: 'monthly' | 'yearly';
}

export interface ClaimBetaResult {
    success: boolean;
    filmmakerId?: string;
    subscriptionId?: string;
    error?: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export const subscriptionService = {
    /**
     * Check if user can publish based on subscription status.
     * 
     * BETA LAUNCH: All users can publish for FREE.
     * Payment validation is disabled during beta period.
     */
    async canUserPublish(userId: string): Promise<SubscriptionCheckResult> {
        // BETA LAUNCH: Redirect to plans page for subscription claiming
        // This allows users to go through the beta claim flow
        logger.info('Beta launch: Free publishing enabled for all users', userId);
        return {
            canPublish: true,
            status: 'beta',
            isBetaUser: true,
        };
    },

    /**
     * Fetch all active subscription plans.
     * Used to display pricing on the /plans page.
     */
    async getPlans(): Promise<SubscriptionPlan[]> {
        try {
            const supabase = createSupabaseBrowserClient();

            const { data: plans, error } = await supabase
                .from('subscription_plans')
                .select('*')
                .eq('is_active', true)
                .order('amount', { ascending: true });

            if (error) {
                logger.error('ERR_SUBS_005', 'Failed to fetch plans', undefined, {
                    error: error.message,
                });
                return [];
            }

            return (plans || []).map(p => ({
                id: p.id,
                name: p.name,
                display_name: p.display_name,
                amount: p.amount,
                original_amount: p.original_amount || p.amount,
                currency: p.currency,
                interval: p.interval as 'monthly' | 'yearly',
            }));
        } catch (error) {
            logger.error('ERR_SUBS_005', 'Plans fetch failed', undefined, {
                error: String(error),
            });
            return [];
        }
    },

    /**
     * Claim a free beta subscription and publish the user's profile.
     * 
     * Uses atomic Postgres transaction via claim_beta_and_publish function.
     * This ensures both subscription creation and profile publishing happen together.
     * 
     * @param userId - User UUID
     * @param planId - Plan UUID (from subscription_plans)
     * @param draftData - Profile data to publish
     * @returns Result with filmmaker ID on success
     */
    async claimBetaSubscription(
        userId: string,
        planId: string,
        draftData: ProfileData
    ): Promise<ClaimBetaResult> {
        logger.info('INF_SUBS_001', userId, {
            message: 'Beta subscription claim started',
            planId,
        });

        try {
            const supabase = createSupabaseBrowserClient();

            // Call atomic Postgres function
            const { data: filmmakerId, error } = await supabase.rpc(
                'claim_beta_and_publish',
                {
                    p_user_id: userId,
                    p_plan_id: planId,
                    p_draft_data: draftData,
                }
            );

            if (error) {
                logger.error('ERR_SUBS_004', 'Beta claim failed', userId, {
                    error: error.message,
                    planId,
                });
                return {
                    success: false,
                    error: error.message || 'Failed to claim subscription',
                };
            }

            logger.info('INF_SUBS_002', userId, {
                message: 'Beta subscription claimed successfully',
                filmmakerId,
                planId,
            });

            // Log the auto-publish success
            logger.info('INF_PUB_001', userId, {
                message: 'Profile auto-published after beta claim',
                filmmakerId,
            });

            return {
                success: true,
                filmmakerId: filmmakerId as string,
            };

        } catch (error) {
            logger.error('ERR_SUBS_004', 'Beta claim exception', userId, {
                error: String(error),
            });
            return {
                success: false,
                error: 'An unexpected error occurred',
            };
        }
    },

    /**
     * Get user's current subscription status.
     */
    async getUserSubscription(userId: string): Promise<{
        hasSubscription: boolean;
        status: SubscriptionStatus;
        planName?: string;
        currentEnd?: Date;
    }> {
        try {
            const supabase = createSupabaseBrowserClient();

            const { data: subscription, error } = await supabase
                .from('subscriptions')
                .select(`
                    status,
                    current_end,
                    subscription_plans (
                        name,
                        display_name
                    )
                `)
                .eq('user_id', userId)
                .maybeSingle();

            if (error || !subscription) {
                return {
                    hasSubscription: false,
                    status: 'none',
                };
            }

            // Handle the joined relation (can be array or object depending on query)
            const subData = subscription as {
                status: string;
                current_end: string | null;
                subscription_plans: { name: string; display_name: string } | { name: string; display_name: string }[] | null;
            };

            const planData = Array.isArray(subData.subscription_plans)
                ? subData.subscription_plans[0]
                : subData.subscription_plans;

            return {
                hasSubscription: true,
                status: subData.status as SubscriptionStatus,
                planName: planData?.display_name || planData?.name,
                currentEnd: subData.current_end ? new Date(subData.current_end) : undefined,
            };
        } catch (error) {
            logger.error('ERR_SUBS_002', 'Subscription fetch failed', userId, {
                error: String(error),
            });
            return {
                hasSubscription: false,
                status: 'none',
            };
        }
    },
};
