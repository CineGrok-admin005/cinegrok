/**
 * Collaboration Interests Page
 * 
 * Dedicated page for managing saved filmmaker connections.
 * Features server-side filtering, status management, and private notes.
 */

import { getUser } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Handshake } from 'lucide-react'
import CollaborationInterests from '@/components/dashboard/CollaborationInterests'

export default async function CollaborationInterestsPage() {
    const user = await getUser()

    if (!user) {
        redirect('/auth/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Handshake className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Collaboration Interests</h1>
                            <p className="text-gray-600">Manage filmmakers you're interested in collaborating with</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <CollaborationInterests />
                </div>
            </div>
        </div>
    )
}
