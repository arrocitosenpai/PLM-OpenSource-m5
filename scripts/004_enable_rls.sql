-- NUVIO PLM Row Level Security (RLS) Policies
-- Version 1.0

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_item_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_capacity_history ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Users policies
CREATE POLICY "Users can view users in their organization"
  ON users FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- Teams policies
CREATE POLICY "Users can view teams in their organization"
  ON teams FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Team members policies
CREATE POLICY "Users can view team members in their organization"
  ON team_members FOR SELECT
  USING (team_id IN (
    SELECT id FROM teams WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

-- Opportunities policies
CREATE POLICY "Users can view opportunities in their organization"
  ON opportunities FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can create opportunities in their organization"
  ON opportunities FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update opportunities in their organization"
  ON opportunities FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Opportunity stage history policies
CREATE POLICY "Users can view stage history for opportunities in their organization"
  ON opportunity_stage_history FOR SELECT
  USING (opportunity_id IN (
    SELECT id FROM opportunities WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

-- Opportunity assignments policies
CREATE POLICY "Users can view assignments for opportunities in their organization"
  ON opportunity_assignments FOR SELECT
  USING (opportunity_id IN (
    SELECT id FROM opportunities WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

-- Comments policies
CREATE POLICY "Users can view comments for opportunities in their organization"
  ON comments FOR SELECT
  USING (opportunity_id IN (
    SELECT id FROM opportunities WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can create comments for opportunities in their organization"
  ON comments FOR INSERT
  WITH CHECK (opportunity_id IN (
    SELECT id FROM opportunities WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

-- Feedback policies
CREATE POLICY "Users can view feedback for opportunities in their organization"
  ON feedback FOR SELECT
  USING (opportunity_id IN (
    SELECT id FROM opportunities WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can create feedback for opportunities in their organization"
  ON feedback FOR INSERT
  WITH CHECK (opportunity_id IN (
    SELECT id FROM opportunities WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can update feedback they can view"
  ON feedback FOR UPDATE
  USING (opportunity_id IN (
    SELECT id FROM opportunities WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

-- Attachments policies
CREATE POLICY "Users can view attachments for opportunities in their organization"
  ON attachments FOR SELECT
  USING (opportunity_id IN (
    SELECT id FROM opportunities WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can create attachments for opportunities in their organization"
  ON attachments FOR INSERT
  WITH CHECK (opportunity_id IN (
    SELECT id FROM opportunities WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

-- Work items policies
CREATE POLICY "Users can view work items in their organization"
  ON work_items FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can create work items in their organization"
  ON work_items FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update work items in their organization"
  ON work_items FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Work item labels policies
CREATE POLICY "Users can view labels for work items in their organization"
  ON work_item_labels FOR SELECT
  USING (work_item_id IN (
    SELECT id FROM work_items WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

-- User capacity history policies
CREATE POLICY "Users can view capacity history for users in their organization"
  ON user_capacity_history FOR SELECT
  USING (user_id IN (
    SELECT id FROM users WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));
