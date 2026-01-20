-- Migration to fix claim_beta_and_publish RPC function
-- FIXES: 
-- 1. The subscriptions table uses different column names than what the RPC was using
-- 2. Multiple conflicting function signatures exist

-- FIRST: Drop all existing versions to avoid conflicts
DROP FUNCTION IF EXISTS public.claim_beta_and_publish(UUID, UUID, JSONB);
DROP FUNCTION IF EXISTS public.claim_beta_and_publish(UUID, TEXT, JSONB);

-- NOW: Create the corrected function
CREATE OR REPLACE FUNCTION public.claim_beta_and_publish(
    p_user_id UUID,
    p_plan_id UUID,
    p_draft_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_plan RECORD;
    v_end_date TIMESTAMPTZ;
    v_filmmaker_id UUID;
    v_subscription_id UUID;
    v_bio TEXT;
BEGIN
    -- Extract bio from draft data (injected by client)
    v_bio := p_draft_data->>'bio';

    -- Get plan details
    SELECT * INTO v_plan FROM subscription_plans WHERE id = p_plan_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid plan ID';
    END IF;
    
    -- Calculate end date based on plan interval
    IF v_plan.interval = 'monthly' THEN
        v_end_date := now() + (v_plan.interval_count * INTERVAL '1 month');
    ELSE
        v_end_date := now() + (v_plan.interval_count * INTERVAL '1 year');
    END IF;
    
    -- Create or update subscription (beta status, amount = 0)
    -- FIXED: Using correct column names for subscriptions table
    INSERT INTO subscriptions (
        user_id,
        razorpay_plan_id,
        plan_name,
        razorpay_subscription_id,
        status,
        amount,
        currency,
        current_start,
        current_end,
        billing_cycle_count,
        updated_at
    ) VALUES (
        p_user_id,
        v_plan.razorpay_plan_id,
        v_plan.name,
        'beta_' || gen_random_uuid()::text,
        'beta',
        0,
        v_plan.currency,
        now(),
        v_end_date,
        0,
        now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        razorpay_plan_id = v_plan.razorpay_plan_id,
        plan_name = v_plan.name,
        status = 'beta',
        amount = 0,
        current_start = now(),
        current_end = v_end_date,
        updated_at = now()
    RETURNING id INTO v_subscription_id;
    
    -- Create or update filmmaker profile (published)
    INSERT INTO filmmakers (
        user_id,
        name,
        raw_form_data,
        status,
        generated_bio,
        created_at,
        updated_at
    ) VALUES (
        p_user_id,
        COALESCE(p_draft_data->>'stageName', p_draft_data->>'name', 'Unnamed'),
        p_draft_data,
        'published',
        v_bio,
        now(),
        now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        name = COALESCE(p_draft_data->>'stageName', p_draft_data->>'name', filmmakers.name),
        raw_form_data = p_draft_data,
        status = 'published',
        generated_bio = COALESCE(v_bio, filmmakers.generated_bio),
        updated_at = now()
    RETURNING id INTO v_filmmaker_id;
    
    -- Link filmmaker to user profile
    UPDATE profiles
    SET filmmaker_id = v_filmmaker_id, updated_at = now()
    WHERE id = p_user_id;

    -- Update profile_drafts to mark as published (if exists)
    UPDATE profile_drafts 
    SET updated_at = now()
    WHERE user_id = p_user_id;
    
    RETURN v_filmmaker_id;
END;
$$;
