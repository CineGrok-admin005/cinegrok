/**
 * Analytics Dashboard Page
 * 
 * Shows profile performance insights to filmmakers.
 * Protected route - requires authentication.
 */

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase-server';
import Navigation from '@/components/Navigation';
import { AnalyticsDashboard } from './analytics-dashboard';
import './analytics.css';

export const metadata = {
    title: 'My Analytics - CineGrok',
    description: 'View your profile performance and insights',
};

export default async function AnalyticsPage() {
    const user = await getUser();

    if (!user) {
        redirect('/auth/login?redirect=/analytics');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Analytics</h1>
                    <p className="mt-2 text-gray-600">
                        Track your profile performance and discover insights
                    </p>
                </div>
                <AnalyticsDashboard />
            </main>
        </div>
    );
}
