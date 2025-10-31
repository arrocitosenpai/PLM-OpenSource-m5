-- Insert organization
INSERT INTO organizations (id, name, slug) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Acme Corporation', 'acme-corp');

-- Insert users with different roles
INSERT INTO users (id, email, full_name, role, team_type, organization_id, weekly_capacity_hours) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'sarah.johnson@acme.com', 'Sarah Johnson', 'Product Manager', 'product', '550e8400-e29b-41d4-a716-446655440000', 40),
('650e8400-e29b-41d4-a716-446655440002', 'mike.chen@acme.com', 'Mike Chen', 'Engineering Lead', 'engineering', '550e8400-e29b-41d4-a716-446655440000', 40),
('650e8400-e29b-41d4-a716-446655440003', 'emily.davis@acme.com', 'Emily Davis', 'Platform Architect', 'platform', '550e8400-e29b-41d4-a716-446655440000', 40),
('650e8400-e29b-41d4-a716-446655440004', 'james.wilson@acme.com', 'James Wilson', 'Implementation Manager', 'implementation', '550e8400-e29b-41d4-a716-446655440000', 40),
('650e8400-e29b-41d4-a716-446655440005', 'lisa.brown@acme.com', 'Lisa Brown', 'Support Lead', 'support', '550e8400-e29b-41d4-a716-446655440000', 40),
('650e8400-e29b-41d4-a716-446655440006', 'david.martinez@acme.com', 'David Martinez', 'Senior Engineer', 'engineering', '550e8400-e29b-41d4-a716-446655440000', 40),
('650e8400-e29b-41d4-a716-446655440007', 'anna.lee@acme.com', 'Anna Lee', 'Product Designer', 'product', '550e8400-e29b-41d4-a716-446655440000', 40);

-- Insert opportunities with proper current_stage values
INSERT INTO opportunities (id, name, function, current_stage, status, priority, owner_id, organization_id, problem_statement, business_sponsor, business_team, business_value, quality_value) VALUES
('OPP-001', 'Customer Portal Redesign', 'Customer Experience', 'product', 'in-progress', 'high', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Current customer portal has poor UX and low engagement rates', 'John Smith', 'Customer Success', 'Increase customer satisfaction by 30% and reduce support tickets by 25%', 'Improved user experience and reduced technical debt'),

('OPP-002', 'Mobile App Development', 'Product Innovation', 'engineering', 'in-progress', 'high', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Need native mobile apps for iOS and Android to reach mobile-first customers', 'Jane Doe', 'Product', 'Capture 40% of mobile market share and increase revenue by $2M annually', 'Native performance and offline capabilities'),

('OPP-003', 'API Gateway Implementation', 'Infrastructure', 'platform', 'in-progress', 'medium', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Microservices need centralized API management and security', 'Bob Anderson', 'Engineering', 'Reduce API latency by 50% and improve security posture', 'Centralized monitoring and rate limiting'),

('OPP-004', 'Data Analytics Dashboard', 'Business Intelligence', 'implementation', 'in-progress', 'medium', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Business teams lack real-time insights into key metrics', 'Carol White', 'Analytics', 'Enable data-driven decisions and reduce reporting time by 70%', 'Real-time data visualization and automated reporting'),

('OPP-005', 'Customer Support Chatbot', 'Automation', 'support', 'in-progress', 'low', '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Support team overwhelmed with repetitive questions', 'Tom Harris', 'Support', 'Handle 60% of tier-1 support queries automatically', 'AI-powered responses with 24/7 availability'),

('OPP-006', 'Payment System Upgrade', 'Finance', 'product', 'in-progress', 'high', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Current payment system lacks modern payment methods and has high failure rates', 'Susan Clark', 'Finance', 'Reduce payment failures by 40% and support 10+ payment methods', 'PCI compliance and fraud detection'),

('OPP-007', 'Inventory Management System', 'Operations', 'engineering', 'in-progress', 'medium', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Manual inventory tracking causing stockouts and overstock', 'Mark Taylor', 'Operations', 'Reduce inventory costs by 20% and eliminate stockouts', 'Real-time tracking and automated reordering'),

('OPP-008', 'Security Compliance Platform', 'Security', 'platform', 'in-progress', 'high', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Need to meet SOC2 and ISO 27001 compliance requirements', 'Rachel Green', 'Security', 'Achieve compliance certifications and reduce audit time by 50%', 'Automated compliance monitoring and reporting'),

('OPP-009', 'Employee Onboarding Portal', 'HR Tech', 'product', 'in-progress', 'low', '650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'New employee onboarding is manual and time-consuming', 'Kevin Brown', 'Human Resources', 'Reduce onboarding time from 2 weeks to 3 days', 'Automated workflows and digital document management');

-- Insert stage history for each opportunity (showing they started in their current stage)
INSERT INTO opportunity_stage_history (opportunity_id, stage, start_date) VALUES
('OPP-001', 'product', NOW() - INTERVAL '5 days'),
('OPP-002', 'product', NOW() - INTERVAL '20 days'),
('OPP-002', 'engineering', NOW() - INTERVAL '10 days'),
('OPP-003', 'product', NOW() - INTERVAL '30 days'),
('OPP-003', 'engineering', NOW() - INTERVAL '20 days'),
('OPP-003', 'platform', NOW() - INTERVAL '7 days'),
('OPP-004', 'product', NOW() - INTERVAL '45 days'),
('OPP-004', 'engineering', NOW() - INTERVAL '30 days'),
('OPP-004', 'platform', NOW() - INTERVAL '15 days'),
('OPP-004', 'implementation', NOW() - INTERVAL '5 days'),
('OPP-005', 'product', NOW() - INTERVAL '60 days'),
('OPP-005', 'engineering', NOW() - INTERVAL '45 days'),
('OPP-005', 'platform', NOW() - INTERVAL '30 days'),
('OPP-005', 'implementation', NOW() - INTERVAL '15 days'),
('OPP-005', 'support', NOW() - INTERVAL '3 days'),
('OPP-006', 'product', NOW() - INTERVAL '3 days'),
('OPP-007', 'product', NOW() - INTERVAL '15 days'),
('OPP-007', 'engineering', NOW() - INTERVAL '8 days'),
('OPP-008', 'product', NOW() - INTERVAL '25 days'),
('OPP-008', 'engineering', NOW() - INTERVAL '15 days'),
('OPP-008', 'platform', NOW() - INTERVAL '6 days'),
('OPP-009', 'product', NOW() - INTERVAL '2 days');

-- Insert some sample comments
INSERT INTO comments (id, opportunity_id, author_id, author_name, author_role, message) VALUES
('CMT-001', 'OPP-001', '650e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'Product Manager', 'Initial requirements gathering complete. Ready to move to engineering.'),
('CMT-002', 'OPP-002', '650e8400-e29b-41d4-a716-446655440002', 'Mike Chen', 'Engineering Lead', 'iOS prototype is looking great. Android development in progress.'),
('CMT-003', 'OPP-003', '650e8400-e29b-41d4-a716-446655440003', 'Emily Davis', 'Platform Architect', 'API Gateway architecture approved. Starting implementation next week.');

SELECT 'Seed data inserted successfully' as status;
SELECT COUNT(*) as opportunity_count FROM opportunities;
SELECT COUNT(*) as user_count FROM users;
