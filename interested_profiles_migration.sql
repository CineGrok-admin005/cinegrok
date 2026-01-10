-- CineGrok: Interested Profiles Migration
-- Stores profiles that users have expressed interest in collaborating with

-- ============================================================================
-- INTERESTED PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS interested_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filmmaker_id UUID NOT NULL REFERENCES filmmakers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT, -- Optional: user can add notes about why they're interested
  UNIQUE(user_id, filmmaker_id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_interested_profiles_user_id ON interested_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_interested_profiles_filmmaker_id ON interested_profiles(filmmaker_id);
CREATE INDEX IF NOT EXISTS idx_interested_profiles_created_at ON interested_profiles(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE interested_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only view their own interested profiles
CREATE POLICY "Users can view their own interests"
  ON interested_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own interests
CREATE POLICY "Users can add their own interests"
  ON interested_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own interests
CREATE POLICY "Users can remove their own interests"
  ON interested_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Users can update their own interests (e.g., notes)
CREATE POLICY "Users can update their own interests"
  ON interested_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGER FOR UPDATED_AT (if we add it later)
-- ============================================================================
-- Note: Currently no updated_at column, but if added:
-- CREATE TRIGGER update_interested_profiles_updated_at 
--   BEFORE UPDATE ON interested_profiles
--   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
