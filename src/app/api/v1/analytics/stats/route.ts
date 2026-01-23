/**
 * Analytics Stats API Route
 * 
 * GET /api/v1/analytics/stats
 * 
 * Returns analytics data for the authenticated user's profile.
 * Protected by RLS - users can only see their own data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { analyticsService } from '@/services/analytics';
import { filmmakersServerService } from '@/services/filmmakers/filmmakers.server.service';
import { calculateProfileCompleteness, getImprovementTips } from '@/domain/analytics.logic';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    try {
        // 1. Authenticate user
        const user = await getUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. Get user's filmmaker profile
        const filmmaker = await filmmakersServerService.getByUserId(user.id);
        if (!filmmaker) {
            return NextResponse.json(
                { error: 'No profile found' },
                { status: 404 }
            );
        }

        // 3. Parse query params
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '30', 10);
        const includeTrend = searchParams.get('trend') === 'true';
        const includeClicks = searchParams.get('clicks') === 'true';

        logger.info('Fetching analytics stats', user.id, {
            code: 'INF_ANALYTICS_STATS_FETCH',
            filmmakerId: filmmaker.id,
            days,
        });

        // 4. Get analytics data
        const stats = await analyticsService.getStats(filmmaker.id, days);

        // 5. Optionally include trend data
        let dailyTrend = null;
        if (includeTrend) {
            dailyTrend = await analyticsService.getDailyTrend(filmmaker.id, days);
        }

        // 6. Optionally include click breakdown
        let clickBreakdown = null;
        if (includeClicks) {
            clickBreakdown = await analyticsService.getClickBreakdown(filmmaker.id, days);
        }

        // 7. Calculate profile completeness
        const rawFormData = (filmmaker as any).raw_form_data || {};
        const profileCompleteness = calculateProfileCompleteness(rawFormData);
        const improvementTips = getImprovementTips(rawFormData);

        return NextResponse.json({
            stats,
            dailyTrend,
            clickBreakdown,
            profileCompleteness,
            improvementTips,
            profile: {
                id: filmmaker.id,
                name: filmmaker.name,
                status: (filmmaker as any).status,
            },
        });
    } catch (error) {
        logger.error(
            'ERR_ANALYTICS_STATS',
            'Failed to fetch analytics stats',
            undefined,
            { error: error instanceof Error ? error.message : 'Unknown error' }
        );

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
