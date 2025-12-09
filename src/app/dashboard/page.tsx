/**
 * User Dashboard
 * 
 * Main dashboard for authenticated users
 */

import { createSupabaseServerClient, getUser, getUserProfile } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'
import './dashboard.css'

import { Database } from '@/lib/supabase'

export default async function DashboardPage() {
    const user = await getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const profile = await getUserProfile(user.id)
    const supabase = await createSupabaseServerClient()

    // Get user's filmmaker profile if exists
    const { data: filmmakerData } = await supabase
        .from('filmmakers')
        .select('*')
        .eq('user_id', user.id)
        .single()

    const filmmaker = filmmakerData as Database['public']['Tables']['filmmakers']['Row'] | null

    // Get subscription info
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

    // BETA LAUNCH: Free access for all users
    const hasActiveSubscription = true

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome back, {(profile as any)?.full_name || user.email}!</h1>
                        <p className="subtitle">Manage your filmmaker profile</p>
                    </div>
                    <SignOutButton />
                </div>

                {/* Beta Note */}
                <div className="dashboard-grid">
                    <div className="card" style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', color: 'white' }}>
                        <div className="card-body">
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>🎉 Beta Launch - Free Access!</h3>
                            <p style={{ margin: 0 }}>
                                All features are currently FREE during our beta launch. Create your profile and get discovered!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Status */}
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
                                        <p>Your profile is live and visible to everyone!</p>
                                        <div className="profile-stats">
                                            <div className="stat">
                                                <span className="stat-value">{(filmmaker as any).profile_views || 0}</span>
                                                <span className="stat-label">Views</span>
                                            </div>
                                            <div className="stat">
                                                <span className="stat-value">{(filmmaker as any).profile_clicks || 0}</span>
                                                <span className="stat-label">Clicks</span>
                                            </div>
                                        </div>
                                        <div className="button-group">
                                            <Link href={`/filmmakers/${filmmaker.id}`} className="btn btn-primary btn-sm">
                                                View Profile
                                            </Link>
                                            <Link href="/profile-builder" className="btn btn-secondary btn-sm">
                                                Edit Profile
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p>Your profile is in draft mode.</p>
                                        <p className="text-muted">
                                            Complete your profile and subscribe to publish it.
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
                                    {hasActiveSubscription
                                        ? 'Start building your filmmaker profile now!'
                                        : 'Subscribe to create your filmmaker profile.'}
                                </p>
                                {hasActiveSubscription ? (
                                    <Link href="/profile-builder" className="btn btn-primary">
                                        Create Profile
                                    </Link>
                                ) : (
                                    <Link href="/pricing" className="btn btn-primary">
                                        View Plans
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions - Simplified */}
            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-grid">
                    <Link href="/browse" className="action-card">
                        <div className="action-icon">🎬</div>
                        <h4>Browse Filmmakers</h4>
                        <p>Discover other talented filmmakers</p>
                    </Link>
                    <Link href="/settings" className="action-card">
                        <div className="action-icon">⚙️</div>
                        <h4>Settings</h4>
                        <p>Update your account settings</p>
                    </Link>
                    <Link href="/help" className="action-card">
                        <div className="action-icon">❓</div>
                        <h4>Help & Support</h4>
                        <p>Get help with your account</p>
                    </Link>
                </div>
            </div>
        </div>

    )
}
