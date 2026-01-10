-- CineGrok Database Schema V2
-- Updated schema for new profile creation workflow with authentication and subscriptions

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================
-- Note: Supabase Auth handles the auth.users table automatically
-- We'll create a public profiles table that references it

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic Info
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Subscription Status
  subscription_status TEXT DEFAULT 'inactive',
  -- Possible values: 'inactive', 'active', 'cancelled', 'past_due', 'trialing'
  
  subscription_plan TEXT,
  -- Possible values: 'monthly', 'yearly'
  
  subscription_id TEXT,
  -- Razorpay subscription ID
  
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  
  -- Filmmaker Profile Reference
  filmmaker_id UUID REFERENCES filmmakers(id) ON DELETE SET NULL,
  
  -- Metadata
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- FILMMAKERS TABLE (Updated)
-- ============================================================================
-- Drop and recreate with new columns
-- WARNING: This will delete existing data. For production, use ALTER TABLE instead.

-- For development: Drop existing table
-- DROP TABLE IF EXISTS filmmakers CASCADE;

-- Create updated filmmakers table
-- Note: If you have existing data, use ALTER TABLE commands instead of DROP/CREATE

ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
-- Possible values: 'draft', 'payment_pending', 'published', 'suspended'

ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS legalname TEXT;
ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS payment_amount INTEGER;
ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS payment_currency TEXT DEFAULT 'INR';
ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS draft_data JSONB;
-- Stores in-progress form data before payment

ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0;
ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS profile_clicks INTEGER DEFAULT 0;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_filmmakers_status ON filmmakers(status);
CREATE INDEX IF NOT EXISTS idx_filmmakers_user_id ON filmmakers(user_id);
CREATE INDEX IF NOT EXISTS idx_filmmakers_published_at ON filmmakers(published_at DESC);

-- ============================================================================
-- PAYMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- References
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filmmaker_id UUID REFERENCES filmmakers(id) ON DELETE SET NULL,
  
  -- Payment Gateway Info
  payment_gateway TEXT DEFAULT 'razorpay',
  payment_intent_id TEXT UNIQUE,
  -- Razorpay payment ID or order ID
  
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  
  -- Payment Details
  amount INTEGER NOT NULL,
  -- Amount in smallest currency unit (paise for INR)
  
  currency TEXT DEFAULT 'INR',
  
  status TEXT DEFAULT 'pending',
  -- Possible values: 'pending', 'processing', 'succeeded', 'failed', 'refunded'
  
  payment_method TEXT,
  -- e.g., 'card', 'upi', 'netbanking', 'wallet'
  
  -- Subscription Info (if applicable)
  is_subscription BOOLEAN DEFAULT FALSE,
  subscription_id TEXT,
  
  -- Metadata
  metadata JSONB,
  error_message TEXT,
  refund_amount INTEGER,
  refunded_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- References
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Razorpay Subscription Info
  razorpay_subscription_id TEXT UNIQUE NOT NULL,
  razorpay_plan_id TEXT NOT NULL,
  
  -- Subscription Details
  plan_name TEXT NOT NULL,
  -- e.g., 'monthly', 'yearly'
  
  status TEXT DEFAULT 'created',
  -- Possible values: 'created', 'authenticated', 'active', 'paused', 'halted', 'cancelled', 'completed', 'expired'
  
  current_start TIMESTAMP WITH TIME ZONE,
  current_end TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Billing
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  billing_cycle_count INTEGER DEFAULT 0,
  
  -- Trial Info
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  
  -- Cancellation
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  
  -- Metadata
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay_id ON subscriptions(razorpay_subscription_id);

-- ============================================================================
-- SUBSCRIPTION PLANS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Plan Details
  name TEXT UNIQUE NOT NULL,
  -- e.g., 'monthly', 'yearly'
  
  display_name TEXT NOT NULL,
  -- e.g., 'Monthly Plan', 'Yearly Plan'
  
  description TEXT,
  
  -- Razorpay Plan ID
  razorpay_plan_id TEXT UNIQUE NOT NULL,
  
  -- Pricing
  amount INTEGER NOT NULL,
  -- Amount in smallest currency unit (paise for INR)
  
  currency TEXT DEFAULT 'INR',
  
  interval TEXT NOT NULL,
  -- 'monthly' or 'yearly'
  
  interval_count INTEGER DEFAULT 1,
  
  -- Trial
  trial_period_days INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Features (JSON array of features)
  features JSONB,
  
  -- Metadata
  metadata JSONB
);

