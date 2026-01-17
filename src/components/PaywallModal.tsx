/**
 * Paywall Modal Component - BETA VERSION
 * 
 * During beta: Shows a "Free during Beta" message and auto-proceeds.
 * After beta: Will display subscription plans and redirect to Razorpay.
 * 
 * @module components/PaywallModal
 */

'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, Gift } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface PaywallModalProps {
    /** Whether modal is open */
    open: boolean;
    /** Called when modal is closed */
    onClose: () => void;
    /** Called when subscription is successful (or beta bypass) */
    onSuccess?: () => void;
    /** Message to show explaining why paywall is displayed */
    message?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Paywall modal - BETA VERSION
 * 
 * During beta launch, this shows a "Free during Beta" message
 * and allows users to proceed with publishing without payment.
 * 
 * @example
 * <PaywallModal 
 *   open={showPaywall} 
 *   onClose={() => setShowPaywall(false)}
 *   onSuccess={() => publishProfile()}
 * />
 */
export function PaywallModal({ open, onClose, onSuccess, message }: PaywallModalProps) {
    const [proceeding, setProceeding] = useState(false);

    const handleProceedFree = async () => {
        setProceeding(true);
        // Small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        onSuccess?.();
        onClose();
        setProceeding(false);
    };

    const betaFeatures = [
        'Full profile publishing',
        'AI-generated bio',
        'Unlimited profile updates',
        'Analytics dashboard',
        'Featured in browse section',
        'Custom profile URL',
    ];

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        <Gift className="w-6 h-6 text-green-500" />
                        Beta Launch - It's Free!
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        {message || 'Publish your profile and get discovered by producers.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {/* Beta Banner */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-green-800">
                                Early Adopter Benefit
                            </span>
                        </div>
                        <p className="text-sm text-green-700">
                            As an early adopter, you get <strong>FREE access</strong> to all features
                            during our beta launch. No credit card required!
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">What you get for free:</h4>
                        <ul className="space-y-2">
                            {betaFeatures.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Future Pricing Notice */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            When we introduce pricing later, beta users will receive
                            <strong> exclusive discounts</strong> and grandfather pricing.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={proceeding}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleProceedFree}
                        disabled={proceeding}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                        {proceeding ? (
                            'Publishing...'
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Publish Free
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default PaywallModal;
