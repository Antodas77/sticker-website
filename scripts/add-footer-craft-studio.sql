-- Create footer_settings table for customizable footer content
CREATE TABLE IF NOT EXISTS footer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_name TEXT NOT NULL DEFAULT 'Craft Studio',
  studio_bio TEXT DEFAULT '',
  studio_email TEXT DEFAULT '',
  studio_location TEXT DEFAULT '',
  studio_logo_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create craft_studio_settings table for hero craft studio section customization
CREATE TABLE IF NOT EXISTS craft_studio_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT,
  title TEXT NOT NULL DEFAULT 'Craft Studio',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default footer settings
INSERT INTO footer_settings (studio_name, studio_bio, studio_email, studio_location, linkedin_url, twitter_url, instagram_url, github_url)
VALUES (
  'Craft Studio',
  'Creating beautiful digital experiences that inspire and connect.',
  'hello@craftstudio.com',
  'San Francisco, CA',
  'https://linkedin.com',
  'https://twitter.com',
  'https://instagram.com',
  'https://github.com'
);

-- Insert default craft studio settings
INSERT INTO craft_studio_settings (image_url, title, description)
VALUES (
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
  'Craft Studio',
  'We design and develop beautiful digital experiences'
);
