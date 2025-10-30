-- Drop all foreign key constraints first to allow clean seeding
ALTER TABLE IF EXISTS users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE IF EXISTS users DROP CONSTRAINT IF EXISTS users_organization_id_fkey;
ALTER TABLE IF EXISTS teams DROP CONSTRAINT IF EXISTS teams_organization_id_fkey;
ALTER TABLE IF EXISTS team_members DROP CONSTRAINT IF EXISTS team_members_user_id_fkey;
ALTER TABLE IF EXISTS team_members DROP CONSTRAINT IF EXISTS team_members_team_id_fkey;
ALTER TABLE IF EXISTS opportunities DROP CONSTRAINT IF EXISTS opportunities_owner_id_fkey;
ALTER TABLE IF EXISTS opportunities DROP CONSTRAINT IF EXISTS opportunities_organization_id_fkey;
ALTER TABLE IF EXISTS opportunity_assignments DROP CONSTRAINT IF EXISTS opportunity_assignments_user_id_fkey;
ALTER TABLE IF EXISTS opportunity_assignments DROP CONSTRAINT IF EXISTS opportunity_assignments_opportunity_id_fkey;
ALTER TABLE IF EXISTS opportunity_stage_history DROP CONSTRAINT IF EXISTS opportunity_stage_history_opportunity_id_fkey;
ALTER TABLE IF EXISTS comments DROP CONSTRAINT IF EXISTS comments_author_id_fkey;
ALTER TABLE IF EXISTS comments DROP CONSTRAINT IF EXISTS comments_opportunity_id_fkey;
ALTER TABLE IF EXISTS feedback DROP CONSTRAINT IF EXISTS feedback_opportunity_id_fkey;
ALTER TABLE IF EXISTS work_items DROP CONSTRAINT IF EXISTS work_items_organization_id_fkey;
ALTER TABLE IF EXISTS work_items DROP CONSTRAINT IF EXISTS work_items_assignee_id_fkey;
ALTER TABLE IF EXISTS work_items DROP CONSTRAINT IF EXISTS work_items_team_id_fkey;
ALTER TABLE IF EXISTS work_items DROP CONSTRAINT IF EXISTS work_items_opportunity_id_fkey;
ALTER TABLE IF EXISTS work_item_labels DROP CONSTRAINT IF EXISTS work_item_labels_work_item_id_fkey;
ALTER TABLE IF EXISTS attachments DROP CONSTRAINT IF EXISTS attachments_uploaded_by_fkey;
ALTER TABLE IF EXISTS attachments DROP CONSTRAINT IF EXISTS attachments_opportunity_id_fkey;
ALTER TABLE IF EXISTS user_capacity_history DROP CONSTRAINT IF EXISTS user_capacity_history_user_id_fkey;

-- Clear existing data
TRUNCATE TABLE work_item_labels CASCADE;
TRUNCATE TABLE work_items CASCADE;
TRUNCATE TABLE attachments CASCADE;
TRUNCATE TABLE feedback CASCADE;
TRUNCATE TABLE comments CASCADE;
TRUNCATE TABLE opportunity_stage_history CASCADE;
TRUNCATE TABLE opportunity_assignments CASCADE;
TRUNCATE TABLE opportunities CASCADE;
TRUNCATE TABLE user_capacity_history CASCADE;
TRUNCATE TABLE team_members CASCADE;
TRUNCATE TABLE teams CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE organizations CASCADE;

-- Insert Organizations
INSERT INTO organizations (id, name, slug, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'NUVIO Technologies', 'nuvio-tech', NOW(), NOW());

