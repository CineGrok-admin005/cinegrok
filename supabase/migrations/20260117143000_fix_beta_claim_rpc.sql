-- Migration to fix claim_beta_and_publish RPC function
-- Fixes:
-- 1. Explicitly sets status = 'published' for visibility
-- 2. Links the filmmaker_id to the profiles table
-- 3. Sets is_published = true

CREATE OR REPLACE FUNCTION claim_beta_and_publish(
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
BEGIN
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
    INSERT INTO subscriptions (
        user_id,
        plan_id,
        status,
        amount,
        currency,
        current_start,
        current_end,
        updated_at
    ) VALUES (
        p_user_id,
        p_plan_id,
        'beta',
        0,
        v_plan.currency,
        now(),
        v_end_date,
        now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        plan_id = p_plan_id,
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
        is_published,
        status,
        subscription_status,
        version,
        created_at,
        updated_at
    ) VALUES (
        p_user_id,
        COALESCE(p_draft_data->>'stageName', p_draft_data->>'name', 'Unnamed'),
        p_draft_data,
        true,
        'published',
        'beta',
        1,
        now(),
        now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        name = COALESCE(p_draft_data->>'stageName', p_draft_data->>'name', filmmakers.name),
        raw_form_data = p_draft_data,
        is_published = true,
        status = 'published',
        subscription_status = 'beta',
        version = filmmakers.version + 1,
        updated_at = now()
    RETURNING id INTO v_filmmaker_id;
    
    -- Link filmmaker to user profile (CRITICAL FIX)
    UPDATE profiles
    SET filmmaker_id = v_filmmaker_id, updated_at = now()
    WHERE id = p_user_id;

    -- Update profile_drafts to mark as published
    UPDATE profile_drafts 
    SET published_at = now(), updated_at = now()
    WHERE user_id = p_user_id;
    
    RETURN v_filmmaker_id;
END;
$$;
