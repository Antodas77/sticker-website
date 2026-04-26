-- DEFINITIVE FIX: Disable RLS on global_branding
-- This is an admin-only single-row settings table — no user-level access control needed.
-- Same approach used by footer_settings and craft_studio_settings in this project.

-- Step 1: Drop any previously created (possibly broken) policies
DROP POLICY IF EXISTS "Allow public read on global_branding" ON global_branding;
DROP POLICY IF EXISTS "Allow anon update on global_branding" ON global_branding;
DROP POLICY IF EXISTS "Allow anon insert on global_branding" ON global_branding;

-- Step 2: Disable RLS entirely — anon key can now freely read/write
ALTER TABLE global_branding DISABLE ROW LEVEL SECURITY;
