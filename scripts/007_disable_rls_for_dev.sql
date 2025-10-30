-- Disable RLS for Development
-- This script disables Row Level Security to allow the application to work
-- without authentication during development and testing.
-- 
-- IMPORTANT: In production, you should enable RLS and create proper policies
-- based on your authentication setup.

-- Disable RLS on all tables
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities DISABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_stage_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE attachments DISABLE ROW LEVEL SECURITY;
ALTER TABLE work_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE work_item_labels DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_capacity_history DISABLE ROW LEVEL SECURITY;

-- Drop existing policies to clean up
DROP POLICY IF EXISTS "Users can view their own organization" ON organizations;
DROP POLICY IF EXISTS "Users can view users in their organization" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view teams in their organization" ON teams;
DROP POLICY IF EXISTS "Users can view team members in their organization" ON team_members;
DROP POLICY IF EXISTS "Users can view opportunities in their organization" ON opportunities;
DROP POLICY IF EXISTS "Users can create opportunities in their organization" ON opportunities;
DROP POLICY IF EXISTS "Users can update opportunities in their organization" ON opportunities;
DROP POLICY IF EXISTS "Users can view stage history for opportunities in their organization" ON opportunity_stage_history;
DROP POLICY IF EXISTS "Users can view assignments for opportunities in their organization" ON opportunity_assignments;
DROP POLICY IF EXISTS "Users can view comments for opportunities in their organization" ON comments;
DROP POLICY IF EXISTS "Users can create comments for opportunities in their organization" ON comments;
DROP POLICY IF EXISTS "Users can view feedback for opportunities in their organization" ON feedback;
DROP POLICY IF EXISTS "Users can create feedback for opportunities in their organization" ON feedback;
DROP POLICY IF EXISTS "Users can update feedback they can view" ON feedback;
DROP POLICY IF EXISTS "Users can view attachments for opportunities in their organization" ON attachments;
DROP POLICY IF EXISTS "Users can create attachments for opportunities in their organization" ON attachments;
DROP POLICY IF EXISTS "Users can view work items in their organization" ON work_items;
DROP POLICY IF EXISTS "Users can create work items in their organization" ON work_items;
DROP POLICY IF EXISTS "Users can update work items in their organization" ON work_items;
DROP POLICY IF EXISTS "Users can view labels for work items in their organization" ON work_item_labels;
DROP POLICY IF EXISTS "Users can view capacity history for users in their organization" ON user_capacity_history;
