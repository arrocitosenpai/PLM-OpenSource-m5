-- Fix all opportunities that have NULL current_stage
-- This will set them to 'product' as the default starting stage

UPDATE opportunities 
SET current_stage = 'product'
WHERE current_stage IS NULL;

-- Verify the update
SELECT id, name, current_stage 
FROM opportunities 
ORDER BY id;

SELECT 'Fixed current_stage for all opportunities' as status;
