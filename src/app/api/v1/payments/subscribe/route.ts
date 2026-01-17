/**
 * Payment Routes - Create Subscription
 * 
 * Handles subscription creation and Razorpay order generation.
 * 
 * @module api/v1/payments/subscribe
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, getUser } from '@/lib/supabase-server';
import { logger } from '@/lib/logger';
import Razorpay from 'razorpay';

// ============================================================================
// RAZORPAY CLIENT
// ============================================================================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_build_dummy_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_build_dummy_secret',
});

// ============================================================================
// TYPES
// ============================================================================

interface CreateSubscriptionRequest {
    planId: string;
}

interface CreateSubscriptionResponse {
    subscriptionId: string;
    shortUrl: string;
}

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

/**
 * POST /api/v1/payments/subscribe
 * 
 * Creates a new Razorpay subscription for the authenticated user.
 * Returns the subscription ID and checkout URL.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const user = await getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body: CreateSubscriptionRequest = await request.json();
        const { planId } = body;

        if (!planId) {
            return NextResponse.json(
                { error: 'Plan ID is required' },
                { status: 400 }
            );
        }

        // Get plan details from database
        const supabase = await createSupabaseServerClient();
        const { data: plan, error: planError } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('razorpay_plan_id', planId)
            .single();

        if (planError || !plan) {
            logger.error('ERR_PAY_001', 'Plan not found', user.id, { planId });
            return NextResponse.json(
                { error: 'Invalid plan' },
                { status: 400 }
            );
        }

        // Create Razorpay subscription
        // Cast plan to any to avoid TypeScript inference issues with Supabase result
        const planData = plan as any;

        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            total_count: 12, // 12 billing cycles (1 year for monthly)
            notes: {
                user_id: user.id,
                user_email: user.email || '',
                plan_name: planData.name,
            },
        }) as any;

        // Store pending subscription in database
        await supabase.from('subscriptions').upsert({
            user_id: user.id,
            razorpay_subscription_id: subscription.id,
            razorpay_plan_id: planId,
            plan_name: (planData.display_name || planData.name) as string,
            status: 'created',
            amount: planData.amount,
            currency: (planData.currency || 'INR') as string,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as any, {
            onConflict: 'user_id',
        });

        logger.info('Subscription created', user.id, {
            code: 'INF_PAY_001',
            subscriptionId: subscription.id,
            planId,
        });

        const response: CreateSubscriptionResponse = {
            subscriptionId: subscription.id,
            shortUrl: subscription.short_url,
        };

        return NextResponse.json(response);

    } catch (error) {
        logger.error('ERR_PAY_002', 'Subscription creation failed', undefined, {
            error: String(error),
        });
        return NextResponse.json(
            { error: 'Failed to create subscription' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/v1/payments/subscribe
 * 
 * Returns available subscription plans.
 */
export async function GET(): Promise<NextResponse> {
    try {
        const supabase = await createSupabaseServerClient();

        const { data: plans, error } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('is_active', true)
            .order('amount', { ascending: true });

        if (error) {
            logger.error('ERR_PAY_003', 'Failed to fetch plans', undefined, {
                error: error.message,
            });
            return NextResponse.json(
                { error: 'Failed to fetch plans' },
                { status: 500 }
            );
        }

        return NextResponse.json({ plans });

    } catch (error) {
        logger.error('ERR_PAY_003', 'Plans fetch failed', undefined, {
            error: String(error),
        });
        return NextResponse.json(
            { error: 'Failed to fetch plans' },
            { status: 500 }
        );
    }
}
