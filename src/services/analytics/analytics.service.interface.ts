/**
 * Analytics Service Interface
 * 
 * Provider-agnostic interface for analytics operations.
 * Enables future migration to Tinybird/ClickHouse without code changes.
 */

export type ReferrerSource = 'direct' | 'instagram' | 'youtube' | 'twitter' | 'other';
export type DeviceType = 'mobile' | 'desktop' | 'tablet';
export type ClickType = 'film' | 'watch' | 'trailer' | 'social';

export interface ViewMetadata {
    referrer: ReferrerSource;
    device: DeviceType;
}

export interface ClickData {
    clickType: ClickType;
    targetId: string; // film_id or platform name (instagram, youtube, etc.)
}

export interface DailyData {
    date: string;
    views: number;
    clicks: number;
}

export interface ReferrerBreakdown {
    direct: number;
    instagram: number;
    youtube: number;
    twitter: number;
    other: number;
}

export interface DeviceBreakdown {
    mobile: number;
    desktop: number;
    tablet: number;
}

export interface ClickBreakdown {
    film: { targetId: string; count: number }[];
    watch: { targetId: string; count: number }[];
    trailer: { targetId: string; count: number }[];
    social: { targetId: string; count: number }[];
}

export interface AnalyticsStats {
    totalViews: number;
    totalClicks: number;
    ctr: number; // Click-through rate as percentage
    interestsReceived: number;
    trend7d: { views: number; clicks: number; change: number };
    trend30d: { views: number; clicks: number; change: number };
    referrerBreakdown: ReferrerBreakdown;
    deviceBreakdown: DeviceBreakdown;
}

export interface IAnalyticsService {
    /**
     * Track a profile view (atomic increment)
     */
    trackView(filmmakerId: string, metadata: ViewMetadata): Promise<void>;

    /**
     * Track a click event (atomic increment)
     */
    trackClick(filmmakerId: string, data: ClickData): Promise<void>;

    /**
     * Get aggregated stats for a filmmaker's profile
     */
    getStats(filmmakerId: string, days?: number): Promise<AnalyticsStats>;

    /**
     * Get daily trend data for charts
     */
    getDailyTrend(filmmakerId: string, days: number): Promise<DailyData[]>;

    /**
     * Get click breakdown by type
     */
    getClickBreakdown(filmmakerId: string, days?: number): Promise<ClickBreakdown>;
}
