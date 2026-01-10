'use client';

import React, { useState } from 'react';
import { ProfileData } from './types';
import { AudienceView } from './audience-view';
import { ProducerView } from './producer-view';
import { ViewToggle } from './view-toggle';
import { Button } from './ui/button';
import { LogIn, LogOut } from 'lucide-react';

interface PublicProfileWrapperProps {
    profile: ProfileData;
    isLoggedIn: boolean; // Passed from server or determined by client auth
    isOwner?: boolean; // If we want to allow owner to see producer view
    filmmaker?: any; // For export functionality
}

export function PublicProfileWrapper({ profile, isLoggedIn, isOwner, filmmaker }: PublicProfileWrapperProps) {
    const [viewMode, setViewMode] = useState<'audience' | 'producer'>('audience');

    // Demo login state override (optional, if we want to simulate for now, or rely on prop)
    // For now let's rely on the prop passed from the page/layout
    // But wait, the original App.tsx had a toggle login button. 
    // In the real app, login is global. 
    // We will assume isLoggedIn is passed correctly. 
    // However, ViewToggle requires onToggle and checking isLoggedIn.

    const handleViewToggle = (view: 'audience' | 'producer') => {
        if (view === 'producer' && !isLoggedIn) return;
        setViewMode(view);
    };

    return (
        <div className="bg-white" style={{ fontFamily: 'var(--font-sans)' }}>
            {/* View Toggle Bar - Changed from sticky to relative to prevent overlap in preview */}
            <div className="relative z-40 bg-white border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-sm uppercase tracking-widest text-secondary">{profile.stageName}</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <ViewToggle
                                currentView={viewMode}
                                onToggle={handleViewToggle}
                                isLoggedIn={isLoggedIn}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                {viewMode === 'audience' ? (
                    <AudienceView profile={profile} />
                ) : (
                    <ProducerView
                        profile={profile}
                        isOwner={isOwner}
                        filmmaker={filmmaker}
                    />
                )}
            </div>
        </div>
    );
}
