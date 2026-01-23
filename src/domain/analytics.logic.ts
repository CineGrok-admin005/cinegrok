/**
 * Analytics Domain Logic
 * 
 * Pure functions for analytics calculations.
 * No external dependencies - 100% testable without database or browser.
 */

/**
 * Calculate Click-Through Rate as percentage
 * @returns CTR rounded to 1 decimal place (e.g., 23.5)
 */
export function calculateCTR(views: number, clicks: number): number {
    if (views === 0) return 0;
    return Math.round((clicks / views) * 1000) / 10;
}

/**
 * Calculate percentage change between two periods
 * @returns Change as percentage (e.g., 25 for 25% increase, -10 for 10% decrease)
 */
export function calculateTrendChange(current: number, previous: number): number {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
}

/**
 * Parse referrer URL to clean category
 */
export function parseReferrer(referrerUrl: string | null): 'direct' | 'instagram' | 'youtube' | 'twitter' | 'other' {
    if (!referrerUrl) return 'direct';

    const url = referrerUrl.toLowerCase();

    if (url.includes('instagram.com') || url.includes('l.instagram.com')) {
        return 'instagram';
    }
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('m.youtube.com')) {
        return 'youtube';
    }
    if (url.includes('twitter.com') || url.includes('x.com') || url.includes('t.co')) {
        return 'twitter';
    }

    // Check if it's the same domain (internal navigation = direct)
    if (url.includes('cinegrok') || url.includes('localhost')) {
        return 'direct';
    }

    return 'other';
}

/**
 * Parse User-Agent to detect device type
 */
export function parseDevice(userAgent: string | null): 'mobile' | 'desktop' | 'tablet' {
    if (!userAgent) return 'desktop';

    const ua = userAgent.toLowerCase();

    // Check for tablets first (iPads, Android tablets)
    if (
        ua.includes('ipad') ||
        (ua.includes('android') && !ua.includes('mobile')) ||
        ua.includes('tablet')
    ) {
        return 'tablet';
    }

    // Check for mobile devices
    if (
        ua.includes('mobile') ||
        ua.includes('android') ||
        ua.includes('iphone') ||
        ua.includes('ipod') ||
        ua.includes('blackberry') ||
        ua.includes('windows phone')
    ) {
        return 'mobile';
    }

    return 'desktop';
}

/**
 * Calculate profile completeness score (0-100)
 */
export function calculateProfileCompleteness(rawFormData: Record<string, unknown> | null): number {
    if (!rawFormData) return 0;

    // Required fields (weight: 2)
    const requiredFields = [
        'email',
        'country',
        'roles',
        'primary_roles',
    ];

    // Important fields (weight: 1.5)
    const importantFields = [
        'profile_photo_url',
        'films',
        'style',
        'philosophy',
    ];

    // Optional fields (weight: 1)
    const optionalFields = [
        'instagram',
        'youtube',
        'linkedin',
        'twitter',
        'website',
        'native_location',
        'current_location',
        'languages',
        'years_active',
        'genres',
        'influences',
        'awards',
        'press',
    ];

    let score = 0;
    let maxScore = 0;

    // Check required fields
    for (const field of requiredFields) {
        maxScore += 2;
        if (hasValue(rawFormData[field])) {
            score += 2;
        }
    }

    // Check important fields
    for (const field of importantFields) {
        maxScore += 1.5;
        if (hasValue(rawFormData[field])) {
            score += 1.5;
        }
    }

    // Check optional fields
    for (const field of optionalFields) {
        maxScore += 1;
        if (hasValue(rawFormData[field])) {
            score += 1;
        }
    }

    return Math.round((score / maxScore) * 100);
}

/**
 * Get actionable improvement tips based on missing fields
 */
export function getImprovementTips(rawFormData: Record<string, unknown> | null): string[] {
    if (!rawFormData) {
        return ['Complete your profile to get discovered by producers'];
    }

    const tips: string[] = [];

    // High-impact tips first
    if (!hasValue(rawFormData.profile_photo_url)) {
        tips.push('Add a profile photo to increase visibility by 40%');
    }

    if (!hasValue(rawFormData.films) || (Array.isArray(rawFormData.films) && rawFormData.films.length === 0)) {
        tips.push('Add your filmography to showcase your work');
    }

    if (!hasValue(rawFormData.instagram)) {
        tips.push('Link your Instagram to boost credibility');
    }

    if (!hasValue(rawFormData.style)) {
        tips.push('Describe your visual style to attract matching projects');
    }

    if (!hasValue(rawFormData.philosophy)) {
        tips.push('Share your creative philosophy to stand out');
    }

    if (!hasValue(rawFormData.youtube) && !hasValue(rawFormData.letterboxd)) {
        tips.push('Add video links so producers can see your work');
    }

    if (!hasValue(rawFormData.awards) && !hasValue(rawFormData.screenings)) {
        tips.push('Add any festival selections or screenings');
    }

    // Limit to top 3 tips
    return tips.slice(0, 3);
}

/**
 * Helper to check if a value is meaningfully filled
 */
function hasValue(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
}

/**
 * Format large numbers for display (e.g., 1.2K, 15K)
 */
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}

/**
 * Format trend change for display with arrow
 */
export function formatTrendChange(change: number): { text: string; direction: 'up' | 'down' | 'neutral' } {
    if (change > 0) {
        return { text: `+${change}%`, direction: 'up' };
    }
    if (change < 0) {
        return { text: `${change}%`, direction: 'down' };
    }
    return { text: '0%', direction: 'neutral' };
}
