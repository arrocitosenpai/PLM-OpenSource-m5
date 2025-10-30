-- NUVIO PLM Seed Data
-- Version 1.0

-- Insert default organization
INSERT INTO organizations (id, name, slug) VALUES
  ('00000000-0000-0000-0000-000000000001', 'NUVIO Demo Company', 'nuvio-demo');

-- Insert users (Note: These need to be created in Supabase Auth first, or use existing auth user IDs)
-- For demo purposes, we'll create placeholder user records
INSERT INTO users (id, organization_id, email, full_name, role, team_type, weekly_capacity_hours) VALUES
  ('11111111-1111-1111-1111-111111111101', '00000000-0000-0000-0000-000000000001', 'sarah.chen@nuvio.com', 'Sarah Chen', 'Product Manager', 'product', 40),
  ('11111111-1111-1111-1111-111111111102', '00000000-0000-0000-0000-000000000001', 'mike.johnson@nuvio.com', 'Mike Johnson', 'Engineer', 'engineering', 40),
  ('11111111-1111-1111-1111-111111111103', '00000000-0000-0000-0000-000000000001', 'lisa.wang@nuvio.com', 'Lisa Wang', 'Engineer', 'engineering', 40),
  ('11111111-1111-1111-1111-111111111104', '00000000-0000-0000-0000-000000000001', 'david.park@nuvio.com', 'David Park', 'Product Manager', 'product', 40),
  ('11111111-1111-1111-1111-111111111105', '00000000-0000-0000-0000-000000000001', 'anna.lee@nuvio.com', 'Anna Lee', 'Platform Engineer', 'platform', 40),
  ('11111111-1111-1111-1111-111111111106', '00000000-0000-0000-0000-000000000001', 'rachel.green@nuvio.com', 'Rachel Green', 'Product Manager', 'product', 40),
  ('11111111-1111-1111-1111-111111111107', '00000000-0000-0000-0000-000000000001', 'kevin.brown@nuvio.com', 'Kevin Brown', 'Engineer', 'engineering', 40),
  ('11111111-1111-1111-1111-111111111108', '00000000-0000-0000-0000-000000000001', 'sophia.martinez@nuvio.com', 'Sophia Martinez', 'Product Manager', 'product', 40),
  ('11111111-1111-1111-1111-111111111109', '00000000-0000-0000-0000-000000000001', 'james.wilson@nuvio.com', 'James Wilson', 'Platform Engineer', 'platform', 40),
  ('11111111-1111-1111-1111-111111111110', '00000000-0000-0000-0000-000000000001', 'nina.patel@nuvio.com', 'Nina Patel', 'Platform Engineer', 'platform', 40),
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'marcus.johnson@nuvio.com', 'Marcus Johnson', 'Engineer', 'engineering', 40),
  ('11111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000001', 'elena.rodriguez@nuvio.com', 'Elena Rodriguez', 'Engineer', 'engineering', 40),
  ('11111111-1111-1111-1111-111111111113', '00000000-0000-0000-0000-000000000001', 'tom.harris@nuvio.com', 'Tom Harris', 'Engineer', 'engineering', 40),
  ('11111111-1111-1111-1111-111111111114', '00000000-0000-0000-0000-000000000001', 'diana.prince@nuvio.com', 'Diana Prince', 'Product Manager', 'product', 40),
  ('11111111-1111-1111-1111-111111111115', '00000000-0000-0000-0000-000000000001', 'clark.kent@nuvio.com', 'Clark Kent', 'Engineer', 'engineering', 40),
  ('11111111-1111-1111-1111-111111111116', '00000000-0000-0000-0000-000000000001', 'olivia.thompson@nuvio.com', 'Olivia Thompson', 'Product Manager', 'product', 40),
  ('11111111-1111-1111-1111-111111111117', '00000000-0000-0000-0000-000000000001', 'alex.turner@nuvio.com', 'Alex Turner', 'Product Manager', 'product', 40),
  ('11111111-1111-1111-1111-111111111118', '00000000-0000-0000-0000-000000000001', 'chris.davis@nuvio.com', 'Chris Davis', 'Engineer', 'engineering', 40),
  ('11111111-1111-1111-1111-111111111119', '00000000-0000-0000-0000-000000000001', 'admin@nuvio.com', 'Admin User', 'Admin', 'product', 40);

-- Insert teams
INSERT INTO teams (id, organization_id, name, team_type, description) VALUES
  ('22222222-2222-2222-2222-222222222201', '00000000-0000-0000-0000-000000000001', 'Product Team', 'product', 'Product management and strategy'),
  ('22222222-2222-2222-2222-222222222202', '00000000-0000-0000-0000-000000000001', 'Engineering Team', 'engineering', 'Software development and engineering'),
  ('22222222-2222-2222-2222-222222222203', '00000000-0000-0000-0000-000000000001', 'Platform Team', 'platform', 'Infrastructure and platform services');

