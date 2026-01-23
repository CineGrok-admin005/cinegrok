-- RPC to handle Razorpay payment success atomically
-- Updates subscription status and publishes filmmaker if applicable

CREATE OR REPLACE FUNCTION handle_razorpay_subscription_success(
    p_user_id UUID,
    p_subscription_id TEXT,
    p_plan_id TEXT,
    p_current_start TIMESTAMPTZ,
    p_current_end TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_filmmaker_id UUID;
    v_result JSONB;
BEGIN
    -- 1. Upsert Subscription Record
    INSERT INTO subscriptions (
        user_id,
        razorpay_subscription_id,
        razorpay_plan_id,
        status,
        current_start,
        current_end,
        payment_failure_count,
        updated_at
    ) VALUES (
        p_user_id,
        p_subscription_id,
        p_plan_id,
        'active',
        p_current_start,
        p_current_end,
        0,
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        razorpay_subscription_id = EXCLUDED.razorpay_subscription_id,
        razorpay_plan_id = EXCLUDED.razorpay_plan_id,
        status = 'active',
        current_start = EXCLUDED.current_start,
        current_end = EXCLUDED.current_end,
        payment_failure_count = 0,
        updated_at = NOW();

    -- 2. Update Filmmaker Status
    -- We select the ID to return it, and update the status
    UPDATE filmmakers
    SET
        subscription_status = 'active',
        is_published = true,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING id INTO v_filmmaker_id;

    -- If filmmaker record doesn't exist yet (edge case), we don't create it here
    -- But we return what we did
    
    v_result := jsonb_build_object(
        'success', true,
        'filmmaker_id', v_filmmaker_id,
        'user_id', p_user_id
    );

    RETURN v_result;

EXCEPTION WHEN OTHERS THEN
    -- Log error (if you have a logs table, otherwise just raise)
    RAISE EXCEPTION 'Transaction failed: %', SQLERRM;
END;
$$;
