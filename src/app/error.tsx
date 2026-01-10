'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
                <div className="mb-6 flex justify-center text-amber-500">
                    <AlertTriangle size={64} strokeWidth={1.5} />
                </div>

                <h1 className="text-3xl font-serif font-medium text-gray-900 mb-3">
                    Technical Difficulty
                </h1>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    We encountered an unexpected error on set. Our crew has been notified.
                </p>

                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium transition-transform active:scale-95 hover:bg-gray-800"
                >
                    <RefreshCcw size={18} />
                    Try Again
                </button>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-red-50 text-red-800 text-left text-xs rounded overflow-auto max-h-40 w-full">
                        <p className="font-bold mb-1">Error Details (Dev Only):</p>
                        <pre>{error.message}</pre>
                    </div>
                )}
            </div>

            <div className="mt-8 text-xs text-gray-400 uppercase tracking-widest">
                CineGrok Error ID: {error.digest || 'Unknown'}
            </div>
        </div>
    )
}
