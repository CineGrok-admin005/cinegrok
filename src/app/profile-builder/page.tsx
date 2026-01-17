'use client';

/**
 * Profile Builder Page
 * 
 * Multi-step wizard for creating/editing filmmaker profiles.
 * Uses FilmmakersService for all data operations (Three Box Rule compliant).
 * Integrates with PublishingService for pay-to-publish flow.
 * 
 * @module app/profile-builder
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileWizard } from '@/components/profile-features/profile-wizard';
import { ProfileData } from '@/components/profile-features/types';
import { filmmakersService, FilmmakerServiceError } from '@/services/filmmakers';
import { publishingService } from '@/services/publishing';
import { PaywallModal } from '@/components/PaywallModal';
import { toast } from 'sonner';

/**
 * Profile Builder Page Component
 * 
 * Orchestrates the profile creation/editing flow.
 * All business logic is delegated to FilmmakersService and PublishingService.
 */
export default function ProfileBuilderPage() {
    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState<Partial<ProfileData>>({});
    const [draftId, setDraftId] = useState<string | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [pendingPublishData, setPendingPublishData] = useState<ProfileData | null>(null);
    const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadProfileData();
    }, []);

    /**
     * Loads existing profile or draft data for the current user.
     * Delegates to FilmmakersService.loadProfile().
     */
    const loadProfileData = async () => {
        try {
            const user = await filmmakersService.getCurrentUser();
            if (!user) {
                console.log('[ProfileBuilder] No authenticated user');
                setLoading(false);
                return;
            }

            const { data, draftId: loadedDraftId, source } = await filmmakersService.loadProfile(user.id);

            console.log(`[ProfileBuilder] Loaded from ${source}:`, !!data);
            setInitialData(data);
            setDraftId(loadedDraftId);

            // Check for unpublished changes
            const hasChanges = await publishingService.hasUnpublishedChanges(user.id);
            setHasUnpublishedChanges(hasChanges);

        } catch (error) {
            if (error instanceof FilmmakerServiceError) {
                console.error(`[ProfileBuilder] ${error.code}:`, error.message);
            } else {
                console.error('[ProfileBuilder] Unexpected error:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles profile wizard completion.
     * Checks subscription status before publishing.
     * Shows paywall modal if no active subscription.
     * 
     * @param data - Complete profile data from the wizard
     */
    const handleComplete = async (data: ProfileData) => {
        try {
            const user = await filmmakersService.getCurrentUser();
            if (!user) {
                toast.error('You must be logged in to publish.');
                return;
            }

            // Check if user can publish
            const { allowed, reason, subscription } = await publishingService.canPublish(user.id);

            if (!allowed) {
                // Store data and show paywall
                setPendingPublishData(data);
                setShowPaywall(true);
                return;
            }

            // Proceed with publishing
            await executePublish(user.id, data);

        } catch (error) {
            toast.dismiss();
            if (error instanceof FilmmakerServiceError) {
                console.error(`[ProfileBuilder] ${error.code}:`, error.message);
                toast.error(error.message || 'Failed to publish profile');
            } else {
                console.error('[ProfileBuilder] Unexpected error:', error);
                toast.error('Failed to publish profile');
            }
        }
    };

    /**
     * Executes the actual publish operation.
     * Called after subscription validation passes.
     */
    const executePublish = async (userId: string, data: ProfileData) => {
        toast.loading('Publishing profile...');

        const result = await publishingService.publishDraft(userId, data);

        toast.dismiss();

        if (result.success) {
            toast.success(`Profile published! (v${result.version})`);
            setHasUnpublishedChanges(false);
            router.push(`/filmmakers/${result.filmmakerId}`);
        } else {
            toast.error(result.error || 'Failed to publish profile');
        }
    };

    /**
     * Called when paywall modal is closed after successful subscription.
     * Retries the publish with stored data.
     */
    const handlePaywallSuccess = async () => {
        setShowPaywall(false);
        if (pendingPublishData) {
            const user = await filmmakersService.getCurrentUser();
            if (user) {
                await executePublish(user.id, pendingPublishData);
            }
            setPendingPublishData(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Unpublished changes banner */}
            {hasUnpublishedChanges && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
                    <span className="text-amber-800 text-sm">
                        You have unpublished changes.
                        <button
                            onClick={() => handleComplete(initialData as ProfileData)}
                            className="ml-2 underline font-medium hover:text-amber-900"
                        >
                            Republish now
                        </button>
                    </span>
                </div>
            )}

            <ProfileWizard
                initialData={initialData}
                onComplete={handleComplete}
            />

            {/* Paywall Modal */}
            <PaywallModal
                open={showPaywall}
                onClose={() => setShowPaywall(false)}
                onSuccess={handlePaywallSuccess}
                message="Subscribe to publish your profile and get discovered by producers worldwide."
            />
        </div>
    );
}

