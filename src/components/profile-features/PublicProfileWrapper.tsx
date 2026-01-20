'use client';

import React, { useState } from 'react';
import { ProfileData } from './types';
import { AudienceView } from './audience-view';
import { ProducerView } from './producer-view';
import { ViewToggle } from './view-toggle';
import { Button } from './ui/button';
import { Download, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { downloadAsHTML, printAsPDF } from '@/domain/profile-export.logic';

interface PublicProfileWrapperProps {
    profile: ProfileData;
    isLoggedIn: boolean; // Passed from server or determined by client auth
    isOwner?: boolean; // If we want to allow owner to see producer view
    filmmakerId?: string; // For interest tracking
    filmmaker?: any; // For export functionality
}

export function PublicProfileWrapper({ profile, isLoggedIn, isOwner, filmmakerId, filmmaker }: PublicProfileWrapperProps) {
    const [viewMode, setViewMode] = useState<'audience' | 'producer'>('audience');

    const handleViewToggle = (view: 'audience' | 'producer') => {
        if (view === 'producer' && !isLoggedIn) return;
        setViewMode(view);
    };

    const handleExportPDF = () => {
        if (filmmaker) {
            printAsPDF(filmmaker);
        }
    };

    const handleExportHTML = () => {
        if (filmmaker) {
            downloadAsHTML(filmmaker);
        }
    };

    return (
        <div className="bg-white" style={{ fontFamily: 'var(--font-sans)' }}>
            {/* View Toggle Bar */}
            <div className="relative z-40 bg-white border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-sm uppercase tracking-widest text-secondary truncate max-w-[120px] sm:max-w-none">{profile.stageName}</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <ViewToggle
                                currentView={viewMode}
                                onToggle={handleViewToggle}
                                isLoggedIn={isLoggedIn}
                            />

                            {/* Export Button - Always visible for owners */}
                            {isOwner && filmmaker && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="default" size="sm">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export
                                            <ChevronDown className="w-4 h-4 ml-1" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={handleExportPDF}>
                                            Download as PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleExportHTML}>
                                            Download as HTML
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
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
                        filmmakerId={filmmakerId}
                    />
                )}
            </div>
        </div>
    );
}
