-- Create hero_content table
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT NOT NULL,
  heading_highlight TEXT NOT NULL,
  subheading TEXT NOT NULL,
  badge_text TEXT NOT NULL,
  cta_primary TEXT NOT NULL,
  cta_primary_link TEXT NOT NULL,
  cta_secondary TEXT NOT NULL,
  cta_secondary_link TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  quote TEXT NOT NULL,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default hero content
INSERT INTO hero_content (heading, heading_highlight, subheading, badge_text, cta_primary, cta_primary_link, cta_secondary, cta_secondary_link)
VALUES (
  'Build Products',
  'That Inspire',
  'We craft beautiful digital experiences that connect with users and drive results. From concept to launch, we bring your vision to life.',
  'Now accepting new projects',
  'Work with me',
  '#footer',
  'View Projects',
  '/works'
);

-- Insert default projects
INSERT INTO projects (title, category, image, link, featured, "order")
VALUES
  ('Aurora Dashboard', 'Web Application', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=1000&fit=crop&q=80', 'https://example.com/aurora-dashboard', true, 1),
  ('Meridian Brand', 'Brand Identity', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=1000&fit=crop&q=80', 'https://example.com/meridian-brand', true, 2);

-- Insert default testimonials
INSERT INTO testimonials (name, role, quote, image, featured, "order")
VALUES
  ('Sarah Chen', 'CEO at TechFlow', 'Absolutely incredible work. They transformed our vision into a product that exceeded all expectations. The attention to detail was remarkable throughout the entire process.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', true, 1),
  ('Marcus Johnson', 'Founder at Innovate AI', 'The attention to detail and creative solutions blew us away. Their team understood our complex requirements and delivered a stunning result on time.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', true, 2),
  ('Emily Rodriguez', 'CTO at DataPrime', 'Professional, creative, and delivered on time. The best team we have ever worked with. They brought fresh perspectives that elevated our entire brand.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', true, 3),
  ('David Kim', 'Director at CloudScale', 'They do not just build products, they craft experiences. Outstanding results that have significantly improved our user engagement and conversion rates.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', true, 4),
  ('Lisa Thompson', 'VP Product at Nexus', 'From concept to launch, every interaction was seamless. A true pleasure to work with. Their collaborative approach made the entire project enjoyable.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', true, 5),
  ('James Wilson', 'CEO at StartupX', 'The team understood our needs perfectly and delivered beyond expectations. Their strategic thinking added immense value to our product direction.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', true, 6),
  ('Anna Martinez', 'Design Lead at Pixel', 'Working with this team was a breath of fresh air. They brought creativity and precision in equal measure. Our rebrand exceeded every benchmark we set.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face', true, 7),
  ('Robert Chang', 'Founder at Quantum', 'Exceptional quality and communication throughout the project. They turned our ambitious vision into reality with remarkable efficiency and skill.', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face', true, 8);