-- Insert team members
INSERT INTO team_members (team_id, user_id, capacity_percentage) VALUES
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 100),
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111104', 100),
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111106', 100),
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111108', 100),
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111114', 100),
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111116', 100),
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111117', 100),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102', 100),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111103', 100),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111107', 100),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111111', 100),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111112', 100),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111113', 100),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111115', 100),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111118', 100),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111105', 100),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111109', 100),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111110', 100);

-- Insert opportunities
INSERT INTO opportunities (id, organization_id, name, function, current_stage, status, priority, owner_id, problem_statement, business_sponsor, business_team, business_value, quality_value, jira_epic_id, jira_epic_url, jira_story_id, jira_story_url, created_at) VALUES
  ('OPP-001', '00000000-0000-0000-0000-000000000001', 'Inventory Management System', 'Supply Chain', 'engineering', 'in-progress', 'high', '11111111-1111-1111-1111-111111111101', 'Current inventory tracking is manual and error-prone, leading to stockouts and overstock situations.', 'John Smith', 'Supply Chain Operations', 'Reduce inventory costs by 15% and improve stock accuracy to 99%', 'Eliminate manual data entry errors and improve real-time visibility', 'EPIC-1234', 'https://company.atlassian.net/browse/EPIC-1234', 'STORY-5678', 'https://company.atlassian.net/browse/STORY-5678', '2024-01-15'),
  ('OPP-002', '00000000-0000-0000-0000-000000000001', 'Customer Portal Enhancement', 'TS', 'product', 'in-progress', 'medium', '11111111-1111-1111-1111-111111111104', 'Customers lack self-service capabilities for order tracking and support requests.', 'Emily Rodriguez', 'Customer Success', 'Reduce support tickets by 30% and improve customer satisfaction scores', 'Provide 24/7 self-service access and reduce response times', 'EPIC-2345', 'https://company.atlassian.net/browse/EPIC-2345', 'STORY-6789', 'https://company.atlassian.net/browse/STORY-6789', '2024-02-01'),
  ('OPP-003', '00000000-0000-0000-0000-000000000001', 'Financial Reporting Automation', 'Finance', 'implementation', 'in-progress', 'high', '11111111-1111-1111-1111-111111111106', 'Monthly financial reports take 5 days to compile manually with high error rates.', 'Tom Anderson', 'Finance Operations', 'Save 80 hours per month and improve reporting accuracy to 99.9%', 'Enable real-time financial insights and reduce month-end close time', 'EPIC-3456', 'https://company.atlassian.net/browse/EPIC-3456', 'STORY-7890', 'https://company.atlassian.net/browse/STORY-7890', '2023-11-20'),
  ('OPP-004', '00000000-0000-0000-0000-000000000001', 'Supplier Onboarding Platform', 'Supply Chain', 'platform', 'need-clarification', 'medium', '11111111-1111-1111-1111-111111111109', 'Supplier onboarding takes 4-6 weeks with multiple manual touchpoints.', 'Maria Garcia', 'Procurement', 'Reduce onboarding time to 1 week and improve supplier data quality', 'Standardize onboarding process and ensure compliance', 'EPIC-4567', 'https://company.atlassian.net/browse/EPIC-4567', 'STORY-8901', 'https://company.atlassian.net/browse/STORY-8901', '2024-01-10'),
  ('OPP-005', '00000000-0000-0000-0000-000000000001', 'Employee Training Portal', 'HR', 'support', 'completed', 'low', '11111111-1111-1111-1111-111111111117', 'Training materials are scattered across multiple systems with no tracking.', 'Jennifer Lee', 'Human Resources', 'Improve training completion rates by 40% and reduce onboarding time', 'Centralize training content and enable progress tracking', 'EPIC-5678', 'https://company.atlassian.net/browse/EPIC-5678', 'STORY-9012', 'https://company.atlassian.net/browse/STORY-9012', '2023-10-15'),
  ('OPP-006', '00000000-0000-0000-0000-000000000001', 'Marketing Campaign Analytics', 'Marketing', 'intake', 'not-started', 'medium', '11111111-1111-1111-1111-111111111116', 'Unable to measure ROI of marketing campaigns across multiple channels.', 'Robert Kim', 'Marketing Operations', 'Improve marketing ROI by 25% through better targeting and measurement', 'Enable data-driven marketing decisions and attribution modeling', 'EPIC-6789', 'https://company.atlassian.net/browse/EPIC-6789', 'STORY-0123', 'https://company.atlassian.net/browse/STORY-0123', '2024-03-01'),
  ('OPP-007', '00000000-0000-0000-0000-000000000001', 'Quality Control Dashboard', 'Operations', 'engineering', 'in-progress', 'high', '11111111-1111-1111-1111-111111111111', 'Quality metrics are reported weekly, delaying corrective actions.', 'Patricia White', 'Quality Assurance', 'Reduce defect rates by 20% through real-time monitoring', 'Enable proactive quality management and trend analysis', 'EPIC-7890', 'https://company.atlassian.net/browse/EPIC-7890', 'STORY-1234', 'https://company.atlassian.net/browse/STORY-1234', '2024-01-25'),
  ('OPP-008', '00000000-0000-0000-0000-000000000001', 'Budget Planning Tool', 'Finance', 'product', 'in-progress', 'low', '11111111-1111-1111-1111-111111111114', 'Annual budget planning uses spreadsheets with version control issues.', 'Bruce Wayne', 'Financial Planning', 'Reduce budget planning cycle from 8 weeks to 4 weeks', 'Improve collaboration and maintain single source of truth', 'EPIC-8901', 'https://company.atlassian.net/browse/EPIC-8901', 'STORY-2345', 'https://company.atlassian.net/browse/STORY-2345', '2024-02-10');

