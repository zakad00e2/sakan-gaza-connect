-- Add rejected status support
-- Since status is a text column, we just need to add a check constraint

-- First, drop the old check constraint if it exists
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;

-- Add new check constraint that includes 'rejected'
ALTER TABLE listings ADD CONSTRAINT listings_status_check 
  CHECK (status IN ('active', 'pending', 'rejected', 'hidden'));

-- Update comment for clarity
COMMENT ON COLUMN listings.status IS 'Status: active (published), pending (awaiting approval), rejected (declined by admin), hidden (hidden by owner)';
