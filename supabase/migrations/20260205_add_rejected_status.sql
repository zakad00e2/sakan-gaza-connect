-- Add rejected status to listing_status enum
ALTER TYPE listing_status ADD VALUE IF NOT EXISTS 'rejected';

-- Update existing rejected listings (if any were marked as hidden by rejection)
-- This is optional, just for clarity
COMMENT ON COLUMN listings.status IS 'Status: active (published), pending (awaiting approval), rejected (declined by admin), hidden (hidden by owner)';
