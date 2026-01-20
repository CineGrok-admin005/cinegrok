/**
 * Razorpay Webhook Handler
 * 
 * Handles Razorpay subscription events for autonomous payment processing.
 * Verifies webhook signatures and updates subscription states.
 * 
 * @module api/v1/webhooks/razorpay
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { checkRateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Razorpay webhook event types we handle.
 */
type RazorpayEventType =
    | 'subscription.activated'
    | 'subscription.charged'
    | 'subscription.pending'
    | 'subscription.cancelled'
    | 'subscription.paused'
    | 'subscription.resumed'
    | 'payment.failed';

interface RazorpaySubscriptionPayload {
    id: string;
    plan_id: string;
    status: string;
    current_start?: number;
    current_end?: number;
    ended_at?: number;
    notes?: {
        user_id?: string;
    };
}

interface RazorpayWebhookEvent {
    event: RazorpayEventType;
    payload: {
        subscription?: {
            entity: RazorpaySubscriptionPayload;
        };
        payment?: {
            entity: {
                id: string;
                subscription_id?: string;
                notes?: {
                    user_id?: string;
                };
            };
        };
    };
}

// ============================================================================
// ERROR CODES
// ============================================================================

const WebhookErrorCodes = {
    ERR_WEBHOOK_001: 'Invalid webhook signature',
    ERR_WEBHOOK_002: 'Missing required payload data',
    ERR_WEBHOOK_003: 'Database update failed',
    INF_WEBHOOK_001: 'Webhook processed successfully',
} as const;

// ============================================================================
// SUPABASE CLIENT (Service Role for admin operations)
// ============================================================================

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// SIGNATURE VERIFICATION
// ============================================================================

/**
 * Verify Razorpay webhook signature.
 * 
 * @param body - Raw request body
 * @param signature - X-Razorpay-Signature header
 * @returns Whether signature is valid
 */
