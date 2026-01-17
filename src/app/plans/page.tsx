'use client';

/**
 * Plans Page
 * 
 * Beta pricing display with strike-through original prices.
 * Allows users to claim a free subscription and publish their profile.
 * 
 * @module app/plans
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { subscriptionService, SubscriptionPlan } from '@/services/publishing';
import { filmmakersService } from '@/services/filmmakers';
import { generateBioFromTemplate, BioFormData } from '@/lib/bio-templates';
import Link from 'next/link';
import './plans.css';

export default function PlansPage() {
    return (
        <div className="plans-page">
            <div className="plans-container">
                <Suspense fallback={<div className="plans-loading">Loading...</div>}>
                    <PlansContent />
                </Suspense>
            </div>
        </div>
    );
}

function PlansContent() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);
    const [draftData, setDraftData] = useState<Record<string, unknown> | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromProfileBuilder = searchParams.get('from') === 'profile-builder';

    useEffect(() => {
        loadPlansAndDraft();
    }, []);

    async function loadPlansAndDraft() {
        try {
            // Load plans
            const fetchedPlans = await subscriptionService.getPlans();
            setPlans(fetchedPlans);

            // Default to monthly
            if (fetchedPlans.length > 0) {
                setSelectedPlan(fetchedPlans[0].id);
            }

            // Load user's draft data
            const user = await filmmakersService.getCurrentUser();
            if (user) {
                const { data } = await filmmakersService.loadProfile(user.id);
                setDraftData(data as Record<string, unknown>);
            }
        } catch (error) {
            console.error('Failed to load plans:', error);
            toast.error('Failed to load plans');
        } finally {
            setLoading(false);
        }
    }

    async function handleClaimAndPublish() {
        console.log('[PlansPage] Claim process started');
        if (!selectedPlan || !draftData) {
            console.warn('[PlansPage] Missing plan or draft', { selectedPlan, draftData });
            toast.error('Please select a plan and complete your profile first');
            return;
        }

        setClaiming(true);
        toast.loading('Claiming your free subscription...');

        try {
            const user = await filmmakersService.getCurrentUser();
            if (!user) {
                console.warn('[PlansPage] No user found');
                toast.dismiss();
                toast.error('You must be logged in');
                router.push('/auth/login');
                return;
            }

            console.log('[PlansPage] Calling claimBetaSubscription', {
                userId: user.id,
                planId: selectedPlan,
                draftKeys: Object.keys(draftData)
            });

            // Generate deterministic bio on client
            const generatedBio = generateBioFromTemplate(draftData as unknown as BioFormData);
            const enrichedDraftData = {
                ...draftData,
                bio: generatedBio
            };

            const result = await subscriptionService.claimBetaSubscription(
                user.id,
                selectedPlan,
                enrichedDraftData as any
            );

            console.log('[PlansPage] Result:', result);

            toast.dismiss();

            if (result.success && result.filmmakerId) {
                console.log('[PlansPage] Success! Redirecting to:', `/filmmakers/${result.filmmakerId}`);
                toast.success('🎉 Profile published! Welcome to CineGrok.');
                router.push(`/filmmakers/${result.filmmakerId}`);
            } else {
                console.error('[PlansPage] Claim failed with result:', result);
                toast.error(result.error || 'Failed to publish profile');
            }
        } catch (error) {
            toast.dismiss();
            console.error('[PlansPage] Claim exception:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setClaiming(false);
        }
    }

    const selectedPlanData = plans.find(p => p.id === selectedPlan);

    // Format amount from subunits to display
    const formatAmount = (amount: number) => {
        return `₹${(amount / 100).toLocaleString('en-IN')}`;
    };

    if (loading) {
        return <div className="plans-loading">Loading plans...</div>;
    }

    return (
        <>
            {/* Back link */}
            {fromProfileBuilder && (
                <Link href="/profile-builder?step=6" className="plans-back-link">
                    <ArrowLeft size={16} />
                    Back to Preview
                </Link>
            )}

            {/* Header */}
            <div className="plans-header">
                <div className="beta-badge">
                    <Sparkles size={14} />
                    BETA ACCESS
                </div>
                <h1>Choose Your Plan</h1>
                <p>Get discovered by producers and collaborators worldwide.</p>
            </div>

            {/* Plan Cards */}
            <div className="plans-grid">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPlan(plan.id)}
                    >
                        {/* Selection indicator */}
                        <div className="plan-check">
                            {selectedPlan === plan.id && <Check size={16} />}
                        </div>

                        <h3 className="plan-name">{plan.display_name}</h3>

                        {/* Strike-through pricing */}
                        <div className="plan-pricing">
                            <span className="original-price">
                                {formatAmount(plan.original_amount)}
                                {plan.interval === 'yearly' && (
                                    <span className="price-period">/year</span>
                                )}
                                {plan.interval === 'monthly' && (
                                    <span className="price-period">/month</span>
                                )}
                            </span>
                            <span className="beta-price">FREE</span>
                        </div>

                        {/* Plan features */}
                        <ul className="plan-features">
                            <li><Check size={14} /> Published profile</li>
                            <li><Check size={14} /> Visible in browse</li>
                            <li><Check size={14} /> Collaboration requests</li>
                            {plan.interval === 'yearly' && (
                                <li><Check size={14} /> Save ₹189/year</li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Payment Summary */}
            {selectedPlanData && (
                <div className="payment-summary">
                    <h3>Payment Summary</h3>
                    <div className="summary-row">
                        <span>{selectedPlanData.display_name}</span>
                        <span className="strike">{formatAmount(selectedPlanData.original_amount)}</span>
                    </div>
                    <div className="summary-row discount">
                        <span>Beta Discount (100%)</span>
                        <span>-{formatAmount(selectedPlanData.original_amount)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span className="free-label">₹0 FREE</span>
                    </div>
                </div>
            )}

            {/* CTA Button */}
            <button
                className="claim-button"
                onClick={handleClaimAndPublish}
                disabled={claiming || !selectedPlan || !draftData}
            >
                {claiming ? 'Publishing...' : 'Claim & Publish Profile'}
            </button>

            {/* No draft warning */}
            {!draftData && !loading && (
                <p className="no-draft-warning">
                    You haven't completed your profile yet.{' '}
                    <Link href="/profile-builder">Complete your profile</Link>
                </p>
            )}

            {/* Terms */}
            <p className="plans-terms">
                By claiming, you agree to our <Link href="/terms">Terms of Service</Link>.
                <br />
                <span className="beta-note">
                    Beta access is free. Standard pricing applies after beta period ends.
                </span>
            </p>
        </>
    );
}
