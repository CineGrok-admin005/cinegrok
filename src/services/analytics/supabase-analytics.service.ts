/**
 * Supabase Analytics Service Implementation
 * 
 * Uses RPC functions for atomic increments to prevent race conditions.
 * Follows Scalable SaaS Architecture - only used server-side.
 */

import { createClient } from '@supabase/supabase-js';
import {
    IAnalyticsService,
    ViewMetadata,
    ClickData,
    AnalyticsStats,
    DailyData,
    ClickBreakdown,
} from './analytics.service.interface';
import { calculateCTR, calculateTrendChange } from '@/domain/analytics.logic';
import { logger } from '@/lib/logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service role client for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class SupabaseAnalyticsService implements IAnalyticsService {
    /**
     * Track a profile view using atomic RPC
     */
    async trackView(filmmakerId: string, metadata: ViewMetadata): Promise<void> {
        const today = new Date().toISOString().split('T')[0];

        logger.info('Tracking profile view', undefined, {
            code: 'INF_ANALYTICS_001',
            filmmakerId,
            referrer: metadata.referrer,
            device: metadata.device,
        });

        const { error } = await supabase.rpc('increment_daily_view', {
            p_filmmaker_id: filmmakerId,
            p_date: today,
            p_referrer: metadata.referrer,
            p_device: metadata.device,
        });

        if (error) {
            logger.error('ERR_ANALYTICS_001', 'Failed to track view', undefined, {
                error: error.message,
                filmmakerId,
            });
            throw new Error(`Failed to track view: ${error.message}`);
        }
    }

    /**
     * Track a click event using atomic RPC
     */
    async trackClick(filmmakerId: string, data: ClickData): Promise<void> {
        const today = new Date().toISOString().split('T')[0];

        logger.info('Tracking click', undefined, {
            code: 'INF_ANALYTICS_002',
            filmmakerId,
            clickType: data.clickType,
            targetId: data.targetId,
        });

        const { error } = await supabase.rpc('increment_daily_click', {
            p_filmmaker_id: filmmakerId,
            p_date: today,
            p_click_type: data.clickType,
            p_target_id: data.targetId || '',
        });

        if (error) {
            logger.error('ERR_ANALYTICS_002', 'Failed to track click', undefined, {
                error: error.message,
                filmmakerId,
            });
            throw new Error(`Failed to track click: ${error.message}`);
        }
    }

    /**
     * Get aggregated analytics stats
     */
    async getStats(filmmakerId: string, days: number = 30): Promise<AnalyticsStats> {
        logger.info('Fetching analytics stats', undefined, {
            code: 'INF_ANALYTICS_003',
            filmmakerId,
            days,
        });

        // Get stats from RPC
        const { data: statsData, error: statsError } = await supabase.rpc('get_analytics_stats', {
            p_filmmaker_id: filmmakerId,
            p_days: days,
        });

        if (statsError) {
            logger.error('ERR_ANALYTICS_003', 'Failed to fetch stats', undefined, {
                error: statsError.message,
                filmmakerId,
            });
            throw new Error(`Failed to fetch stats: ${statsError.message}`);
        }

        // Get 7-day and previous 7-day for trend calculation
        const { data: trend7d } = await supabase
            .from('profile_analytics_daily')
            .select('views, clicks')
            .eq('filmmaker_id', filmmakerId)
            .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

        const { data: prevTrend7d } = await supabase
            .from('profile_analytics_daily')
            .select('views, clicks')
            .eq('filmmaker_id', filmmakerId)
            .gte('date', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
            .lt('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

        // Get interests count
        const { count: interestsCount } = await supabase
            .from('interested_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('target_profile_id', filmmakerId);

        const current7dViews = trend7d?.reduce((sum, d) => sum + (d.views || 0), 0) || 0;
        const current7dClicks = trend7d?.reduce((sum, d) => sum + (d.clicks || 0), 0) || 0;
        const prev7dViews = prevTrend7d?.reduce((sum, d) => sum + (d.views || 0), 0) || 0;

        const totalViews = statsData?.total_views || 0;
        const totalClicks = statsData?.total_clicks || 0;

        return {
            totalViews,
            totalClicks,
            ctr: calculateCTR(totalViews, totalClicks),
            interestsReceived: interestsCount || 0,
            trend7d: {
                views: current7dViews,
                clicks: current7dClicks,
                change: calculateTrendChange(current7dViews, prev7dViews),
            },
            trend30d: {
                views: totalViews,
                clicks: totalClicks,
                change: 0, // Would need 60-day data for comparison
            },
            referrerBreakdown: statsData?.referrer_breakdown || {
                direct: 0,
                instagram: 0,
                youtube: 0,
                twitter: 0,
                other: 0,
            },
            deviceBreakdown: statsData?.device_breakdown || {
                mobile: 0,
                desktop: 0,
                tablet: 0,
            },
        };
    }

    /**
     * Get daily trend data for charts
     */
    async getDailyTrend(filmmakerId: string, days: number): Promise<DailyData[]> {
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];

        const { data, error } = await supabase
            .from('profile_analytics_daily')
            .select('date, views, clicks')
            .eq('filmmaker_id', filmmakerId)
            .gte('date', startDate)
            .order('date', { ascending: true });

        if (error) {
            logger.error('ERR_ANALYTICS_004', 'Failed to fetch daily trend', undefined, {
                error: error.message,
                filmmakerId,
            });
            throw new Error(`Failed to fetch daily trend: ${error.message}`);
        }

        return (data || []).map((d) => ({
            date: d.date,
            views: d.views || 0,
            clicks: d.clicks || 0,
        }));
    }

    /**
     * Get click breakdown by type
     */
    async getClickBreakdown(filmmakerId: string, days: number = 30): Promise<ClickBreakdown> {
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];

        const { data, error } = await supabase
            .from('profile_analytics_clicks')
            .select('click_type, target_id, count')
            .eq('filmmaker_id', filmmakerId)
            .gte('date', startDate);

        if (error) {
            logger.error('ERR_ANALYTICS_005', 'Failed to fetch click breakdown', undefined, {
                error: error.message,
                filmmakerId,
            });
            throw new Error(`Failed to fetch click breakdown: ${error.message}`);
        }

        const breakdown: ClickBreakdown = {
            film: [],
            watch: [],
            trailer: [],
            social: [],
        };

        // Aggregate by type
        const aggregated: Record<string, Record<string, number>> = {
            film: {},
            watch: {},
            trailer: {},
            social: {},
        };

        for (const row of data || []) {
            const type = row.click_type as keyof ClickBreakdown;
            const targetId = row.target_id || 'unknown';
            aggregated[type][targetId] = (aggregated[type][targetId] || 0) + (row.count || 0);
        }

        // Convert to array format
        for (const type of ['film', 'watch', 'trailer', 'social'] as const) {
            breakdown[type] = Object.entries(aggregated[type])
                .map(([targetId, count]) => ({ targetId, count }))
                .sort((a, b) => b.count - a.count);
        }

        return breakdown;
    }
}

// Export singleton instance
export const supabaseAnalyticsService = new SupabaseAnalyticsService();
