-- Create organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  team_type VARCHAR(100),
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  weekly_capacity_hours INTEGER DEFAULT 40,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create opportunities table with all required fields
CREATE TABLE opportunities (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  function VARCHAR(100),
  current_stage VARCHAR(50) NOT NULL DEFAULT 'product',
  status VARCHAR(50) NOT NULL DEFAULT 'in-progress',
  priority VARCHAR(50) DEFAULT 'medium',
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  problem_statement TEXT,
  business_sponsor VARCHAR(255),
  business_team VARCHAR(255),
  business_value TEXT,
  quality_value TEXT,
  jira_epic_id VARCHAR(100),
  jira_epic_url TEXT,
  jira_story_id VARCHAR(100),
  jira_story_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create opportunity_stage_history table
CREATE TABLE opportunity_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id VARCHAR(50) REFERENCES opportunities(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  duration_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id VARCHAR(50) PRIMARY KEY,
  opportunity_id VARCHAR(50) REFERENCES opportunities(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(100),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attachments table
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id VARCHAR(50) REFERENCES opportunities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size VARCHAR(50),
  url TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE feedback (
  id VARCHAR(50) PRIMARY KEY,
  opportunity_id VARCHAR(50) REFERENCES opportunities(id) ON DELETE CASCADE,
  from_team VARCHAR(100) NOT NULL,
  to_team VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  team_type VARCHAR(100),
  description TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  capacity_percentage INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create opportunity_assignments table
CREATE TABLE opportunity_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id VARCHAR(50) REFERENCES opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create work_items table
CREATE TABLE work_items (
  id VARCHAR(50) PRIMARY KEY,
  opportunity_id VARCHAR(50) REFERENCES opportunities(id) ON DELETE CASCADE,
  project VARCHAR(255),
  title VARCHAR(500) NOT NULL,
  item_type VARCHAR(50),
  status VARCHAR(100),
  status_group VARCHAR(50),
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  story_points INTEGER,
  component VARCHAR(255),
  sprint VARCHAR(255),
  is_planned BOOLEAN DEFAULT FALSE,
  reopened BOOLEAN DEFAULT FALSE,
  blocked_hours INTEGER DEFAULT 0,
  blocker_reason TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create work_item_labels table
CREATE TABLE work_item_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_item_id VARCHAR(50) REFERENCES work_items(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_capacity_history table
CREATE TABLE user_capacity_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  capacity_percentage INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_opportunities_current_stage ON opportunities(current_stage);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_owner_id ON opportunities(owner_id);
CREATE INDEX idx_opportunity_stage_history_opportunity_id ON opportunity_stage_history(opportunity_id);
CREATE INDEX idx_comments_opportunity_id ON comments(opportunity_id);
CREATE INDEX idx_work_items_opportunity_id ON work_items(opportunity_id);

SELECT 'Schema created successfully' as status;