-- Insert opportunity stage history
INSERT INTO opportunity_stage_history (opportunity_id, stage, start_date, end_date, duration_days) VALUES
  -- OPP-001 history
  ('OPP-001', 'intake', '2024-01-15', '2024-01-22', 7),
  ('OPP-001', 'product', '2024-01-22', '2024-02-05', 14),
  ('OPP-001', 'engineering', '2024-02-05', NULL, NULL),
  -- OPP-002 history
  ('OPP-002', 'intake', '2024-02-01', '2024-02-08', 7),
  ('OPP-002', 'product', '2024-02-08', NULL, NULL),
  -- OPP-003 history
  ('OPP-003', 'intake', '2023-11-20', '2023-11-27', 7),
  ('OPP-003', 'product', '2023-11-27', '2023-12-11', 14),
  ('OPP-003', 'engineering', '2023-12-11', '2024-01-08', 28),
  ('OPP-003', 'platform', '2024-01-08', '2024-01-22', 14),
  ('OPP-003', 'implementation', '2024-01-22', NULL, NULL),
  -- OPP-004 history
  ('OPP-004', 'intake', '2024-01-10', '2024-01-17', 7),
  ('OPP-004', 'product', '2024-01-17', '2024-01-31', 14),
  ('OPP-004', 'engineering', '2024-01-31', '2024-02-21', 21),
  ('OPP-004', 'platform', '2024-02-21', NULL, NULL),
  -- OPP-005 history (completed)
  ('OPP-005', 'intake', '2023-10-15', '2023-10-22', 7),
  ('OPP-005', 'product', '2023-10-22', '2023-11-05', 14),
  ('OPP-005', 'engineering', '2023-11-05', '2023-12-03', 28),
  ('OPP-005', 'platform', '2023-12-03', '2023-12-17', 14),
  ('OPP-005', 'implementation', '2023-12-17', '2024-01-14', 28),
  ('OPP-005', 'support', '2024-01-14', '2024-02-11', 28),
  -- OPP-006 history
  ('OPP-006', 'intake', '2024-03-01', NULL, NULL),
  -- OPP-007 history
  ('OPP-007', 'intake', '2024-01-25', '2024-02-01', 7),
  ('OPP-007', 'product', '2024-02-01', '2024-02-15', 14),
  ('OPP-007', 'engineering', '2024-02-15', NULL, NULL),
  -- OPP-008 history
  ('OPP-008', 'intake', '2024-02-10', '2024-02-17', 7),
  ('OPP-008', 'product', '2024-02-17', NULL, NULL);

-- Insert opportunity assignments
INSERT INTO opportunity_assignments (opportunity_id, user_id) VALUES
  ('OPP-001', '11111111-1111-1111-1111-111111111101'),
  ('OPP-001', '11111111-1111-1111-1111-111111111102'),
  ('OPP-001', '11111111-1111-1111-1111-111111111103'),
  ('OPP-002', '11111111-1111-1111-1111-111111111104'),
  ('OPP-002', '11111111-1111-1111-1111-111111111105'),
  ('OPP-003', '11111111-1111-1111-1111-111111111106'),
  ('OPP-003', '11111111-1111-1111-1111-111111111107'),
  ('OPP-003', '11111111-1111-1111-1111-111111111108'),
  ('OPP-004', '11111111-1111-1111-1111-111111111109'),
  ('OPP-004', '11111111-1111-1111-1111-111111111110'),
  ('OPP-005', '11111111-1111-1111-1111-111111111117'),
  ('OPP-005', '11111111-1111-1111-1111-111111111118'),
  ('OPP-006', '11111111-1111-1111-1111-111111111116'),
  ('OPP-007', '11111111-1111-1111-1111-111111111111'),
  ('OPP-007', '11111111-1111-1111-1111-111111111112'),
  ('OPP-007', '11111111-1111-1111-1111-111111111113'),
  ('OPP-008', '11111111-1111-1111-1111-111111111114'),
  ('OPP-008', '11111111-1111-1111-1111-111111111115');

