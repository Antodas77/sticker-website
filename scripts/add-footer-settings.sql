-- Footer Settings table
CREATE TABLE IF NOT EXISTS footer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT NOT NULL DEFAULT 'Say hello.',
  description TEXT NOT NULL DEFAULT 'We are a design-driven studio focused on creating meaningful digital experiences. Our work spans brand identity, web design, and interactive products that connect with people on a deeper level.',
  email TEXT NOT NULL DEFAULT 'hello@craftstudio.com',
  location TEXT NOT NULL DEFAULT 'San Francisco, California',
  linkedin_url TEXT DEFAULT 'https://linkedin.com',
  twitter_url TEXT DEFAULT 'https://twitter.com',
  instagram_url TEXT DEFAULT 'https://instagram.com',
  github_url TEXT DEFAULT 'https://github.com',
  copyright_text TEXT NOT NULL DEFAULT '© 2026 Craft Studio. All rights reserved.',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed one default row
INSERT INTO footer_settings (heading)
VALUES ('Say hello.')
ON CONFLICT DO NOTHING;

-- Ensure RLS is enabled, but explicitly allow all operations
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read on footer_settings" ON footer_settings;
DROP POLICY IF EXISTS "Allow public insert on footer_settings" ON footer_settings;
DROP POLICY IF EXISTS "Allow public update on footer_settings" ON footer_settings;

-- Create policies that explicitly allow the anon role to read and write
CREATE POLICY "Allow public read on footer_settings" ON footer_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on footer_settings" ON footer_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on footer_settings" ON footer_settings FOR UPDATE USING (true) WITH CHECK (true);
