/**
 * XSS Sanitization Utility
 * 
 * Provides input sanitization to prevent Cross-Site Scripting (XSS) attacks.
 * Uses isomorphic-dompurify for both server and client-side sanitization.
 * 
 * @module lib/sanitize
 * @see https://github.com/cure53/DOMPurify
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes user input by stripping ALL HTML tags and attributes.
 * Use for plain text fields like names, titles, and short descriptions.
 * 
 * @param input - Raw user input string (may contain malicious HTML/scripts)
 * @returns Sanitized string with all HTML removed, safe for storage and rendering
 * @throws {never} This function does not throw; returns empty string for null/undefined
 * 
 * @example
 * sanitizeInput('<script>alert("xss")</script>Hello'); // Returns: 'Hello'
 * sanitizeInput('<b>Bold</b> text'); // Returns: 'Bold text'
 */
export function sanitizeInput(input: string | null | undefined): string {
    if (!input) return '';

    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],      // Strip ALL tags
        ALLOWED_ATTR: [],      // Strip ALL attributes
        KEEP_CONTENT: true,    // Keep text content of removed tags
    }).trim();
}

/**
 * Sanitizes rich text input allowing basic formatting tags.
 * Use for bio descriptions, synopses, and other formatted content.
 * 
 * Allowed tags: b, i, em, strong, p, br, ul, ol, li
 * All attributes are stripped (no href, onclick, etc.)
 * 
 * @param input - Raw user input with potential HTML formatting
 * @returns Sanitized string with only safe formatting tags preserved
 * @throws {never} This function does not throw; returns empty string for null/undefined
 * 
 * @example
 * sanitizeRichText('<b>Bold</b> and <script>bad</script>'); // Returns: '<b>Bold</b> and '
 * sanitizeRichText('<p onclick="evil()">Safe</p>'); // Returns: '<p>Safe</p>'
 */
export function sanitizeRichText(input: string | null | undefined): string {
    if (!input) return '';

    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: [],      // No attributes allowed (prevents onclick, href, etc.)
        KEEP_CONTENT: true,
    }).trim();
}

/**
 * Sanitizes a URL to prevent javascript: and data: protocol attacks.
 * Use for user-provided links like website, social media, etc.
 * 
 * @param url - Raw URL input from user
 * @returns Sanitized URL or empty string if invalid/malicious
 * @throws {never} This function does not throw; returns empty string for invalid URLs
 * 
 * @example
 * sanitizeUrl('https://example.com'); // Returns: 'https://example.com'
 * sanitizeUrl('javascript:alert(1)'); // Returns: ''
 * sanitizeUrl('data:text/html,<script>'); // Returns: ''
 */
export function sanitizeUrl(url: string | null | undefined): string {
    if (!url) return '';

    const trimmed = url.trim();

    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    const lowerUrl = trimmed.toLowerCase();

    for (const protocol of dangerousProtocols) {
        if (lowerUrl.startsWith(protocol)) {
            return '';
        }
    }

    // Basic URL validation - must start with http://, https://, or be a relative path
    if (!trimmed.startsWith('http://') &&
        !trimmed.startsWith('https://') &&
        !trimmed.startsWith('/') &&
        !trimmed.startsWith('./')) {
        // Assume https if no protocol
        return `https://${trimmed}`;
    }

    return trimmed;
}

/**
 * Batch sanitizes an object's string values.
 * Recursively processes nested objects and arrays.
 * 
 * @param obj - Object with potentially unsafe string values
 * @returns New object with all string values sanitized
 * @throws {never} This function does not throw
 * 
 * @example
 * sanitizeObject({ name: '<script>x</script>John', age: 25 });
 * // Returns: { name: 'John', age: 25 }
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    if (!obj || typeof obj !== 'object') return obj;

    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            result[key] = sanitizeInput(value);
        } else if (Array.isArray(value)) {
            result[key] = value.map(item =>
                typeof item === 'string' ? sanitizeInput(item) : item
            );
        } else if (typeof value === 'object' && value !== null) {
            result[key] = sanitizeObject(value as Record<string, unknown>);
        } else {
            result[key] = value;
        }
    }

    return result as T;
}
