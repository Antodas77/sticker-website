ALTER TABLE footer_settings
ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT 'https://youtube.com',
ADD COLUMN IF NOT EXISTS substack_url TEXT DEFAULT 'https://substack.com';