-- Insert default plans (you can update these later via admin panel)
INSERT INTO subscription_plans (name, display_name, description, razorpay_plan_id, amount, interval, features)
VALUES 
  ('monthly', 'Monthly Plan', 'Full access to CineGrok profile features', 'plan_monthly_placeholder', 29900, 'monthly', 
   '["Create and manage filmmaker profile", "AI-generated bio", "Unlimited profile updates", "Analytics dashboard", "Featured in browse section"]'::jsonb),
  ('yearly', 'Yearly Plan', 'Full access to CineGrok profile features (Save 2 months!)', 'plan_yearly_placeholder', 299900, 'yearly',
   '["Create and manage filmmaker profile", "AI-generated bio", "Unlimited profile updates", "Analytics dashboard", "Featured in browse section", "Priority support"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- PROFILE DRAFTS TABLE (Optional - for better draft management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profile_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- References
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filmmaker_id UUID REFERENCES filmmakers(id) ON DELETE CASCADE,
  
  -- Draft Data
  draft_data JSONB NOT NULL,
  
  -- Progress Tracking
  current_step INTEGER DEFAULT 1,
  -- Which step of the form wizard the user is on
  
  is_complete BOOLEAN DEFAULT FALSE,
  
  -- Auto-save metadata
  last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_drafts_user_id ON profile_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_drafts_updated_at ON profile_drafts(updated_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE filmmakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_drafts ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see and update their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Filmmakers: Public can view published profiles, users can manage their own
CREATE POLICY "Anyone can view published filmmaker profiles"
  ON filmmakers FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own filmmaker profile"
  ON filmmakers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own filmmaker profile"
  ON filmmakers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own filmmaker profile"
  ON filmmakers FOR DELETE
  USING (auth.uid() = user_id);

-- Payments: Users can only see their own payments
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Subscriptions: Users can only see their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Profile Drafts: Users can only see and manage their own drafts
CREATE POLICY "Users can view their own drafts"
  ON profile_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts"
  ON profile_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts"
  ON profile_drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts"
  ON profile_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- Subscription Plans: Anyone can view active plans (for pricing page)
CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans FOR SELECT
  USING (is_active = true);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_filmmakers_updated_at BEFORE UPDATE ON filmmakers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_drafts_updated_at BEFORE UPDATE ON profile_drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ANALYTICS & TRACKING
-- ============================================================================

-- Function to increment profile views
CREATE OR REPLACE FUNCTION increment_profile_views(filmmaker_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE filmmakers
  SET profile_views = profile_views + 1
  WHERE id = filmmaker_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to increment profile clicks
CREATE OR REPLACE FUNCTION increment_profile_clicks(filmmaker_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE filmmakers
  SET profile_clicks = profile_clicks + 1
  WHERE id = filmmaker_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles linked to Supabase Auth';
COMMENT ON TABLE filmmakers IS 'Filmmaker profiles with portfolio and bio';
COMMENT ON TABLE payments IS 'Payment transactions via Razorpay';
COMMENT ON TABLE subscriptions IS 'Active and historical subscriptions';
COMMENT ON TABLE subscription_plans IS 'Available subscription plans';
COMMENT ON TABLE profile_drafts IS 'Draft profiles being created';

-- ============================================================================
-- NOTES FOR PRODUCTION MIGRATION
-- ============================================================================

-- If you have existing data in the filmmakers table, run these ALTER commands
-- instead of DROP/CREATE:
--
-- ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
-- ALTER TABLE filmmakers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
-- -- Set existing profiles to 'published' status
-- UPDATE filmmakers SET status = 'published' WHERE ai_generated_bio IS NOT NULL;
