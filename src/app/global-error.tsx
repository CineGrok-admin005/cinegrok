'use client'

import { AlertTriangle, Home } from 'lucide-react'
import Link from 'next/link'

// Error boundaries must be Client Components
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        // Global error must include html and body tags
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 text-center font-sans">
                    <div className="max-w-md w-full p-8 border border-white/10 rounded-2xl bg-zinc-900/50 backdrop-blur-xl">
                        <div className="mb-6 flex justify-center text-red-500">
                            <AlertTriangle size={64} strokeWidth={1.5} />
                        </div>

                        <h1 className="text-3xl font-light mb-2 tracking-wide">
                            Critical System Failure
                        </h1>
                        <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                            A critical error occurred in the application core.
                            <br />
                            Please try refreshing or return to base.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => reset()}
                                className="w-full py-3 bg-white text-black hover:bg-zinc-200 transition-colors rounded-lg font-medium"
                            >
                                Attempts Recovery
                            </button>

                            <Link
                                href="/"
                                className="w-full py-3 border border-white/20 text-white hover:bg-white/5 transition-colors rounded-lg font-medium inline-flex items-center justify-center gap-2"
                            >
                                <Home size={16} />
                                Return Home
                            </Link>
                        </div>

                        <div className="mt-8 text-[10px] text-zinc-600 font-mono">
                            ERROR_ID: {error.digest || 'UNKNOWN_FATAL'}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}
