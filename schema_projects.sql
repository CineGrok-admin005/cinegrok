-- ============================================================================
-- CineGrok Projects & Collaboration Schema
-- Minimal MVP: Projects, Roles, Applications
-- ============================================================================

-- Projects Table
-- Stores project metadata created by directors/producers
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES filmmakers(id) ON DELETE CASCADE,
  
  -- Basic project info
  title VARCHAR(255) NOT NULL,
  project_code VARCHAR(8) UNIQUE NOT NULL, -- e.g., PRJ-K7M2 (auto-generated, shareable)
  description TEXT, -- Pitch/synopsis of the project
  
  -- Production logistics
  shoot_location VARCHAR(200),
  shoot_start_date DATE,
  shoot_end_date DATE,
  
  -- Budget info (optional, optional)
  budget_min DECIMAL(12, 2),
  budget_max DECIMAL(12, 2),
  is_paid BOOLEAN DEFAULT TRUE, -- TRUE = paid roles, FALSE = volunteer
  
  -- Project state
  status VARCHAR(50) NOT NULL DEFAULT 'casting', -- casting, preproduction, shooting, postproduction, completed
  applications_open BOOLEAN DEFAULT TRUE,
  
  -- Announcements & updates
  announcements TEXT, -- Latest project updates/announcements
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT project_code_format CHECK (project_code ~ '^PRJ-[A-Z0-9]{4}$')
);

-- Project Roles
-- Lists all positions/roles needed for a project
CREATE TABLE project_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Role definition
  role_title VARCHAR(100) NOT NULL, -- e.g., "Lead Actress", "Cinematographer"
  role_description TEXT, -- What we're looking for (personality, skills, requirements)
  role_category VARCHAR(50) NOT NULL, -- 'actor' or 'crew'
  
  -- Experience requirements
  experience_level VARCHAR(50) NOT NULL DEFAULT 'intermediate', -- entry, intermediate, expert
  
  -- Quantity tracking
  quantity_needed INT NOT NULL DEFAULT 1,
  filled_count INT NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_experience CHECK (experience_level IN ('entry', 'intermediate', 'expert')),
  CONSTRAINT valid_category CHECK (role_category IN ('actor', 'crew')),
  CONSTRAINT positive_quantity CHECK (quantity_needed > 0),
  CONSTRAINT valid_filled CHECK (filled_count >= 0 AND filled_count <= quantity_needed)
);

-- Project Applications
-- When a filmmaker applies to a role in a project
CREATE TABLE project_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES project_roles(id) ON DELETE CASCADE,
  filmmaker_id UUID NOT NULL REFERENCES filmmakers(id) ON DELETE CASCADE,
  
  -- Application content
  portfolio_url TEXT, -- Link to reel, IMDb, website, etc.
  cover_letter TEXT, -- Optional message from filmmaker
  
  -- Application state
  status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- submitted, under_review, accepted, rejected
  producer_notes TEXT, -- Private notes from producer (not shared with filmmaker)
  
  applied_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  
  -- Prevent duplicate applications for same role
  UNIQUE(project_id, role_id, filmmaker_id),
  CONSTRAINT valid_status CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected'))
);

-- Indexes for performance
CREATE INDEX idx_projects_creator ON projects(creator_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_roles_project ON project_roles(project_id);
CREATE INDEX idx_project_apps_project ON project_applications(project_id);
CREATE INDEX idx_project_apps_filmmaker ON project_applications(filmmaker_id);
CREATE INDEX idx_project_apps_status ON project_applications(status);

-- ============================================================================
-- Helper: Generate unique project code
-- Usage: SELECT generate_project_code() to get PRJ-XXXX
-- ============================================================================
CREATE OR REPLACE FUNCTION generate_project_code()
RETURNS VARCHAR(8) AS $$
DECLARE
  code VARCHAR(8);
  counter INT := 0;
BEGIN
  LOOP
    code := 'PRJ-' || SUBSTR('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 
                             (RANDOM() * 35)::INT + 1, 1) ||
                      SUBSTR('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 
                             (RANDOM() * 35)::INT + 1, 1) ||
                      SUBSTR('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 
                             (RANDOM() * 35)::INT + 1, 1) ||
                      SUBSTR('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 
                             (RANDOM() * 35)::INT + 1, 1);
    
    -- Check if code already exists
    IF NOT EXISTS (SELECT 1 FROM projects WHERE project_code = code) THEN
      RETURN code;
    END IF;
    
    counter := counter + 1;
    IF counter > 100 THEN
      RAISE EXCEPTION 'Failed to generate unique project code after 100 attempts';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- Projects RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "creators_can_view_own_projects" ON projects
  FOR SELECT USING (auth.uid() = creator_id OR status = 'open');

CREATE POLICY "creators_can_insert_projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "creators_can_update_own_projects" ON projects
  FOR UPDATE USING (auth.uid() = creator_id);

-- Project Roles RLS
ALTER TABLE project_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_view_open_project_roles" ON project_roles
  FOR SELECT USING (
    (SELECT status FROM projects WHERE id = project_id) = 'open' OR
    auth.uid() = (SELECT creator_id FROM projects WHERE id = project_id)
  );

-- Project Applications RLS
ALTER TABLE project_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "filmmakers_can_apply" ON project_applications
  FOR INSERT WITH CHECK (auth.uid() = filmmaker_id);

CREATE POLICY "filmmakers_can_view_own_applications" ON project_applications
  FOR SELECT USING (auth.uid() = filmmaker_id);

CREATE POLICY "producers_can_view_applications" ON project_applications
  FOR SELECT USING (
    auth.uid() = (SELECT creator_id FROM projects WHERE id = project_id)
  );

CREATE POLICY "producers_can_update_applications" ON project_applications
  FOR UPDATE USING (
    auth.uid() = (SELECT creator_id FROM projects WHERE id = project_id)
  );
