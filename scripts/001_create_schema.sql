-- NUVIO PLM Database Schema
-- Version 1.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (for development - no auth.users FK constraint)
-- Removed REFERENCES auth.users to allow dummy data insertion
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Product Manager', 'Engineer', 'Platform Engineer', 'Viewer')),
  team_type VARCHAR(50) CHECK (team_type IN ('product', 'engineering', 'platform')),
  avatar_url TEXT,
  weekly_capacity_hours INTEGER DEFAULT 40,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  team_type VARCHAR(50) NOT NULL CHECK (team_type IN ('product', 'engineering', 'platform')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members junction table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  capacity_percentage INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id VARCHAR(50) PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(500) NOT NULL,
  function VARCHAR(100) NOT NULL CHECK (function IN ('Supply Chain', 'TS', 'Finance', 'Operations', 'Marketing', 'HR')),
  current_stage VARCHAR(50) NOT NULL CHECK (current_stage IN ('intake', 'product', 'engineering', 'platform', 'implementation', 'support')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('not-started', 'in-progress', 'need-clarification', 'completed', 'cancelled')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  problem_statement TEXT,
  business_sponsor VARCHAR(255),
  business_team VARCHAR(255),
  business_value TEXT,
  quality_value TEXT,
  jira_epic_id VARCHAR(100),
  jira_epic_url TEXT,
  jira_story_id VARCHAR(100),
  jira_story_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunity stage history
CREATE TABLE IF NOT EXISTS opportunity_stage_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id VARCHAR(50) REFERENCES opportunities(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL CHECK (stage IN ('intake', 'product', 'engineering', 'platform', 'implementation', 'support')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  duration_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunity assigned users junction table
CREATE TABLE IF NOT EXISTS opportunity_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id VARCHAR(50) REFERENCES opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(opportunity_id, user_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id VARCHAR(50) PRIMARY KEY,
  opportunity_id VARCHAR(50) REFERENCES opportunities(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table (inter-team communication)
CREATE TABLE IF NOT EXISTS feedback (
  id VARCHAR(50) PRIMARY KEY,
  opportunity_id VARCHAR(50) REFERENCES opportunities(id) ON DELETE CASCADE,
  from_team VARCHAR(50) NOT NULL CHECK (from_team IN ('product', 'engineering', 'platform')),
  to_team VARCHAR(50) NOT NULL CHECK (to_team IN ('product', 'engineering', 'platform')),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id VARCHAR(50) REFERENCES opportunities(id) ON DELETE CASCADE,
  name VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size VARCHAR(50) NOT NULL,
  url TEXT,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work items table (for analytics)
CREATE TABLE IF NOT EXISTS work_items (
  id VARCHAR(50) PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  opportunity_id VARCHAR(50) REFERENCES opportunities(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('Story', 'Bug', 'Task', 'Epic')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Review', 'QA', 'Done', 'Blocked')),
  status_group VARCHAR(50) NOT NULL CHECK (status_group IN ('todo', 'inprogress', 'review', 'done')),
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  project VARCHAR(255),
  component VARCHAR(100),
  sprint VARCHAR(100),
  story_points INTEGER DEFAULT 0,
  blocked_hours INTEGER DEFAULT 0,
  blocker_reason TEXT,
  reopened BOOLEAN DEFAULT FALSE,
  is_planned BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work item labels junction table
CREATE TABLE IF NOT EXISTS work_item_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_item_id VARCHAR(50) REFERENCES work_items(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(work_item_id, label)
);

-- User capacity history (for tracking over time)
CREATE TABLE IF NOT EXISTS user_capacity_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  capacity_percentage INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_opportunities_org ON opportunities(organization_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON opportunities(current_stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_owner ON opportunities(owner_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_history_opp ON opportunity_stage_history(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_comments_opp ON comments(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_feedback_opp ON feedback(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_feedback_to_team ON feedback(to_team, read);
CREATE INDEX IF NOT EXISTS idx_work_items_org ON work_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_work_items_assignee ON work_items(assignee_id);
CREATE INDEX IF NOT EXISTS idx_work_items_status ON work_items(status_group);
CREATE INDEX IF NOT EXISTS idx_work_items_completed ON work_items(completed_at);
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_teams_org ON teams(organization_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON opportunities;
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_work_items_updated_at ON work_items;
CREATE TRIGGER update_work_items_updated_at BEFORE UPDATE ON work_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
