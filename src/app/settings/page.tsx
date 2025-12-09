/**
 * Settings Page
 * Basic account settings
 */

import Navigation from '@/components/Navigation';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { createSupabaseServerClient, getUser } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import './settings.css';

export default async function SettingsPage() {
    const user = await getUser();

    if (!user) {
        redirect('/auth/login');
    }

    return (
        <div className="settings-page">
            <Navigation />
            <div className="container settings-container">
                <h1>Account Settings</h1>

                <div className="settings-section">
                    <h2>Profile Information</h2>
                    <div className="setting-item">
                        <label>Email Address</label>
                        <div className="value">{user.email}</div>
                    </div>
                    <div className="setting-item">
                        <label>User ID</label>
                        <div className="value code">{user.id}</div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Account Actions</h2>
                    <p className="description">Manage your session and account access.</p>
                    <div className="actions">
                        <SignOutButton />
                    </div>
                </div>

                <Link href="/dashboard" className="btn btn-secondary back-btn">
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
