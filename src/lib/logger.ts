/**
 * Structured Console Logger
 * 
 * Production-grade logging utility that outputs structured JSON.
 * Enables log aggregation and debugging without external dependencies.
 * 
 * @module lib/logger
 */

// ============================================================================
// ERROR CODE REGISTRY
// ============================================================================

/**
 * Centralized error code registry.
 * Format: ERR_[DOMAIN]_[NUMBER] for errors
 * Format: INF_[DOMAIN]_[NUMBER] for info
 */
export const ErrorCodes = {
    // Authentication
    ERR_AUTH_001: 'Invalid login credentials',
    ERR_AUTH_002: 'Session expired',
    ERR_AUTH_003: 'Email not confirmed',
    ERR_AUTH_004: 'Unauthorized access',
    ERR_AUTH_005: 'Invalid token',
    INF_AUTH_001: 'User logged in successfully',
    INF_AUTH_002: 'User signed out (confirmed)',

    // Profile Operations
    ERR_PROFILE_001: 'Failed to load profile data',
    ERR_PROFILE_002: 'User not authenticated',
    ERR_PROFILE_003: 'Failed to save profile',
    ERR_PROFILE_004: 'Failed to delete draft',
    ERR_PROFILE_005: 'Invalid profile data',

    // Database Operations
    ERR_DB_001: 'Database connection failed',
    ERR_DB_002: 'Database query failed',
    ERR_DB_003: 'Record not found',
    ERR_DB_004: 'Constraint violation',

    // API Operations
    ERR_API_001: 'Rate limit exceeded',
    ERR_API_002: 'Invalid request payload',
    ERR_API_003: 'External service unavailable',

    // Storage Operations
    ERR_STORAGE_001: 'File upload failed',
    ERR_STORAGE_002: 'File not found',
    ERR_STORAGE_003: 'Invalid file type',

    // Bio Generation
    ERR_BIO_001: 'Bio generation failed',
    ERR_BIO_002: 'Insufficient profile data',

    // Collaboration Interests
    INF_COLLAB_001: 'Interest added to profile',
    INF_COLLAB_002: 'Interest removed from profile',
    INF_COLLAB_003: 'Interest status updated',
    INF_COLLAB_004: 'Interest notes updated',
    ERR_COLLAB_001: 'Failed to add interest',
    ERR_COLLAB_002: 'Failed to remove interest',
    ERR_COLLAB_003: 'Failed to update interest',
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

// ============================================================================
// TYPES
// ============================================================================

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    code?: string;
    userId?: string;
    message: string;
    metadata?: Record<string, unknown>;
}

// ============================================================================
// LOGGER IMPLEMENTATION
// ============================================================================

/**
 * Formats a log entry as structured JSON.
 * 
 * @param level - Log level (INFO, WARN, ERROR, DEBUG)
 * @param message - Human-readable log message
 * @param code - Optional error code from ErrorCodes registry
 * @param userId - Optional user identifier for tracing
 * @param metadata - Optional additional context
 * @returns Formatted JSON string
 */
function formatLogEntry(
    level: LogLevel,
    message: string,
    code?: string,
    userId?: string,
    metadata?: Record<string, unknown>
): string {
    const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
    };

    if (code) entry.code = code;
    if (userId) entry.userId = userId;
    if (metadata && Object.keys(metadata).length > 0) entry.metadata = metadata;

    return JSON.stringify(entry);
}

/**
 * Structured console logger.
 * 
 * Outputs JSON-formatted logs for production debugging.
 * All methods accept optional userId and metadata for context.
 * 
 * @example
 * logger.info('Profile created', userId, { filmmakerId: '123' });
 * logger.error('ERR_DB_001', 'Database timeout', userId, { query: 'select...' });
 */
export const logger = {
    /**
     * Log informational message.
     * Use for successful operations and state changes.
     */
    info: (message: string, userId?: string, metadata?: Record<string, unknown>): void => {
        console.log(formatLogEntry('INFO', message, undefined, userId, metadata));
    },

    /**
     * Log warning message.
     * Use for potentially problematic situations that don't prevent operation.
     */
    warn: (message: string, userId?: string, metadata?: Record<string, unknown>): void => {
        console.warn(formatLogEntry('WARN', message, undefined, userId, metadata));
    },

    /**
     * Log error with structured code.
     * Use for failures that need tracking.
     * 
     * @param code - Error code from ErrorCodes registry
     * @param message - Error description (defaults to ErrorCodes lookup)
     * @param userId - Optional user ID for tracing
     * @param metadata - Optional additional context
     */
    error: (
        code: ErrorCode | string,
        message?: string,
        userId?: string,
        metadata?: Record<string, unknown>
    ): void => {
        const errorMessage = message || (ErrorCodes[code as ErrorCode] ?? code);
        console.error(formatLogEntry('ERROR', errorMessage, code, userId, metadata));
    },

    /**
     * Log debug message.
     * Use for development-time debugging. Can be filtered in production.
     */
    debug: (message: string, userId?: string, metadata?: Record<string, unknown>): void => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(formatLogEntry('DEBUG', message, undefined, userId, metadata));
        }
    },

    /**
     * Log rate limit hit.
     * Specialized method for tracking rate limit violations.
     */
    rateLimit: (
        endpoint: string,
        identifier: string,
        limit: number,
        windowMs: number
    ): void => {
        console.warn(formatLogEntry('WARN', `Rate limit exceeded: ${endpoint}`, 'ERR_API_001', undefined, {
            endpoint,
            identifier: identifier.substring(0, 8) + '...', // Truncate for privacy
            limit,
            windowMs,
        }));
    },
};

/**
 * Creates a child logger with preset userId.
 * Useful for request-scoped logging where userId is known.
 * 
 * @param userId - User ID to include in all logs
 * @returns Logger instance with bound userId
 * 
 * @example
 * const userLogger = createUserLogger(session.userId);
 * userLogger.info('Started profile edit');
 */
export function createUserLogger(userId: string) {
    return {
        info: (message: string, metadata?: Record<string, unknown>) =>
            logger.info(message, userId, metadata),
        warn: (message: string, metadata?: Record<string, unknown>) =>
            logger.warn(message, userId, metadata),
        error: (code: ErrorCode | string, message?: string, metadata?: Record<string, unknown>) =>
            logger.error(code, message, userId, metadata),
        debug: (message: string, metadata?: Record<string, unknown>) =>
            logger.debug(message, userId, metadata),
    };
}
