-- Global Branding table: controls the logo/brand in the navigation header
-- brand_type: 'text' | 'image' | 'gif'
-- gif_loop:   true = always loop  |  false = play only on hover (needs static_poster_url)

CREATE TABLE IF NOT EXISTS global_branding (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_type       TEXT NOT NULL DEFAULT 'text',
  media_url        TEXT,
  static_poster_url TEXT,
  label_text       TEXT NOT NULL DEFAULT 'Craft Studio',
  link_dest        TEXT NOT NULL DEFAULT '/',
  gif_loop         BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- Seed one default row (text mode — the current look)
INSERT INTO global_branding (brand_type, label_text, link_dest, gif_loop)
VALUES ('text', 'Craft Studio', '/', true)
ON CONFLICT DO NOTHING;

-- Ensure RLS is enabled, but explicitly allow all operations
ALTER TABLE global_branding ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read" ON global_branding;
DROP POLICY IF EXISTS "Allow public insert" ON global_branding;
DROP POLICY IF EXISTS "Allow public update" ON global_branding;

-- Create policies that explicitly allow the anon role to read and write
CREATE POLICY "Allow public read" ON global_branding FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON global_branding FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON global_branding FOR UPDATE USING (true) WITH CHECK (true);
