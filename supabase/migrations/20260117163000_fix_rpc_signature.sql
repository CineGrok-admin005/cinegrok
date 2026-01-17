-- Drop the incorrect function signature to avoid ambiguity (optional but good practice)
DROP FUNCTION IF EXISTS claim_beta_and_publish(UUID, JSONB);

-- Re-create function with correct signature (accepting p_plan_id)
CREATE OR REPLACE FUNCTION claim_beta_and_publish(
  p_user_id UUID,
  p_plan_id TEXT, -- Accepting plan ID (string/uuid)
  p_draft_data JSONB
)
RETURNS TABLE (
  filmmaker_id UUID,
  subscription_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_filmmaker_id UUID;
  v_subscription_id UUID;
  v_generated_bio TEXT;
BEGIN
  -- Extract bio from draft data
  v_generated_bio := p_draft_data->>'bio';

  -- 1. Create/Update Filmmaker Profile
  SELECT id INTO v_filmmaker_id FROM filmmakers WHERE user_id = p_user_id;

  IF v_filmmaker_id IS NOT NULL THEN
    UPDATE filmmakers
    SET
      raw_form_data = p_draft_data,
      generated_bio = COALESCE(v_generated_bio, generated_bio),
      status = 'published',
      updated_at = NOW()
    WHERE id = v_filmmaker_id;
  ELSE
    INSERT INTO filmmakers (
      user_id,
      name,
      stage_name,
      email,
      status,
      raw_form_data,
      generated_bio,
      published_at
    )
    VALUES (
      p_user_id,
      p_draft_data->>'stageName',
      p_draft_data->>'stageName',
      p_draft_data->>'email',
      'published',
      p_draft_data,
      v_generated_bio,
      NOW()
    )
    RETURNING id INTO v_filmmaker_id;
  END IF;

  -- 2. Link User Profile
  UPDATE profiles
  SET filmmaker_id = v_filmmaker_id
  WHERE id = p_user_id;

  -- 3. Create Subscription using p_plan_id
  INSERT INTO subscriptions (
    user_id,
    plan_id,
    status,
    current_period_start,
    current_period_end
  )
  VALUES (
    p_user_id,
    p_plan_id, -- Use the passed plan ID
    'active',
    NOW(),
    NOW() + INTERVAL '1 year'
  )
  RETURNING id INTO v_subscription_id;

  -- 4. Cleanup Drafts
  DELETE FROM profile_drafts WHERE user_id = p_user_id;

  RETURN QUERY SELECT v_filmmaker_id, v_subscription_id;
END;
$$;
