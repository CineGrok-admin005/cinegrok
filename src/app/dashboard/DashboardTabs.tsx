'use client';

/**
 * Dashboard Tabs Component
 * 
 * Client-side tabbed interface for the dashboard:
 * - My Profile: Profile status and management
 * - Collaboration Interests: Saved filmmakers for networking
 */

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Heart } from 'lucide-react';
import CollaborationInterests from '@/components/dashboard/CollaborationInterests';

interface DashboardTabsProps {
    filmmaker: any | null;
}

export default function DashboardTabs({ filmmaker }: DashboardTabsProps) {
    return (
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    My Profile
                </TabsTrigger>
                <TabsTrigger value="interests" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Collaboration Interests
                </TabsTrigger>
            </TabsList>

            {/* My Profile Tab */}
            <TabsContent value="profile">
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
            </TabsContent>

            {/* Collaboration Interests Tab */}
            <TabsContent value="interests">
                <div className="card">
                    <div className="card-header">
                        <h3>Collaboration Interests</h3>
                    </div>
                    <div className="card-body">
                        <CollaborationInterests />
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}
