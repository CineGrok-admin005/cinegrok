/**
 * Analytics Service Factory
 * 
 * Export the analytics service for use in API routes.
 * Follows Scalable SaaS pattern - enables future provider swapping.
 */

export * from './analytics.service.interface';
export { supabaseAnalyticsService as analyticsService } from './supabase-analytics.service';
