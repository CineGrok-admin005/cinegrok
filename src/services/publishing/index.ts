/**
 * Publishing Services - Re-exports
 * 
 * Barrel file for publishing service module.
 * Import from '@/services/publishing' for cleaner imports.
 * 
 * @module services/publishing
 */

// Publishing service
export {
    publishingService,
    PublishingError,
    PublishingErrorCodes,
    type PublishingErrorCode,
    type PublishResult,
    type CanPublishResult,
} from './publishing.service';

// Subscription service
export {
    subscriptionService,
    SubscriptionErrorCodes,
    type SubscriptionErrorCode,
    type SubscriptionStatus,
    type SubscriptionCheckResult,
    type SubscriptionPlan,
    type ClaimBetaResult,
} from './subscription.service';

