-- Seed Beta Plan to ensure foreign keys work
INSERT INTO subscription_plans (
    id, 
    name, 
    display_name, 
    description, 
    amount, 
    currency, 
    interval, 
    is_active, 
    features,
    created_at,
    updated_at
)
VALUES (
  'beta_pro',
  'Beta Pro',
  'CineGrok Beta',
  'Exclusive early access plan',
  0,
  'inr',
  'monthly',
  true,
  '["Early access", "Profile publishing", "Community access"]'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
    is_active = true, 
    display_name = 'CineGrok Beta';
