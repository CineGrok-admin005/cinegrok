'use client';

/**
 * Analytics Dashboard Component
 * 
 * Client component that fetches and displays analytics data.
 * Uses api.ts for all data fetching (no direct Supabase).
 */

import React, { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import { formatNumber, formatTrendChange } from '@/domain/analytics.logic';
import {
    Eye,
    MousePointerClick,
    Percent,
    Users,
    TrendingUp,
    TrendingDown,
    Minus,
    Smartphone,
    Monitor,
    Tablet,
    Instagram,
    Youtube,
    Twitter,
    Globe,
    Lightbulb,
    CheckCircle,
    AlertCircle,
    Film,
    Play,
    ExternalLink,
    Share2,
    Calendar,
    Copy,
    Link as LinkIcon,
    Check,
} from 'lucide-react';

interface ClickBreakdownItem {
    targetId: string;
    count: number;
}

interface ClickBreakdown {
    film: ClickBreakdownItem[];
    watch: ClickBreakdownItem[];
    trailer: ClickBreakdownItem[];
    social: ClickBreakdownItem[];
}

// Use the API response type directly - it returns clickBreakdown as Record<string, item[]>
type AnalyticsData = api.AnalyticsResponse;

// Loading skeleton component
function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
    );
}

function ChartSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="h-48 bg-gray-100 rounded"></div>
        </div>
    );
}

// Stat card component
function StatCard({
    icon: Icon,
    label,
    value,
    trend,
    trendLabel,
    color = 'blue',
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    trend?: number;
    trendLabel?: string;
    color?: 'blue' | 'green' | 'purple' | 'orange';
}) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    const trendData = trend !== undefined ? formatTrendChange(trend) : null;

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-500">{label}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
                {typeof value === 'number' ? formatNumber(value) : value}
            </div>
            {trendData && (
                <div className={`flex items-center gap-1 text-sm ${trendData.direction === 'up' ? 'text-green-600' :
                    trendData.direction === 'down' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                    {trendData.direction === 'up' && <TrendingUp className="w-4 h-4" />}
                    {trendData.direction === 'down' && <TrendingDown className="w-4 h-4" />}
                    {trendData.direction === 'neutral' && <Minus className="w-4 h-4" />}
                    <span>{trendData.text}</span>
                    {trendLabel && <span className="text-gray-400">vs {trendLabel}</span>}
                </div>
            )}
        </div>
    );
}

// Simple bar chart component
function SimpleBarChart({ data, label }: { data: Record<string, number>; label: string }) {
    const entries = Object.entries(data).filter(([_, v]) => v > 0);
    const max = Math.max(...entries.map(([_, v]) => v), 1);

    if (entries.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                <p>No data yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {entries.map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                    <span className="w-20 text-sm text-gray-600 capitalize">{key}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${(value / max) * 100}%` }}
                        />
                    </div>
                    <span className="w-12 text-sm font-medium text-gray-700 text-right">
                        {formatNumber(value)}
                    </span>
                </div>
            ))}
        </div>
    );
}

// Device breakdown with icons
function DeviceBreakdown({ data }: { data: { mobile: number; desktop: number; tablet: number } }) {
    const total = data.mobile + data.desktop + data.tablet;
    if (total === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                <p>No device data yet</p>
            </div>
        );
    }

    const items = [
        { icon: Smartphone, label: 'Mobile', value: data.mobile, color: 'bg-blue-500' },
        { icon: Monitor, label: 'Desktop', value: data.desktop, color: 'bg-green-500' },
        { icon: Tablet, label: 'Tablet', value: data.tablet, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-4">
            {items.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="w-16 text-sm text-gray-600">{label}</span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${color} rounded-full transition-all duration-500`}
                            style={{ width: `${(value / total) * 100}%` }}
                        />
                    </div>
                    <span className="w-16 text-sm text-gray-500 text-right">
                        {total > 0 ? Math.round((value / total) * 100) : 0}%
                    </span>
                </div>
            ))}
        </div>
    );
}

// Referrer breakdown with icons
function ReferrerBreakdown({ data }: { data: api.AnalyticsStats['referrerBreakdown'] }) {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                <p>No referrer data yet</p>
            </div>
        );
    }

    const items = [
        { icon: Globe, label: 'Direct', value: data.direct, color: 'bg-gray-500' },
        { icon: Instagram, label: 'Instagram', value: data.instagram, color: 'bg-pink-500' },
        { icon: Youtube, label: 'YouTube', value: data.youtube, color: 'bg-red-500' },
        { icon: Twitter, label: 'Twitter', value: data.twitter, color: 'bg-sky-500' },
        { icon: Globe, label: 'Other', value: data.other, color: 'bg-gray-400' },
    ].filter(item => item.value > 0);

    return (
        <div className="space-y-4">
            {items.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="w-20 text-sm text-gray-600">{label}</span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${color} rounded-full transition-all duration-500`}
                            style={{ width: `${(value / total) * 100}%` }}
                        />
                    </div>
                    <span className="w-16 text-sm text-gray-500 text-right">
                        {Math.round((value / total) * 100)}%
                    </span>
                </div>
            ))}
        </div>
    );
}