-- Insert Users
INSERT INTO users (id, email, full_name, role, team_type, organization_id, weekly_capacity_hours, avatar_url, created_at, updated_at) VALUES
('10000000-0000-0000-0000-000000000001', 'sarah.chen@nuvio.com', 'Sarah Chen', 'Product Manager', 'Product', '00000000-0000-0000-0000-000000000001', 40, '/placeholder.svg?height=40&width=40', NOW(), NOW()),
('10000000-0000-0000-0000-000000000002', 'mike.johnson@nuvio.com', 'Mike Johnson', 'Engineering Lead', 'Engineering', '00000000-0000-0000-0000-000000000001', 40, '/placeholder.svg?height=40&width=40', NOW(), NOW()),
('10000000-0000-0000-0000-000000000003', 'emily.rodriguez@nuvio.com', 'Emily Rodriguez', 'Platform Architect', 'Platform', '00000000-0000-0000-0000-000000000001', 40, '/placeholder.svg?height=40&width=40', NOW(), NOW()),
('10000000-0000-0000-0000-000000000004', 'david.kim@nuvio.com', 'David Kim', 'Senior Developer', 'Engineering', '00000000-0000-0000-0000-000000000001', 40, '/placeholder.svg?height=40&width=40', NOW(), NOW()),
('10000000-0000-0000-0000-000000000005', 'lisa.patel@nuvio.com', 'Lisa Patel', 'UX Designer', 'Product', '00000000-0000-0000-0000-000000000001', 40, '/placeholder.svg?height=40&width=40', NOW(), NOW()),
('10000000-0000-0000-0000-000000000006', 'james.wilson@nuvio.com', 'James Wilson', 'DevOps Engineer', 'Platform', '00000000-0000-0000-0000-000000000001', 40, '/placeholder.svg?height=40&width=40', NOW(), NOW()),
('10000000-0000-0000-0000-000000000007', 'anna.martinez@nuvio.com', 'Anna Martinez', 'QA Lead', 'Engineering', '00000000-0000-0000-0000-000000000001', 40, '/placeholder.svg?height=40&width=40', NOW(), NOW()),
('10000000-0000-0000-0000-000000000008', 'robert.taylor@nuvio.com', 'Robert Taylor', 'Product Owner', 'Product', '00000000-0000-0000-0000-000000000001', 40, '/placeholder.svg?height=40&width=40', NOW(), NOW());

