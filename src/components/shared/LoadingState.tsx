/**
 * Loading State Component
 * 
 * Consistent loading indicator used across the application.
 * DRY principle: Replaces duplicated loading divs throughout pages.
 * 
 * @module components/shared/LoadingState
 */

import React from 'react';

interface LoadingStateProps {
    /** Message to display (default: 'Loading...') */
    message?: string;
    /** Whether to take full screen height */
    fullScreen?: boolean;
}

/**
 * Displays a centered loading indicator with optional message.
 * 
 * @param props - Component props
 * @returns Loading state UI
 * 
 * @example
 * <LoadingState />
 * <LoadingState message="Fetching profiles..." fullScreen />
 */
export function LoadingState({
    message = 'Loading...',
    fullScreen = true
}: LoadingStateProps) {
    return (
        <div
            className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'}`}
            role="status"
            aria-live="polite"
        >
            <div className="text-center">
                <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"
                    aria-hidden="true"
                />
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
}
