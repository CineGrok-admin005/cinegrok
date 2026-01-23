/**
 * Analytics Track API Route
 * 
 * POST /api/v1/analytics/track
 * 
 * Records profile views and clicks with:
 * - Rate limiting (100 req/min per IP via GENERAL_API)
 * - Bot filtering (known crawlers)
 * - Atomic increments via RPC
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/services/analytics';
import { parseReferrer, parseDevice } from '@/domain/analytics.logic';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

// Bot patterns to filter out
const BOT_PATTERNS = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|facebookexternalhit|twitterbot|linkedinbot|applebot|semrushbot|dotbot|ahrefsbot|mj12bot|bytespider|gptbot|ccbot|anthropic-ai/i;

export async function POST(request: NextRequest) {
    try {
        // 1. Rate limiting by IP using GENERAL_API limits
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown';

        const rateLimitResult = checkRateLimit('GENERAL_API', `analytics:${ip}`);
        if (!rateLimitResult.success) {
            logger.warn('Analytics rate limit exceeded', undefined, { code: 'INF_ANALYTICS_RATE_LIMITED', ip });
            return NextResponse.json(
                { error: 'Rate limited', tracked: false },
                { status: 429 }
            );
        }

        // 2. Bot filtering
        const userAgent = request.headers.get('user-agent') || '';
        if (BOT_PATTERNS.test(userAgent)) {
            logger.info('Analytics bot request filtered', undefined, {
                code: 'INF_ANALYTICS_BOT_FILTERED',
                userAgent: userAgent.substring(0, 50)
            });
            return NextResponse.json({ tracked: false, reason: 'bot' });
        }

        // 3. Parse request body
        const body = await request.json().catch(() => ({}));
        const { type, filmmakerId, clickType, targetId } = body;

        if (!filmmakerId || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: type, filmmakerId', tracked: false },
                { status: 400 }
            );
        }

        // 4. Parse referrer and device from headers
        const referrer = parseReferrer(request.headers.get('referer'));
        const device = parseDevice(userAgent);

        // 5. Track the event
        if (type === 'view') {
            await analyticsService.trackView(filmmakerId, { referrer, device });

            logger.info('Profile view tracked', undefined, {
                code: 'INF_ANALYTICS_VIEW_TRACKED',
                filmmakerId,
                referrer,
                device,
            });
        } else if (type === 'click') {
            if (!clickType) {
                return NextResponse.json(
                    { error: 'Missing clickType for click event', tracked: false },
                    { status: 400 }
                );
            }

            await analyticsService.trackClick(filmmakerId, {
                clickType,
                targetId: targetId || '',
            });

            logger.info('Click tracked', undefined, {
                code: 'INF_ANALYTICS_CLICK_TRACKED',
                filmmakerId,
                clickType,
                targetId,
            });
        } else {
            return NextResponse.json(
                { error: 'Invalid type. Must be "view" or "click"', tracked: false },
                { status: 400 }
            );
        }

        return NextResponse.json({ tracked: true });
    } catch (error) {
        logger.error(
            'ERR_ANALYTICS_TRACK',
            'Failed to track analytics',
            undefined,
            { error: error instanceof Error ? error.message : 'Unknown error' }
        );

        return NextResponse.json(
            { error: 'Internal server error', tracked: false },
            { status: 500 }
        );
    }
}