-- Insert Teams
INSERT INTO teams (id, name, team_type, description, organization_id, created_at, updated_at) VALUES
('20000000-0000-0000-0000-000000000001', 'Product Team', 'Product', 'Responsible for product strategy and roadmap', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('20000000-0000-0000-0000-000000000002', 'Engineering Team', 'Engineering', 'Core development and implementation', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('20000000-0000-0000-0000-000000000003', 'Platform Team', 'Platform', 'Infrastructure and platform services', '00000000-0000-0000-0000-000000000001', NOW(), NOW());

-- Insert Team Members
INSERT INTO team_members (id, team_id, user_id, capacity_percentage, created_at) VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 100, NOW()),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 100, NOW()),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008', 100, NOW()),
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 100, NOW()),
('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004', 100, NOW()),
('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000007', 100, NOW()),
('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 100, NOW()),
('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000006', 100, NOW());

-- Insert Opportunities
INSERT INTO opportunities (id, name, function, current_stage, status, priority, problem_statement, business_sponsor, business_team, business_value, quality_value, owner_id, organization_id, created_at, updated_at) VALUES
('OPP-001', 'Customer Portal Redesign', 'Customer Experience', 'engineering', 'active', 'high', 'Current customer portal has poor UX and low engagement rates', 'Jane Smith', 'Customer Success', 'Increase customer satisfaction by 30%', 'Reduce support tickets by 25%', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '45 days', NOW()),
('OPP-002', 'API Rate Limiting', 'Infrastructure', 'platform', 'active', 'critical', 'Need to implement rate limiting to prevent API abuse', 'John Doe', 'Engineering', 'Protect system resources and ensure fair usage', 'Improve system stability', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '30 days', NOW()),
('OPP-003', 'Mobile App Launch', 'Product', 'product', 'active', 'high', 'Launch mobile application to reach mobile-first users', 'Sarah Johnson', 'Product', 'Expand market reach by 40%', 'Increase user engagement', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '60 days', NOW()),
('OPP-004', 'Analytics Dashboard', 'Data & Analytics', 'implementation', 'active', 'medium', 'Build comprehensive analytics dashboard for business insights', 'Mike Chen', 'Business Intelligence', 'Enable data-driven decision making', 'Improve reporting accuracy', '10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '20 days', NOW()),
('OPP-005', 'Payment Gateway Integration', 'Finance', 'intake', 'active', 'high', 'Integrate new payment gateway for international transactions', 'Lisa Wong', 'Finance', 'Enable global payments', 'Reduce transaction fees by 15%', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 days', NOW()),
('OPP-006', 'Security Audit Implementation', 'Security', 'support', 'completed', 'critical', 'Implement recommendations from security audit', 'Tom Anderson', 'Security', 'Ensure compliance with SOC 2', 'Eliminate critical vulnerabilities', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '90 days', NOW()),
('OPP-007', 'AI Chatbot Integration', 'Customer Support', 'product', 'active', 'medium', 'Integrate AI chatbot to handle common customer queries', 'Emma Davis', 'Customer Support', 'Reduce support costs by 35%', 'Improve response time', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '15 days', NOW()),
('OPP-008', 'Database Migration', 'Infrastructure', 'engineering', 'active', 'high', 'Migrate from legacy database to modern cloud solution', 'Alex Kumar', 'Infrastructure', 'Improve scalability and performance', 'Reduce maintenance overhead', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '40 days', NOW());

-- Insert Opportunity Stage History
INSERT INTO opportunity_stage_history (id, opportunity_id, stage, start_date, end_date, duration_days, created_at) VALUES
(gen_random_uuid(), 'OPP-001', 'intake', NOW() - INTERVAL '45 days', NOW() - INTERVAL '40 days', 5, NOW()),
(gen_random_uuid(), 'OPP-001', 'product', NOW() - INTERVAL '40 days', NOW() - INTERVAL '30 days', 10, NOW()),
(gen_random_uuid(), 'OPP-001', 'engineering', NOW() - INTERVAL '30 days', NULL, NULL, NOW()),
(gen_random_uuid(), 'OPP-002', 'intake', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days', 5, NOW()),
(gen_random_uuid(), 'OPP-002', 'product', NOW() - INTERVAL '25 days', NOW() - INTERVAL '18 days', 7, NOW()),
(gen_random_uuid(), 'OPP-002', 'engineering', NOW() - INTERVAL '18 days', NOW() - INTERVAL '10 days', 8, NOW()),
(gen_random_uuid(), 'OPP-002', 'platform', NOW() - INTERVAL '10 days', NULL, NULL, NOW()),
(gen_random_uuid(), 'OPP-003', 'intake', NOW() - INTERVAL '60 days', NOW() - INTERVAL '55 days', 5, NOW()),
(gen_random_uuid(), 'OPP-003', 'product', NOW() - INTERVAL '55 days', NULL, NULL, NOW());

-- Insert Comments
INSERT INTO comments (id, opportunity_id, author_id, author_name, author_role, message, created_at, updated_at) VALUES
('CMT-001', 'OPP-001', '10000000-0000-0000-0000-000000000001', 'Sarah Chen', 'Product Manager', 'Initial wireframes are ready for review', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('CMT-002', 'OPP-001', '10000000-0000-0000-0000-000000000002', 'Mike Johnson', 'Engineering Lead', 'Technical feasibility looks good. Estimating 3 sprints', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('CMT-003', 'OPP-002', '10000000-0000-0000-0000-000000000003', 'Emily Rodriguez', 'Platform Architect', 'Proposing Redis-based rate limiting solution', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('CMT-004', 'OPP-003', '10000000-0000-0000-0000-000000000005', 'Lisa Patel', 'UX Designer', 'Mobile designs completed and approved', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- Insert Feedback
INSERT INTO feedback (id, opportunity_id, from_team, to_team, message, read, created_at) VALUES
('FBK-001', 'OPP-001', 'Product', 'Engineering', 'Please review the updated requirements document', false, NOW() - INTERVAL '2 days'),
('FBK-002', 'OPP-002', 'Engineering', 'Platform', 'Need infrastructure support for rate limiting implementation', true, NOW() - INTERVAL '3 days'),
('FBK-003', 'OPP-003', 'Product', 'Engineering', 'Mobile app specs are finalized and ready for development', false, NOW() - INTERVAL '1 day');

-- Insert Work Items
INSERT INTO work_items (id, title, item_type, status, status_group, project, component, sprint, story_points, assignee_id, team_id, organization_id, opportunity_id, is_planned, reopened, blocked_hours, blocker_reason, created_at, started_at, completed_at, updated_at) VALUES
('WI-001', 'Design customer portal homepage', 'Story', 'Done', 'Completed', 'Customer Portal', 'Frontend', 'Sprint 23', 5, '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'OPP-001', true, false, 0, NULL, NOW() - INTERVAL '20 days', NOW() - INTERVAL '18 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('WI-002', 'Implement user authentication flow', 'Story', 'In Progress', 'Active', 'Customer Portal', 'Backend', 'Sprint 24', 8, '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'OPP-001', true, false, 0, NULL, NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days', NULL, NOW()),
('WI-003', 'Setup rate limiting middleware', 'Story', 'In Progress', 'Active', 'API Infrastructure', 'Backend', 'Sprint 24', 5, '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'OPP-002', true, false, 0, NULL, NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 days', NULL, NOW()),
('WI-004', 'Fix login page bug', 'Bug', 'Done', 'Completed', 'Customer Portal', 'Frontend', 'Sprint 23', 2, '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'OPP-001', false, false, 0, NULL, NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('WI-005', 'Mobile app architecture design', 'Epic', 'To Do', 'Backlog', 'Mobile App', 'Architecture', 'Sprint 25', 13, '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'OPP-003', true, false, 0, NULL, NOW() - INTERVAL '5 days', NULL, NULL, NOW()),
('WI-006', 'Setup CI/CD pipeline', 'Task', 'Done', 'Completed', 'Infrastructure', 'DevOps', 'Sprint 23', 3, '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', NULL, true, false, 0, NULL, NOW() - INTERVAL '25 days', NOW() - INTERVAL '23 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('WI-007', 'Database performance optimization', 'Story', 'Blocked', 'Blocked', 'Infrastructure', 'Backend', 'Sprint 24', 8, '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'OPP-008', true, false, 16, 'Waiting for DBA approval', NOW() - INTERVAL '8 days', NOW() - INTERVAL '6 days', NULL, NOW()),
('WI-008', 'Create analytics dashboard mockups', 'Story', 'In Review', 'Active', 'Analytics', 'Frontend', 'Sprint 24', 5, '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'OPP-004', true, false, 0, NULL, NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days', NULL, NOW()),
('WI-009', 'API documentation update', 'Task', 'Done', 'Completed', 'API Infrastructure', 'Documentation', 'Sprint 23', 2, '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', NULL, true, false, 0, NULL, NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
('WI-010', 'Payment gateway integration research', 'Story', 'To Do', 'Backlog', 'Payments', 'Backend', 'Sprint 25', 5, '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'OPP-005', true, false, 0, NULL, NOW() - INTERVAL '3 days', NULL, NULL, NOW());

-- Insert Work Item Labels
INSERT INTO work_item_labels (id, work_item_id, label, created_at) VALUES
(gen_random_uuid(), 'WI-001', 'frontend', NOW()),
(gen_random_uuid(), 'WI-001', 'ui-ux', NOW()),
(gen_random_uuid(), 'WI-002', 'backend', NOW()),
(gen_random_uuid(), 'WI-002', 'security', NOW()),
(gen_random_uuid(), 'WI-003', 'infrastructure', NOW()),
(gen_random_uuid(), 'WI-003', 'performance', NOW()),
(gen_random_uuid(), 'WI-004', 'bug', NOW()),
(gen_random_uuid(), 'WI-004', 'hotfix', NOW()),
(gen_random_uuid(), 'WI-005', 'mobile', NOW()),
(gen_random_uuid(), 'WI-005', 'architecture', NOW());

-- Insert Attachments
INSERT INTO attachments (id, opportunity_id, name, file_type, file_size, url, uploaded_by, created_at) VALUES
(gen_random_uuid(), 'OPP-001', 'wireframes_v2.pdf', 'application/pdf', '2.5 MB', '/attachments/wireframes_v2.pdf', '10000000-0000-0000-0000-000000000005', NOW() - INTERVAL '10 days'),
(gen_random_uuid(), 'OPP-001', 'user_research.xlsx', 'application/vnd.ms-excel', '1.2 MB', '/attachments/user_research.xlsx', '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '15 days'),
(gen_random_uuid(), 'OPP-002', 'rate_limiting_spec.docx', 'application/msword', '856 KB', '/attachments/rate_limiting_spec.docx', '10000000-0000-0000-0000-000000000003', NOW() - INTERVAL '8 days'),
(gen_random_uuid(), 'OPP-003', 'mobile_designs.fig', 'application/figma', '5.3 MB', '/attachments/mobile_designs.fig', '10000000-0000-0000-0000-000000000005', NOW() - INTERVAL '12 days');

-- Insert User Capacity History
INSERT INTO user_capacity_history (id, user_id, week_start, capacity_percentage, created_at) VALUES
(gen_random_uuid(), '10000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '14 days', 100, NOW()),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '7 days', 80, NOW()),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000001', CURRENT_DATE, 100, NOW()),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '14 days', 100, NOW()),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '7 days', 100, NOW()),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000002', CURRENT_DATE, 90, NOW());
