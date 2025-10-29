-- NUVIO PLM Work Items Seed Data (for Analytics)
-- Version 1.0

-- Insert work items for analytics
INSERT INTO work_items (id, organization_id, opportunity_id, title, item_type, status, status_group, assignee_id, team_id, project, component, sprint, story_points, blocked_hours, blocker_reason, reopened, is_planned, created_at, started_at, completed_at) VALUES
  -- Stories
  ('ITEM-1001', '00000000-0000-0000-0000-000000000001', 'OPP-001', 'Implement inventory tracking API', 'Story', 'In Progress', 'inprogress', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202', 'Project Alpha', 'API', 'Sprint 15', 5, 0, NULL, FALSE, TRUE, '2024-02-05', '2024-02-07', NULL),
  ('ITEM-1002', '00000000-0000-0000-0000-000000000001', 'OPP-001', 'Add real-time stock level monitoring', 'Story', 'Review', 'review', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222202', 'Project Alpha', 'UI', 'Sprint 15', 3, 0, NULL, FALSE, TRUE, '2024-02-06', '2024-02-08', NULL),
  ('ITEM-1003', '00000000-0000-0000-0000-000000000001', 'OPP-001', 'Create inventory dashboard', 'Story', 'Done', 'done', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222202', 'Project Alpha', 'UI', 'Sprint 14', 5, 0, NULL, FALSE, TRUE, '2024-01-22', '2024-01-24', '2024-02-02'),
  ('ITEM-1004', '00000000-0000-0000-0000-000000000001', 'OPP-002', 'Build customer authentication flow', 'Story', 'In Progress', 'inprogress', '11111111-1111-1111-1111-111111111105', '22222222-2222-2222-2222-222222222203', 'Project Beta', 'Auth', 'Sprint 15', 8, 0, NULL, FALSE, TRUE, '2024-02-08', '2024-02-10', NULL),
  ('ITEM-1005', '00000000-0000-0000-0000-000000000001', 'OPP-002', 'Design order tracking interface', 'Story', 'Done', 'done', '11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222201', 'Project Beta', 'UI', 'Sprint 14', 3, 0, NULL, FALSE, TRUE, '2024-02-01', '2024-02-03', '2024-02-09'),
  ('ITEM-1006', '00000000-0000-0000-0000-000000000001', 'OPP-003', 'Automate financial report generation', 'Story', 'Done', 'done', '11111111-1111-1111-1111-111111111107', '22222222-2222-2222-2222-222222222202', 'Project Gamma', 'Analytics', 'Sprint 13', 8, 0, NULL, FALSE, TRUE, '2024-01-22', '2024-01-25', '2024-02-08'),
  ('ITEM-1007', '00000000-0000-0000-0000-000000000001', 'OPP-003', 'Integrate with accounting system', 'Story', 'In Progress', 'inprogress', '11111111-1111-1111-1111-111111111107', '22222222-2222-2222-2222-222222222202', 'Project Gamma', 'API', 'Sprint 15', 5, 0, NULL, FALSE, TRUE, '2024-02-09', '2024-02-11', NULL),
  ('ITEM-1008', '00000000-0000-0000-0000-000000000001', 'OPP-007', 'Build quality metrics dashboard', 'Story', 'In Progress', 'inprogress', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222202', 'Project Delta', 'UI', 'Sprint 15', 5, 0, NULL, FALSE, TRUE, '2024-02-15', '2024-02-17', NULL),
  ('ITEM-1009', '00000000-0000-0000-0000-000000000001', 'OPP-007', 'Implement real-time data pipeline', 'Story', 'To Do', 'todo', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222202', 'Project Delta', 'Infrastructure', 'Sprint 16', 8, 0, NULL, FALSE, TRUE, '2024-02-16', NULL, NULL),
  ('ITEM-1010', '00000000-0000-0000-0000-000000000001', 'OPP-008', 'Create budget planning interface', 'Story', 'In Progress', 'inprogress', '11111111-1111-1111-1111-111111111115', '22222222-2222-2222-2222-222222222202', 'Project Delta', 'UI', 'Sprint 15', 5, 0, NULL, FALSE, TRUE, '2024-02-17', '2024-02-19', NULL),
  
  -- Bugs
  ('ITEM-1011', '00000000-0000-0000-0000-000000000001', 'OPP-001', 'Fix inventory count discrepancy', 'Bug', 'Done', 'done', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202', 'Project Alpha', 'Database', 'Sprint 14', 2, 0, NULL, FALSE, TRUE, '2024-01-28', '2024-01-29', '2024-02-01'),
  ('ITEM-1012', '00000000-0000-0000-0000-000000000001', 'OPP-001', 'Resolve API timeout issues', 'Bug', 'Blocked', 'inprogress', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202', 'Project Alpha', 'API', 'Sprint 15', 3, 16, 'Waiting for infrastructure team', FALSE, TRUE, '2024-02-10', '2024-02-11', NULL),
  ('ITEM-1013', '00000000-0000-0000-0000-000000000001', 'OPP-002', 'Fix login redirect loop', 'Bug', 'Done', 'done', '11111111-1111-1111-1111-111111111105', '22222222-2222-2222-2222-222222222203', 'Project Beta', 'Auth', 'Sprint 14', 2, 0, NULL, TRUE, TRUE, '2024-02-05', '2024-02-06', '2024-02-08'),
  ('ITEM-1014', '00000000-0000-0000-0000-000000000001', 'OPP-003', 'Correct financial calculation error', 'Bug', 'Done', 'done', '11111111-1111-1111-1111-111111111107', '22222222-2222-2222-2222-222222222202', 'Project Gamma', 'Analytics', 'Sprint 14', 3, 0, NULL, FALSE, TRUE, '2024-02-03', '2024-02-04', '2024-02-07'),
  ('ITEM-1015', '00000000-0000-0000-0000-000000000001', 'OPP-007', 'Fix chart rendering issue', 'Bug', 'In Progress', 'inprogress', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222202', 'Project Delta', 'UI', 'Sprint 15', 1, 0, NULL, FALSE, TRUE, '2024-02-18', '2024-02-19', NULL),
  
  -- Tasks
  ('ITEM-1016', '00000000-0000-0000-0000-000000000001', 'OPP-001', 'Update API documentation', 'Task', 'Done', 'done', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', 'Project Alpha', 'Documentation', 'Sprint 14', 1, 0, NULL, FALSE, TRUE, '2024-01-30', '2024-01-31', '2024-02-02'),
  ('ITEM-1017', '00000000-0000-0000-0000-000000000001', 'OPP-002', 'Write integration tests', 'Task', 'QA', 'review', '11111111-1111-1111-1111-111111111118', '22222222-2222-2222-2222-222222222202', 'Project Beta', 'Testing', 'Sprint 15', 2, 0, NULL, FALSE, TRUE, '2024-02-12', '2024-02-13', NULL),
  ('ITEM-1018', '00000000-0000-0000-0000-000000000001', 'OPP-003', 'Setup monitoring alerts', 'Task', 'Done', 'done', '11111111-1111-1111-1111-111111111108', '22222222-2222-2222-2222-222222222201', 'Project Gamma', 'Infrastructure', 'Sprint 14', 2, 0, NULL, FALSE, TRUE, '2024-02-01', '2024-02-02', '2024-02-05'),
  ('ITEM-1019', '00000000-0000-0000-0000-000000000001', 'OPP-007', 'Configure database indexes', 'Task', 'To Do', 'todo', '11111111-1111-1111-1111-111111111113', '22222222-2222-2222-2222-222222222202', 'Project Delta', 'Database', 'Sprint 16', 2, 0, NULL, FALSE, TRUE, '2024-02-20', NULL, NULL),
  ('ITEM-1020', '00000000-0000-0000-0000-000000000001', 'OPP-008', 'Create user guide', 'Task', 'To Do', 'todo', '11111111-1111-1111-1111-111111111114', '22222222-2222-2222-2222-222222222201', 'Project Delta', 'Documentation', 'Sprint 16', 1, 0, NULL, FALSE, TRUE, '2024-02-21', NULL, NULL),
  
  -- Additional completed items for better analytics
  ('ITEM-1021', '00000000-0000-0000-0000-000000000001', NULL, 'Refactor authentication module', 'Story', 'Done', 'done', '11111111-1111-1111-1111-111111111105', '22222222-2222-2222-2222-222222222203', 'Project Beta', 'Auth', 'Sprint 13', 5, 0, NULL, FALSE, TRUE, '2024-01-15', '2024-01-17', '2024-01-26'),
  ('ITEM-1022', '00000000-0000-0000-0000-000000000001', NULL, 'Optimize database queries', 'Task', 'Done', 'done', '11111111-1111-1111-1111-111111111107', '22222222-2222-2222-2222-222222222202', 'Project Gamma', 'Database', 'Sprint 13', 3, 0, NULL, FALSE, TRUE, '2024-01-18', '2024-01-19', '2024-01-24'),
  ('ITEM-1023', '00000000-0000-0000-0000-000000000001', NULL, 'Implement caching layer', 'Story', 'Done', 'done', '11111111-1111-1111-1111-111111111109', '22222222-2222-2222-2222-222222222203', 'Project Alpha', 'Infrastructure', 'Sprint 13', 8, 0, NULL, FALSE, TRUE, '2024-01-16', '2024-01-18', '2024-01-30'),
  ('ITEM-1024', '00000000-0000-0000-0000-000000000001', NULL, 'Fix memory leak in worker process', 'Bug', 'Done', 'done', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222202', 'Project Delta', 'Infrastructure', 'Sprint 13', 3, 0, NULL, FALSE, TRUE, '2024-01-20', '2024-01-21', '2024-01-25'),
  ('ITEM-1025', '00000000-0000-0000-0000-000000000001', NULL, 'Add export functionality', 'Story', 'Done', 'done', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222202', 'Project Alpha', 'UI', 'Sprint 12', 5, 0, NULL, FALSE, TRUE, '2024-01-08', '2024-01-10', '2024-01-19');

-- Insert work item labels
INSERT INTO work_item_labels (work_item_id, label) VALUES
  ('ITEM-1001', 'feature'),
  ('ITEM-1001', 'backend'),
  ('ITEM-1002', 'feature'),
  ('ITEM-1002', 'frontend'),
  ('ITEM-1003', 'feature'),
  ('ITEM-1003', 'ux'),
  ('ITEM-1004', 'security'),
  ('ITEM-1004', 'feature'),
  ('ITEM-1005', 'ux'),
  ('ITEM-1006', 'enhancement'),
  ('ITEM-1007', 'integration'),
  ('ITEM-1008', 'feature'),
  ('ITEM-1008', 'analytics'),
  ('ITEM-1009', 'infrastructure'),
  ('ITEM-1010', 'feature'),
  ('ITEM-1011', 'bug'),
  ('ITEM-1012', 'bug'),
  ('ITEM-1012', 'performance'),
  ('ITEM-1013', 'bug'),
  ('ITEM-1013', 'security'),
  ('ITEM-1014', 'bug'),
  ('ITEM-1015', 'bug'),
  ('ITEM-1015', 'frontend'),
  ('ITEM-1016', 'documentation'),
  ('ITEM-1017', 'testing'),
  ('ITEM-1018', 'infrastructure'),
  ('ITEM-1019', 'performance'),
  ('ITEM-1020', 'documentation'),
  ('ITEM-1021', 'refactor'),
  ('ITEM-1022', 'performance'),
  ('ITEM-1023', 'performance'),
  ('ITEM-1024', 'bug'),
  ('ITEM-1025', 'feature');

-- Insert user capacity history (last 8 weeks)
INSERT INTO user_capacity_history (user_id, week_start, capacity_percentage) VALUES
  -- Sarah Chen
  ('11111111-1111-1111-1111-111111111101', '2024-01-01', 75),
  ('11111111-1111-1111-1111-111111111101', '2024-01-08', 78),
  ('11111111-1111-1111-1111-111111111101', '2024-01-15', 82),
  ('11111111-1111-1111-1111-111111111101', '2024-01-22', 80),
  ('11111111-1111-1111-1111-111111111101', '2024-01-29', 83),
  ('11111111-1111-1111-1111-111111111101', '2024-02-05', 85),
  ('11111111-1111-1111-1111-111111111101', '2024-02-12', 84),
  ('11111111-1111-1111-1111-111111111101', '2024-02-19', 85),
  -- Mike Johnson
  ('11111111-1111-1111-1111-111111111102', '2024-01-01', 95),
  ('11111111-1111-1111-1111-111111111102', '2024-01-08', 98),
  ('11111111-1111-1111-1111-111111111102', '2024-01-15', 102),
  ('11111111-1111-1111-1111-111111111102', '2024-01-22', 105),
  ('11111111-1111-1111-1111-111111111102', '2024-01-29', 107),
  ('11111111-1111-1111-1111-111111111102', '2024-02-05', 108),
  ('11111111-1111-1111-1111-111111111102', '2024-02-12', 109),
  ('11111111-1111-1111-1111-111111111102', '2024-02-19', 110);
