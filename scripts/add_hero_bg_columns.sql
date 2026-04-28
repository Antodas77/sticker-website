-- Add hero background media columns to hero_content table
ALTER TABLE hero_content
  ADD COLUMN IF NOT EXISTS hero_bg_type text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS hero_bg_url  text;

-- hero_bg_type values: 'none' | 'image' | 'gif' | 'video'
