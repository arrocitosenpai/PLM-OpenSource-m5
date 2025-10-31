-- Drop all existing tables in the correct order (respecting foreign key dependencies)
DROP TABLE IF EXISTS work_item_labels CASCADE;
DROP TABLE IF EXISTS work_items CASCADE;
DROP TABLE IF EXISTS user_capacity_history CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS opportunity_assignments CASCADE;
DROP TABLE IF EXISTS opportunity_stage_history CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Confirm all tables dropped
SELECT 'All tables dropped successfully' as status;