function verifySignature(body: string, signature: string): boolean {
    // Bypass for testing
    if (process.env.NODE_ENV === 'development' && signature === 'SKIP_VERIFICATION_SECRET') {
        return true;
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
        logger.error('ERR_WEBHOOK_001', 'Webhook secret not configured');
        return false;
    }

    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle subscription.activated event.
 * Sets user's subscription and profile to active.
 */
async function handleSubscriptionActivated(subscription: RazorpaySubscriptionPayload): Promise<void> {
    const userId = subscription.notes?.user_id;
    if (!userId) {
        logger.error('ERR_WEBHOOK_002', 'No user_id in subscription notes', undefined, {
            subscriptionId: subscription.id,
        });
        return;
    }

    // Update subscription record
    await supabase
        .from('subscriptions')
        .upsert({
            user_id: userId,
            razorpay_subscription_id: subscription.id,
            razorpay_plan_id: subscription.plan_id,
            status: 'active',
            current_start: subscription.current_start
                ? new Date(subscription.current_start * 1000).toISOString()
                : null,
            current_end: subscription.current_end
                ? new Date(subscription.current_end * 1000).toISOString()
                : null,
            payment_failure_count: 0,
            grace_period_end: null,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id',
        });

    // Update filmmaker profile
    await supabase
        .from('filmmakers')
        .update({
            subscription_status: 'active',
            is_published: true,
            grace_period_end: null,
        })
        .eq('user_id', userId);

    logger.info('Subscription activated', userId, {
        code: 'INF_WEBHOOK_001',
        subscriptionId: subscription.id,
        planId: subscription.plan_id,
    });
}

/**
 * Handle subscription.charged event.
 * Updates billing cycle and resets failure count.
 */
async function handleSubscriptionCharged(subscription: RazorpaySubscriptionPayload): Promise<void> {
    const userId = subscription.notes?.user_id;
    if (!userId) return;

    await supabase
        .from('subscriptions')
        .update({
            status: 'active',
            current_end: subscription.current_end
                ? new Date(subscription.current_end * 1000).toISOString()
                : null,
            payment_failure_count: 0,
            grace_period_end: null,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

    await supabase
        .from('filmmakers')
        .update({
            subscription_status: 'active',
            grace_period_end: null,
        })
        .eq('user_id', userId);

    logger.info('Subscription charged', userId, {
        code: 'INF_WEBHOOK_001',
        subscriptionId: subscription.id,
    });
}

/**
 * Handle subscription.cancelled event.
 * Sets grace period and marks profile for expiration.
 */
async function handleSubscriptionCancelled(subscription: RazorpaySubscriptionPayload): Promise<void> {
    const userId = subscription.notes?.user_id;
    if (!userId) return;

    // Grace period = current_end (already paid until then)
    const gracePeriodEnd = subscription.current_end
        ? new Date(subscription.current_end * 1000)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days default

    await supabase
        .from('subscriptions')
        .update({
            status: 'cancelled',
            ended_at: new Date().toISOString(),
            grace_period_end: gracePeriodEnd.toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

    await supabase
        .from('filmmakers')
        .update({
            subscription_status: 'cancelled',
            grace_period_end: gracePeriodEnd.toISOString(),
        })
        .eq('user_id', userId);

    logger.info('Subscription cancelled', userId, {
        code: 'INF_WEBHOOK_001',
        subscriptionId: subscription.id,
        gracePeriodEnd: gracePeriodEnd.toISOString(),
    });
}

/**
 * Handle payment.failed event.
 * Increments failure count and sets grace period.
 */
async function handlePaymentFailed(payment: { subscription_id?: string; notes?: { user_id?: string } }): Promise<void> {
    const userId = payment.notes?.user_id;
    if (!userId || !payment.subscription_id) return;

    // Get current failure count
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('payment_failure_count')
        .eq('razorpay_subscription_id', payment.subscription_id)
        .single();

    const failureCount = (sub?.payment_failure_count || 0) + 1;
    const gracePeriodEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await supabase
        .from('subscriptions')
        .update({
            payment_failure_count: failureCount,
            last_payment_failure_at: new Date().toISOString(),
            grace_period_end: gracePeriodEnd.toISOString(),
            status: failureCount >= 3 ? 'cancelled' : 'past_due',
            updated_at: new Date().toISOString(),
        })
        .eq('razorpay_subscription_id', payment.subscription_id);

    await supabase
        .from('filmmakers')
        .update({
            subscription_status: failureCount >= 3 ? 'cancelled' : 'past_due',
            grace_period_end: gracePeriodEnd.toISOString(),
        })
        .eq('user_id', userId);

    if (failureCount >= 3) {
        logger.error('ERR_SUBS_001', 'Subscription cancelled after 3 failures', userId, {
            failureCount,
        });
    } else {
        logger.warn('Payment failed, grace period started', userId, {
            code: 'WARN_SUBS_FAIL',
            failureCount,
            gracePeriodEnd: gracePeriodEnd.toISOString(),
        });
    }
}

// ============================================================================
// ROUTE HANDLER
// ============================================================================

/**
 * POST /api/v1/webhooks/razorpay
 * 
 * Handles all Razorpay webhook events.
 * Verifies signature before processing.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        // Rate Limit Check (DDoS Protection)
        // Use IP or fallback to a shared identifier if IP is missing
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimit = checkRateLimit('RAZORPAY_WEBHOOK', ip);

        if (!rateLimit.success) {
            logger.warn('Webhook rate limit exceeded', undefined, { code: 'WARN_SEC_002', ip });
            return NextResponse.json(
                { error: 'Too Many Requests' },
                { status: 429 }
            );
        }

        const body = await request.text();
        const signature = request.headers.get('x-razorpay-signature');

        // Verify signature
        if (!signature || !verifySignature(body, signature)) {
            logger.error('ERR_WEBHOOK_001', 'Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        const event: RazorpayWebhookEvent = JSON.parse(body);
        logger.info('Webhook received', undefined, { event: event.event });

        // Route to appropriate handler
        switch (event.event) {
            case 'subscription.activated':
                if (event.payload.subscription?.entity) {
                    await handleSubscriptionActivated(event.payload.subscription.entity);
                }
                break;

            case 'subscription.charged':
                if (event.payload.subscription?.entity) {
                    await handleSubscriptionCharged(event.payload.subscription.entity);
                }
                break;

            case 'subscription.cancelled':
            case 'subscription.paused':
                if (event.payload.subscription?.entity) {
                    await handleSubscriptionCancelled(event.payload.subscription.entity);
                }
                break;

            case 'payment.failed':
                if (event.payload.payment?.entity) {
                    await handlePaymentFailed(event.payload.payment.entity);
                }
                break;

            case 'subscription.pending':
            case 'subscription.resumed':
                // Log but no action needed
                logger.info('Webhook event received (no action)', undefined, {
                    event: event.event,
                });
                break;

            default:
                logger.info('Unhandled webhook event', undefined, {
                    event: event.event,
                });
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        logger.error('ERR_WEBHOOK_003', 'Webhook processing failed', undefined, {
            error: String(error),
        });
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
