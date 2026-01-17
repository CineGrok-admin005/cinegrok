/**
 * Local Memory Rate Limiter
 * 
 * Sliding window rate limiter using in-memory Map.
 * No external dependencies (Redis/Upstash) required.
 * 
 * Note: This is suitable for single-instance deployments.
 * For distributed systems, use Redis-backed rate limiting.
 * 
 * @module lib/rate-limit
 */

import { logger } from './logger';

// ============================================================================
// TYPES
// ============================================================================

interface RateLimitEntry {
    /** Timestamps of requests within the window */
    timestamps: number[];
}

interface RateLimitConfig {
    /** Maximum requests allowed in the window */
    limit: number;
    /** Window duration in milliseconds */
    windowMs: number;
}

interface RateLimitResult {
    /** Whether the request is allowed */
    success: boolean;
    /** Remaining requests in current window */
    remaining: number;
    /** Milliseconds until window resets */
    resetMs: number;
}

// ============================================================================
// RATE LIMIT CONFIGURATIONS
// ============================================================================

/**
 * Pre-configured rate limits for different endpoints.
 */
export const RateLimits = {
    /** Bio generation: 10 requests per minute */
    BIO_GENERATION: { limit: 10, windowMs: 60 * 1000 },

    /** Profile updates: 20 requests per minute */
    PROFILE_UPDATE: { limit: 20, windowMs: 60 * 1000 },

    /** Login attempts: 5 requests per minute */
    AUTH_LOGIN: { limit: 5, windowMs: 60 * 1000 },

    /** Signup attempts: 3 requests per minute */
    AUTH_SIGNUP: { limit: 3, windowMs: 60 * 1000 },

    /** General API: 100 requests per minute */
    GENERAL_API: { limit: 100, windowMs: 60 * 1000 },
} as const;

export type RateLimitType = keyof typeof RateLimits;

// ============================================================================
// SLIDING WINDOW RATE LIMITER
// ============================================================================

/**
 * In-memory store for rate limit tracking.
 * Key format: `${limitType}:${identifier}`
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Cleanup interval to prevent memory leaks.
 * Runs every 5 minutes to remove expired entries.
 */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

// Auto-cleanup timer (only in non-test environments)
if (typeof setInterval !== 'undefined' && process.env.NODE_ENV !== 'test') {
    setInterval(() => {
        const now = Date.now();
        const maxWindowMs = Math.max(...Object.values(RateLimits).map(r => r.windowMs));

        for (const [key, entry] of rateLimitStore.entries()) {
            // Remove entries with no recent requests
            const validTimestamps = entry.timestamps.filter(ts => now - ts < maxWindowMs);
            if (validTimestamps.length === 0) {
                rateLimitStore.delete(key);
            } else {
                entry.timestamps = validTimestamps;
            }
        }
    }, CLEANUP_INTERVAL_MS);
}

/**
 * Check and update rate limit for a given identifier.
 * Uses sliding window algorithm for smooth rate limiting.
 * 
 * @param type - Rate limit type from RateLimits
 * @param identifier - Unique identifier (userId, IP address, etc.)
 * @returns Rate limit result with success status and metadata
 * 
 * @example
 * const result = checkRateLimit('BIO_GENERATION', userId);
 * if (!result.success) {
 *   return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
 * }
 */
export function checkRateLimit(
    type: RateLimitType,
    identifier: string
): RateLimitResult {
    const config = RateLimits[type];
    const key = `${type}:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get or create entry
    let entry = rateLimitStore.get(key);
    if (!entry) {
        entry = { timestamps: [] };
        rateLimitStore.set(key, entry);
    }

    // Filter to only timestamps within the window (sliding window)
    entry.timestamps = entry.timestamps.filter(ts => ts > windowStart);

    // Check if limit exceeded
    if (entry.timestamps.length >= config.limit) {
        // Find when the oldest request in window expires
        const oldestInWindow = Math.min(...entry.timestamps);
        const resetMs = Math.max(0, oldestInWindow + config.windowMs - now);

        logger.rateLimit(type, identifier, config.limit, config.windowMs);

        return {
            success: false,
            remaining: 0,
            resetMs,
        };
    }

    // Allow request, add timestamp
    entry.timestamps.push(now);

    return {
        success: true,
        remaining: config.limit - entry.timestamps.length,
        resetMs: config.windowMs,
    };
}

/**
 * Create rate limit middleware for API routes.
 * Returns headers and handles 429 response.
 * 
 * @param type - Rate limit type
 * @param identifier - Unique identifier
 * @returns Object with allowed status and response headers
 * 
 * @example
 * const rateLimit = createRateLimitMiddleware('PROFILE_UPDATE', userId);
 * if (!rateLimit.allowed) {
 *   return new Response('Too Many Requests', { status: 429, headers: rateLimit.headers });
 * }
 */
export function createRateLimitMiddleware(
    type: RateLimitType,
    identifier: string
): { allowed: boolean; headers: Record<string, string> } {
    const result = checkRateLimit(type, identifier);
    const config = RateLimits[type];

    const headers: Record<string, string> = {
        'X-RateLimit-Limit': config.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(result.resetMs / 1000).toString(),
    };

    if (!result.success) {
        headers['Retry-After'] = Math.ceil(result.resetMs / 1000).toString();
    }

    return {
        allowed: result.success,
        headers,
    };
}

/**
 * Reset rate limit for a specific identifier.
 * Useful for testing or admin actions.
 * 
 * @param type - Rate limit type
 * @param identifier - Unique identifier
 */
export function resetRateLimit(type: RateLimitType, identifier: string): void {
    const key = `${type}:${identifier}`;
    rateLimitStore.delete(key);
}

/**
 * Get current rate limit status for an identifier.
 * Doesn't consume a request.
 * 
 * @param type - Rate limit type
 * @param identifier - Unique identifier
 * @returns Current usage stats
 */
export function getRateLimitStatus(
    type: RateLimitType,
    identifier: string
): { current: number; limit: number; windowMs: number } {
    const config = RateLimits[type];
    const key = `${type}:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    const entry = rateLimitStore.get(key);
    const current = entry
        ? entry.timestamps.filter(ts => ts > windowStart).length
        : 0;

    return {
        current,
        limit: config.limit,
        windowMs: config.windowMs,
    };
}
