'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Browse Page Error:', error);
    }, [error]);

    return (
        <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <h1>Something went wrong!</h1>
            <p style={{ margin: '1rem 0', color: 'red' }}>
                {error.message || 'An unexpected error occurred.'}
            </p>
            {process.env.NODE_ENV === 'development' && (
                <pre style={{ textAlign: 'left', background: '#f0f0f0', padding: '1rem', overflow: 'auto' }}>
                    {error.stack}
                </pre>
            )}
            <button
                onClick={() => reset()}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
            >
                Try again
            </button>
        </div>
    );
}
