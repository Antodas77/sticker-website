-- Create page_content table for editable page headings
CREATE TABLE IF NOT EXISTS page_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  featured_works_heading text NOT NULL DEFAULT '',
  featured_works_subheading text NOT NULL DEFAULT '',
  works_page_heading text NOT NULL DEFAULT '',
  works_page_subheading text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert the single default row (only if table is empty)
INSERT INTO page_content (featured_works_heading, featured_works_subheading, works_page_heading, works_page_subheading)
SELECT '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM page_content);

-- Enable Row Level Security
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Allow public read on page_content"
  ON page_content FOR SELECT USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update on page_content"
  ON page_content FOR UPDATE USING (auth.role() = 'authenticated');
