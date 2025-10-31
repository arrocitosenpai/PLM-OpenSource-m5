-- Fix all opportunities with NULL or undefined current_stage
-- Set them to 'product' as the default starting stage

UPDATE opportunities
SET current_stage = 'product'
WHERE current_stage IS NULL;

-- Also ensure all opportunities have a status
UPDATE opportunities
SET status = 'in-progress'
WHERE status IS NULL;

-- Add stage history entries for opportunities that don't have them
INSERT INTO opportunity_stage_history (opportunity_id, stage, start_date)
SELECT id, 'product', created_at
FROM opportunities
WHERE current_stage = 'product'
AND id NOT IN (
  SELECT DISTINCT opportunity_id 
  FROM opportunity_stage_history 
  WHERE stage = 'product'
);
