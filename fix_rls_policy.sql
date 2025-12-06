-- POLICY: Anyone can view published filmmaker profiles
BEGIN;
  -- Ensure RLS is enabled
  ALTER TABLE filmmakers ENABLE ROW LEVEL SECURITY;

  -- Drop existing policy if it exists to avoid error
  DROP POLICY IF EXISTS "Anyone can view published filmmaker profiles" ON filmmakers;

  -- Create the policy
  CREATE POLICY "Anyone can view published filmmaker profiles"
  ON filmmakers FOR SELECT
  USING (status = 'published');
COMMIT;
