/**
 * Supabase Client Configuration
 * 
 * Updated to support both client and server-side rendering
 * with Supabase Auth integration
 */

import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

/**
 * Client-side Supabase client (for use in components)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Browser client with SSR support (for App Router)
 */
export function createSupabaseBrowserClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Type definitions for database tables
 */
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    subscription_status: string
                    subscription_plan: string | null
                    subscription_id: string | null
                    subscription_start_date: string | null
                    subscription_end_date: string | null
                    filmmaker_id: string | null
                    onboarding_completed: boolean
                    last_login_at: string | null
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                }
                Update: {
                    full_name?: string | null
                    avatar_url?: string | null
                    subscription_status?: string
                    subscription_plan?: string | null
                    onboarding_completed?: boolean
                }
            }
            filmmakers: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    name: string
                    profile_url: string | null
                    raw_form_data: any
                    ai_generated_bio: string | null
                    style_vector: number[] | null
                    status: string
                    user_id: string | null
                    payment_id: string | null
                    payment_amount: number | null
                    payment_currency: string
                    published_at: string | null
                    draft_data: any | null
                    profile_views: number
                    profile_clicks: number
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name: string
                    profile_url?: string | null
                    raw_form_data?: any
                    ai_generated_bio?: string | null
                    style_vector?: number[] | null
                    status?: string
                    user_id?: string | null
                    payment_id?: string | null
                    payment_amount?: number | null
                    payment_currency?: string
                    published_at?: string | null
                    draft_data?: any | null
                    profile_views?: number
                    profile_clicks?: number
                }
                Update: {
                    name?: string
                    profile_url?: string | null
                    raw_form_data?: any
                    ai_generated_bio?: string | null
                    style_vector?: number[] | null
                    status?: string
                    user_id?: string | null
                    payment_id?: string | null
                    payment_amount?: number | null
                    payment_currency?: string
                    published_at?: string | null
                    draft_data?: any | null
                    profile_views?: number
                    profile_clicks?: number
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    user_id: string
                    razorpay_subscription_id: string
                    razorpay_plan_id: string
                    plan_name: string
                    status: string
                    current_start: string | null
                    current_end: string | null
                    ended_at: string | null
                    amount: number
                    currency: string
                    billing_cycle_count: number
                    trial_start: string | null
                    trial_end: string | null
                    cancel_at_period_end: boolean
                    cancelled_at: string | null
                    cancellation_reason: string | null
                    metadata: any | null
                }
            }
            subscription_plans: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    name: string
                    display_name: string
                    description: string | null
                    razorpay_plan_id: string
                    amount: number
                    currency: string
                    interval: string
                    interval_count: number
                    trial_period_days: number
                    is_active: boolean
                    features: any | null
                    metadata: any | null
                }
            }
            payments: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    user_id: string
                    filmmaker_id: string | null
                    payment_gateway: string
                    payment_intent_id: string | null
                    razorpay_order_id: string | null
                    razorpay_payment_id: string | null
                    razorpay_signature: string | null
                    amount: number
                    currency: string
                    status: string
                    payment_method: string | null
                    is_subscription: boolean
                    subscription_id: string | null
                    metadata: any | null
                    error_message: string | null
                    refund_amount: number | null
                    refunded_at: string | null
                }
            }
            profile_drafts: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    user_id: string
                    filmmaker_id: string | null
                    draft_data: any
                    current_step: number
                    is_complete: boolean
                    last_saved_at: string
                }
            }
        }
    }
}
