/**
 * Payment Status Route
 * 
 * Returns current subscription status for the authenticated user.
 * 
 * @module api/v1/payments/status
 */

import { NextResponse } from 'next/server';
import { createSupabaseServerClient, getUser } from '@/lib/supabase-server';
import { logger } from '@/lib/logger';

// ============================================================================
// TYPES
// ============================================================================

interface SubscriptionStatusResponse {
    hasSubscription: boolean;
    isBetaUser: boolean;
    canPublish: boolean;
    status: 'none' | 'active' | 'past_due' | 'cancelled' | 'beta';
    currentEnd?: string;
    gracePeriodEnd?: string;
    planName?: string;
}

// ============================================================================
// ROUTE HANDLER
// ============================================================================

/**
 * GET /api/v1/payments/status
 * 
 * Returns the current subscription status for the authenticated user.
 * 
 * BETA LAUNCH: All users get beta status (free publishing).
 */
export async function GET(): Promise<NextResponse> {
    try {
        const user = await getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // ============================================================
        // BETA LAUNCH: Free publishing for all users
        // Remove this block and uncomment below when enabling payments
        // ============================================================
        const response: SubscriptionStatusResponse = {
            hasSubscription: false,
            isBetaUser: true,
            canPublish: true,
            status: 'beta',
        };
        return NextResponse.json(response);

        /* === PAYMENT VALIDATION CODE (DISABLED FOR BETA) ===
        const supabase = await createSupabaseServerClient();

        // Check if user is a beta user
        // Note: is_beta_user column added via migration, may not be in generated types yet
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_beta_user')
            .eq('id', user.id)
            .single();

        const isBetaUser = (profile as { is_beta_user?: boolean } | null)?.is_beta_user ?? false;

        // Beta users always can publish
        if (isBetaUser) {
            const response: SubscriptionStatusResponse = {
                hasSubscription: false,
                isBetaUser: true,
                canPublish: true,
                status: 'beta',
            };
            return NextResponse.json(response);
        }

        // Get subscription status
        // Note: grace_period_end column added via migration, may not be in generated types yet
        type SubscriptionRow = {
            status: string;
            current_end: string | null;
            grace_period_end: string | null;
            plan_name: string | null;
        };

        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('status, current_end, grace_period_end, plan_name')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle() as { data: SubscriptionRow | null };

        if (!subscription) {
            const response: SubscriptionStatusResponse = {
                hasSubscription: false,
                isBetaUser: false,
                canPublish: false,
                status: 'none',
            };
            return NextResponse.json(response);
        }

        // Determine if user can publish
        let canPublish = false;
        let status: SubscriptionStatusResponse['status'] = 'none';

        if (subscription.status === 'active') {
            canPublish = true;
            status = 'active';
        } else if (subscription.grace_period_end) {
            const graceEnd = new Date(subscription.grace_period_end);
            if (graceEnd > new Date()) {
                canPublish = true;
                status = 'past_due';
            } else {
                status = 'cancelled';
            }
        } else {
            status = subscription.status as SubscriptionStatusResponse['status'];
        }

        const response: SubscriptionStatusResponse = {
            hasSubscription: true,
            isBetaUser: false,
            canPublish,
            status,
            currentEnd: subscription.current_end ?? undefined,
            gracePeriodEnd: subscription.grace_period_end ?? undefined,
            planName: subscription.plan_name ?? undefined,
        };

        return NextResponse.json(response);
        === END PAYMENT VALIDATION CODE === */

    } catch (error) {
        logger.error('ERR_PAY_004', 'Status check failed', undefined, {
            error: String(error),
        });
        return NextResponse.json(
            { error: 'Failed to check status' },
            { status: 500 }
        );
    }
}
