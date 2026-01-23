/**
 * User Dashboard
 * 
 * Main dashboard for authenticated users with profile overview and quick actions.
 * Uses consistent Lucide icons matching the app's design system.
 */

import { getUser, getUserProfile } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'
import { Users, Handshake, Settings, HelpCircle, BarChart3 } from 'lucide-react'
import './dashboard.css'

import { Database } from '@/lib/supabase'
import { filmmakersServerService } from '@/services/filmmakers/filmmakers.server.service';

export default async function DashboardPage() {
    const user = await getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const profile = await getUserProfile(user.id)

    // Get user's filmmaker profile using server service
    const filmmakerData = await filmmakersServerService.getByUserId(user.id)

    const filmmaker = filmmakerData as Database['public']['Tables']['filmmakers']['Row'] | null

    // Get subscription info using server service
    const subscription = await filmmakersServerService.getUserSubscription(user.id)

    // BETA LAUNCH: Free access for all users
    const hasActiveSubscription = true

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome back, {(profile as any)?.full_name || user.email}!</h1>
                        <p className="subtitle">Manage your filmmaker profile and connections</p>
                    </div>
                    <SignOutButton />
                </div>

                {/* Beta Note */}
                <div className="dashboard-grid">
                    <div className="card beta-banner">
                        <div className="card-body">
                            <h3>Beta Launch</h3>
                            <p style={{ margin: 0 }}>
                                All features are currently free during our beta launch. Create your profile and get discovered.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="card">
                    <div className="card-header">
                        <h3>Your Profile</h3>
                        {filmmaker && (
                            <span className={`badge badge-${(filmmaker as any).status === 'published' ? 'success' : 'warning'}`}>
                                {(filmmaker as any).status}
                            </span>
                        )}
                    </div>
                    <div className="card-body">
                        {filmmaker ? (
                            <>
                                {(filmmaker as any).status === 'published' ? (
                                    <>
                                        <p>Your profile is live and visible to everyone.</p>
                                        <div className="button-group">
                                            <Link href={`/filmmakers/${filmmaker.id}`} className="btn btn-primary btn-sm">
                                                View Profile
                                            </Link>
                                            <Link href="/profile-builder" className="btn btn-outline btn-sm">
                                                Edit Profile
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p>Your profile is in draft mode.</p>
                                        <p className="text-muted">
                                            Complete your profile and publish it.
                                        </p>
                                        <Link href="/profile-builder" className="btn btn-primary">
                                            Continue Editing
                                        </Link>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <p>You haven't created a profile yet.</p>
                                <p className="text-muted">
                                    Start building your filmmaker profile now.
                                </p>
                                <Link href="/profile-builder" className="btn btn-primary">
                                    Create Profile
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions - Using consistent Lucide icons */}
            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-grid">
                    <Link href="/browse" className="action-card">
                        <Users className="action-icon-svg" size={32} strokeWidth={1.5} />
                        <h4>Browse Filmmakers</h4>
                        <p>Discover other talented filmmakers</p>
                    </Link>
                    <Link href="/analytics" className="action-card">
                        <BarChart3 className="action-icon-svg" size={32} strokeWidth={1.5} />
                        <h4>My Analytics</h4>
                        <p>View your profile insights</p>
                    </Link>
                    <Link href="/collaboration-interests" className="action-card">
                        <Handshake className="action-icon-svg" size={32} strokeWidth={1.5} />
                        <h4>Collaboration Interests</h4>
                        <p>Manage your saved connections</p>
                    </Link>
                    <Link href="/settings" className="action-card">
                        <Settings className="action-icon-svg" size={32} strokeWidth={1.5} />
                        <h4>Settings</h4>
                        <p>Update your account settings</p>
                    </Link>
                    <Link href="/help" className="action-card">
                        <HelpCircle className="action-icon-svg" size={32} strokeWidth={1.5} />
                        <h4>Help & Support</h4>
                        <p>Get help with your account</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}
