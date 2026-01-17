-- Seed Beta Plan to ensure foreign keys work
INSERT INTO subscription_plans (
    id, 
    name, 
    display_name, 
    description, 
    amount, 
    currency, 
    interval, 
    interval_count,
    trial_period_days,
    is_active, 
    features,
    razorpay_plan_id,
    created_at,
    updated_at
)
VALUES (
  '907a362a-0466-4148-8df0-7a0410651759', -- Valid UUID
  'beta_pro',
  'CineGrok Beta',
  'Exclusive early access plan',
  0,
  'inr',
  'monthly',
  1, -- interval_count
  0, -- trial_period_days
  true,
  '["Early access", "Profile publishing", "Community access"]'::jsonb,
  'plan_beta_free_001', -- Dummy Razorpay ID for free plan
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
    is_active = true, 
    display_name = 'CineGrok Beta';