// Profile completeness component
function ProfileCompleteness({
    score,
    tips,
}: {
    score: number;
    tips: string[];
}) {
    const getScoreColor = (s: number) => {
        if (s >= 80) return 'text-green-600';
        if (s >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProgressColor = (s: number) => {
        if (s >= 80) return 'bg-green-500';
        if (s >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Profile Strength</h3>
                <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                    {score}%
                </span>
            </div>

            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
                <div
                    className={`h-full ${getProgressColor(score)} rounded-full transition-all duration-700`}
                    style={{ width: `${score}%` }}
                />
            </div>

            {tips.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        <span>Tips to improve</span>
                    </div>
                    <ul className="space-y-2">
                        {tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {tips.length === 0 && score >= 80 && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Your profile is looking great!</span>
                </div>
            )}
        </div>
    );
}

// Content Engagement section - Shows which films/content got clicked
function ContentEngagement({ clickBreakdown }: { clickBreakdown: Record<string, ClickBreakdownItem[]> | null }) {
    if (!clickBreakdown) {
        return null;
    }

    // Extract typed arrays from the Record
    const film = clickBreakdown.film || [];
    const watch = clickBreakdown.watch || [];
    const trailer = clickBreakdown.trailer || [];
    const social = clickBreakdown.social || [];

    // Check if there's any data
    const hasFilmData = film.length > 0;
    const hasWatchData = watch.length > 0;
    const hasTrailerData = trailer.length > 0;
    const hasSocialData = social.length > 0;


    if (!hasFilmData && !hasWatchData && !hasTrailerData && !hasSocialData) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Engagement</h3>
                <div className="text-center py-8 text-gray-400">
                    <Film className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No engagement data yet</p>
                    <p className="text-sm">When visitors click on your films and links, you'll see the breakdown here.</p>
                </div>
            </div>
        );
    }

    // Combine film, watch, and trailer clicks by film ID
    const filmEngagement: Record<string, { info: number; watch: number; trailer: number }> = {};

    film.forEach(({ targetId, count }) => {
        if (!filmEngagement[targetId]) {
            filmEngagement[targetId] = { info: 0, watch: 0, trailer: 0 };
        }
        filmEngagement[targetId].info = count;
    });

    watch.forEach(({ targetId, count }) => {
        if (!filmEngagement[targetId]) {
            filmEngagement[targetId] = { info: 0, watch: 0, trailer: 0 };
        }
        filmEngagement[targetId].watch = count;
    });

    trailer.forEach(({ targetId, count }) => {
        if (!filmEngagement[targetId]) {
            filmEngagement[targetId] = { info: 0, watch: 0, trailer: 0 };
        }
        filmEngagement[targetId].trailer = count;
    });

    // Sort by total engagement
    const sortedFilms = Object.entries(filmEngagement)
        .map(([id, data]) => ({
            id,
            total: data.info + data.watch + data.trailer,
            ...data
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5); // Top 5

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Engagement</h3>

            <div className="space-y-6">
                {/* Filmography Performance */}
                {sortedFilms.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                            <Film className="w-4 h-4" />
                            Filmography Performance
                        </h4>
                        <div className="space-y-3">
                            {sortedFilms.map(({ id, info, watch: watchCount, trailer: trailerCount, total }) => (
                                <div key={id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900 truncate">
                                            {id.length > 20 ? `Film ${id.substring(0, 8)}...` : id}
                                        </span>
                                        <span className="text-sm font-bold text-gray-700">{total} clicks</span>
                                    </div>
                                    <div className="flex gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Film className="w-3 h-3" /> Info: {info}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Play className="w-3 h-3" /> Watch: {watchCount}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ExternalLink className="w-3 h-3" /> Trailer: {trailerCount}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Social Links Performance */}
                {hasSocialData && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            Social Links Clicked
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {social.map(({ targetId, count }) => (
                                <div key={targetId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                    <span className="text-sm capitalize text-gray-700">{targetId}</span>
                                    <span className="text-sm font-medium text-gray-900">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Views Over Time Chart - Simple line chart showing daily trends
function ViewsOverTimeChart({ dailyTrend }: { dailyTrend: api.DailyTrendData[] | null }) {
    if (!dailyTrend || dailyTrend.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Views Over Time
                </h3>
                <div className="text-center py-8 text-gray-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No trend data yet</p>
                    <p className="text-sm">Check back after a few days of traffic.</p>
                </div>
            </div>
        );
    }

    // Get last 14 days for the chart
    const chartData = dailyTrend.slice(-14);
    const maxViews = Math.max(...chartData.map(d => d.views), 1);
    const maxClicks = Math.max(...chartData.map(d => d.clicks), 1);

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Views Over Time
            </h3>

            {/* Legend */}
            <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600">Views</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Clicks</span>
                </div>
            </div>

            {/* Simple bar chart */}
            <div className="relative">
                <div className="flex items-end gap-1 h-48 border-b border-gray-200">
                    {chartData.map((day, i) => (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                <p className="font-medium">{formatDate(day.date)}</p>
                                <p>Views: {day.views}</p>
                                <p>Clicks: {day.clicks}</p>
                            </div>

                            {/* Bars */}
                            <div className="flex gap-0.5 items-end h-full w-full px-0.5">
                                <div
                                    className="flex-1 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                                    style={{ height: `${(day.views / maxViews) * 100}%`, minHeight: day.views > 0 ? '4px' : '0' }}
                                />
                                <div
                                    className="flex-1 bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                                    style={{ height: `${(day.clicks / maxClicks) * 100}%`, minHeight: day.clicks > 0 ? '4px' : '0' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* X-axis labels */}
                <div className="flex gap-1 mt-2">
                    {chartData.map((day, i) => (
                        <div key={`label-${day.date}`} className="flex-1 text-center">
                            <span className="text-xs text-gray-500">
                                {i % 2 === 0 || chartData.length <= 7 ? formatDate(day.date).split(' ')[1] : ''}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-lg font-bold text-blue-600">
                        {chartData.reduce((sum, d) => sum + d.views, 0)}
                    </p>
                    <p className="text-xs text-gray-500">Total Views</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-green-600">
                        {chartData.reduce((sum, d) => sum + d.clicks, 0)}
                    </p>
                    <p className="text-xs text-gray-500">Total Clicks</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-purple-600">
                        {chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + d.views, 0) / chartData.length) : 0}
                    </p>
                    <p className="text-xs text-gray-500">Avg/Day</p>
                </div>
            </div>
        </div>
    );
}

// UTM Link Generator - Create trackable links for social media
function UTMLinkGenerator({ profileUrl, profileName }: { profileUrl: string; profileName: string }) {
    const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
    const [customCampaign, setCustomCampaign] = useState<string>('');
    const [copied, setCopied] = useState(false);

    const platforms = [
        { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
        { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-500' },
        { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
        { id: 'linkedin', name: 'LinkedIn', icon: Globe, color: 'bg-blue-700' },
        { id: 'custom', name: 'Custom', icon: LinkIcon, color: 'bg-gray-500' },
    ];

    // Generate UTM link
    const baseUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/filmmaker/${profileUrl}`
        : `/filmmaker/${profileUrl}`;

    const campaign = customCampaign || `${profileName.toLowerCase().replace(/\s+/g, '-')}-promo`;
    const utmParams = new URLSearchParams({
        utm_source: selectedPlatform,
        utm_medium: 'social',
        utm_campaign: campaign,
    });

    const fullUrl = `${baseUrl}?${utmParams.toString()}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const selectedConfig = platforms.find(p => p.id === selectedPlatform) || platforms[0];

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-blue-500" />
                UTM Link Generator
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Create trackable links to see which platforms drive the most traffic.
            </p>

            {/* Platform Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Platform
                </label>
                <div className="flex flex-wrap gap-2">
                    {platforms.map(platform => {
                        const Icon = platform.icon;
                        return (
                            <button
                                key={platform.id}
                                onClick={() => setSelectedPlatform(platform.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${selectedPlatform === platform.id
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm">{platform.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Custom Campaign Name (optional) */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                    type="text"
                    value={customCampaign}
                    onChange={e => setCustomCampaign(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder={`${profileName.toLowerCase().replace(/\s+/g, '-')}-promo`}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Generated Link */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Trackable Link
                </label>
                <div className="flex items-center gap-2">
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm text-gray-700 overflow-x-auto whitespace-nowrap">
                        {fullUrl}
                    </div>
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${copied
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            {/* Tips */}
            <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                    <strong>Pro tip:</strong> Use different links for different posts. Change the campaign name
                    to track which specific content drives the most traffic (e.g., "jan-reel", "bio-link").
                </p>
            </div>
        </div>
    );
}

// Main dashboard component
export function AnalyticsDashboard() {
    const [data, setData] = useState<api.AnalyticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const result = await api.getMyAnalytics({
                    days: 30,
                    includeTrend: true,
                    includeClicks: true,
                });
                setData(result);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                setError(err instanceof Error ? err.message : 'Failed to load analytics');
            } finally {
                setIsLoading(false);
            }
        }

        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Stats grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                </div>
                {/* Charts skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartSkeleton />
                    <ChartSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load analytics</h3>
                <p className="text-red-600">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-600">No analytics data available yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                    Share your profile link to start tracking views!
                </p>
            </div>
        );
    }

    const { stats, clickBreakdown, profileCompleteness, improvementTips, profile } = data;

    return (
        <div className="space-y-8">
            {/* Profile status banner */}
            {profile.status !== 'published' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div>
                        <p className="text-yellow-800 font-medium">Your profile is not published</p>
                        <p className="text-yellow-600 text-sm">
                            Publish your profile to start tracking views from visitors.
                        </p>
                    </div>
                </div>
            )}

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Eye}
                    label="Profile Views"
                    value={stats.totalViews}
                    trend={stats.trend7d.change}
                    trendLabel="last week"
                    color="blue"
                />
                <StatCard
                    icon={MousePointerClick}
                    label="Total Clicks"
                    value={stats.totalClicks}
                    color="green"
                />
                <StatCard
                    icon={Percent}
                    label="Click Rate"
                    value={`${stats.ctr}%`}
                    color="purple"
                />
                <StatCard
                    icon={Users}
                    label="Collab Interests"
                    value={stats.interestsReceived}
                    color="orange"
                />
            </div>

            {/* Two-column layout for breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic Sources */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
                    <ReferrerBreakdown data={stats.referrerBreakdown} />
                </div>

                {/* Device Breakdown */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Types</h3>
                    <DeviceBreakdown data={stats.deviceBreakdown} />
                </div>
            </div>

            {/* Views Over Time Chart */}
            <ViewsOverTimeChart dailyTrend={data.dailyTrend} />

            {/* Content Engagement - Films, Watch links, Trailers, Socials */}
            <ContentEngagement clickBreakdown={clickBreakdown} />

            {/* Profile completeness - moved below Content Engagement */}
            <ProfileCompleteness score={profileCompleteness} tips={improvementTips} />

            {/* UTM Link Generator */}
            <UTMLinkGenerator profileUrl={profile.id} profileName={profile.name} />

            {/* 7-day summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Last 7 Days</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{formatNumber(stats.trend7d.views)}</p>
                        <p className="text-sm text-blue-600/70">Views</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{formatNumber(stats.trend7d.clicks)}</p>
                        <p className="text-sm text-green-600/70">Clicks</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">
                            {stats.trend7d.views > 0
                                ? `${Math.round((stats.trend7d.clicks / stats.trend7d.views) * 100)}%`
                                : '0%'}
                        </p>
                        <p className="text-sm text-purple-600/70">CTR</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className={`text-2xl font-bold ${stats.trend7d.change >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {stats.trend7d.change >= 0 ? '+' : ''}{stats.trend7d.change}%
                        </p>
                        <p className="text-sm text-orange-600/70">vs Previous</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