-- Insert comments
INSERT INTO comments (id, opportunity_id, author_id, author_name, author_role, message, created_at) VALUES
  ('CMT-001', 'OPP-001', '11111111-1111-1111-1111-111111111101', 'Sarah Chen', 'Product Manager', 'Initial requirements have been documented. Ready for engineering review.', '2024-03-01 09:00:00'),
  ('CMT-002', 'OPP-001', '11111111-1111-1111-1111-111111111102', 'Mike Johnson', 'Senior Engineer', 'Reviewed the requirements. We''ll need to clarify the API rate limiting strategy.', '2024-03-02 14:30:00'),
  ('CMT-003', 'OPP-001', '11111111-1111-1111-1111-111111111103', 'Lisa Wang', 'Engineer', 'Started working on the database schema. Should have initial draft by end of week.', '2024-03-04 10:15:00'),
  ('CMT-004', 'OPP-002', '11111111-1111-1111-1111-111111111104', 'David Park', 'Product Manager', 'Customer feedback session completed. Adding new requirements to the spec.', '2024-02-28 16:00:00'),
  ('CMT-005', 'OPP-003', '11111111-1111-1111-1111-111111111106', 'Rachel Green', 'Finance Lead', 'Integration with accounting system is progressing well. Testing phase starts next week.', '2024-03-03 11:20:00'),
  ('CMT-006', 'OPP-007', '11111111-1111-1111-1111-111111111111', 'Marcus Johnson', 'Senior Engineer', 'Dashboard mockups look great! Starting implementation of the real-time data pipeline.', '2024-03-05 15:45:00');

-- Insert feedback
INSERT INTO feedback (id, opportunity_id, from_team, to_team, message, read, created_at) VALUES
  ('FB-001', 'OPP-001', 'product', 'engineering', 'The inventory management requirements have been updated. Please review the new API specifications in the product documentation.', FALSE, '2024-03-05 10:30:00'),
  ('FB-002', 'OPP-001', 'engineering', 'platform', 'We need additional database capacity for the inventory system. Current estimates show we''ll need 500GB storage and high IOPS.', FALSE, '2024-03-05 14:20:00'),
  ('FB-003', 'OPP-002', 'engineering', 'product', 'The customer portal authentication flow needs clarification. Should we support social login or just email/password?', FALSE, '2024-03-04 09:15:00'),
  ('FB-004', 'OPP-004', 'platform', 'engineering', 'Infrastructure is ready for the supplier onboarding platform. All environments have been provisioned and tested.', TRUE, '2024-03-03 16:45:00'),
  ('FB-005', 'OPP-007', 'product', 'engineering', 'Quality dashboard mockups are complete. Please review the design and let us know if any metrics are missing.', FALSE, '2024-03-06 11:00:00');

-- Insert attachments
INSERT INTO attachments (opportunity_id, name, file_type, file_size, uploaded_by) VALUES
  ('OPP-001', 'Business Requirements.pdf', 'PDF', '2.4 MB', '11111111-1111-1111-1111-111111111101'),
  ('OPP-001', 'Demo Video.mp4', 'MP4', '15.8 MB', '11111111-1111-1111-1111-111111111101'),
  ('OPP-001', 'Product Design Document.pdf', 'PDF', '3.2 MB', '11111111-1111-1111-1111-111111111101'),
  ('OPP-002', 'Customer Feedback.pdf', 'PDF', '1.8 MB', '11111111-1111-1111-1111-111111111104'),
  ('OPP-003', 'Financial Report Template.xlsx', 'XLSX', '5.1 MB', '11111111-1111-1111-1111-111111111106'),
  ('OPP-004', 'Supplier Onboarding Process.docx', 'DOCX', '1.2 MB', '11111111-1111-1111-1111-111111111109'),
  ('OPP-005', 'Training Portal Design.pptx', 'PPTX', '3.5 MB', '11111111-1111-1111-1111-111111111117'),
  ('OPP-006', 'Marketing Campaign Data.xlsx', 'XLSX', '4.8 MB', '11111111-1111-1111-1111-111111111116'),
  ('OPP-007', 'Quality Metrics Report.pdf', 'PDF', '2.9 MB', '11111111-1111-1111-1111-111111111111'),
  ('OPP-008', 'Budget Planning Spreadsheet.xlsx', 'XLSX', '6.2 MB', '11111111-1111-1111-1111-111111111114');
