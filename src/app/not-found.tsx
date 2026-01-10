import Link from 'next/link'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
                <div className="mb-6 flex justify-center text-gray-400">
                    <FileQuestion size={64} strokeWidth={1.5} />
                </div>

                <h1 className="text-4xl font-serif font-medium text-gray-900 mb-3">
                    Scene Missing
                </h1>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    The page you are looking for has been cut from the final edit or never existed.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium transition-transform active:scale-95 hover:bg-gray-800"
                >
                    <Home size={18} />
                    Return to Set
                </Link>
            </div>

            <div className="mt-8 text-xs text-gray-400 uppercase tracking-widest">
                CineGrok
            </div>
        </div>
    )
}
