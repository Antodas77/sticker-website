## Supabase CMS Integration Guide

This website is now fully integrated with **Supabase** as the content management system. All content (hero section, featured projects, and testimonials) is stored in Supabase and dynamically displayed on the frontend.

## Quick Start

### 1. Supabase Project Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Navigate to **Project Settings** → **API**
3. Copy your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` - Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon Key
4. These are already added to your environment variables

### 2. Create Database Schema

The SQL migration file is pre-configured. To set up your database:

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire content from `scripts/setup-supabase.sql`
5. Paste it into the SQL editor
6. Click **Run**

**Option B: Using Query Editor**
- Open `scripts/setup-supabase.sql` in your project
- Copy all the SQL code
- Paste it into your Supabase SQL Editor and execute

### 3. Verify the Integration

Run the verification script to ensure everything is working:

```bash
npm run verify
```

This will check:
- Environment variables are properly set
- Database tables are created
- Sample data is loaded
- All components can fetch data

### 4. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your website displaying content from Supabase.

## Database Schema

The integration creates three main tables:

### `hero_content`
Stores the hero section content:
- `heading` - Main heading text
- `headingHighlight` - Secondary heading text (styled differently)
- `subheading` - Description text
- `badgeText` - Badge text in hero section
- `ctaPrimary` - Primary button text
- `ctaPrimaryLink` - Primary button link
- `ctaSecondary` - Secondary button text
- `ctaSecondaryLink` - Secondary button link

### `projects`
Stores featured projects:
- `title` - Project name
- `category` - Project category
- `image` - Project image URL
- `link` - Project link/URL
- `featured` - Boolean to show/hide on website
- `order` - Display order (1, 2, 3, etc.)

### `testimonials`
Stores customer testimonials:
- `name` - Customer name
- `role` - Customer role/title
- `quote` - Testimonial text
- `image` - Customer avatar URL
- `featured` - Boolean to show/hide on website
- `order` - Display order (1, 2, 3, etc.)

## Managing Content

### Adding Hero Content
1. Go to Supabase Dashboard → **Table Editor**
2. Select `hero_content` table
3. Click **Insert Row** and fill in the fields
4. The changes will appear on your website immediately

### Adding Projects
1. Go to **Table Editor** → `projects`
2. Click **Insert Row** and add:
   - Title, category, image URL, link
   - Set `featured` to `true` to display on website
   - Set `order` for display order
3. Projects are displayed in the "Featured Works" section

### Adding Testimonials
1. Go to **Table Editor** → `testimonials`
2. Click **Insert Row** and add:
   - Name, role, quote text, avatar URL
   - Set `featured` to `true` to display on website
   - Set `order` for display order
3. Testimonials appear in the "Wall of Love" section

## Frontend Components

All components automatically fetch and display data from Supabase:

### Hero Component (`components/hero.tsx`)
- Displays dynamic hero section content
- Falls back to default values if no data exists
- Receives `data` prop with `HeroData` type

### Featured Works Component (`components/featured-works.tsx`)
- Displays featured projects in a grid
- Shows only projects where `featured = true`
- Displays in order specified by `order` field
- Falls back to default projects if no data exists

### Testimonials Component (`components/testimonials.tsx`)
- Displays testimonials in a scrolling carousel
- Shows only testimonials where `featured = true`
- Displays in order specified by `order` field
- Duplicates testimonials for seamless marquee effect

## Data Fetching

The `lib/supabase.ts` file contains the data fetching logic:

```typescript
// Fetch hero content
const heroData = await getHeroData()

// Fetch featured projects
const projects = await getFeaturedProjects()

// Fetch featured testimonials
const testimonials = await getTestimonials()
```

These functions are called in `app/page.tsx` on the server side and the data is passed to components as props.

## Troubleshooting

### Data not appearing?
1. Run `npm run verify` to check the integration
2. Ensure environment variables are set correctly
3. Check that content is marked as `featured = true` in Supabase
4. Try refreshing the page

### Database tables don't exist?
1. Make sure you ran the SQL migration from `scripts/setup-supabase.sql`
2. Check the SQL Editor in Supabase for any errors
3. Verify you have the correct permissions in Supabase

### "Missing Supabase environment variables" error?
1. Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
2. Restart the development server after adding environment variables
3. Verify the credentials are correct in your Supabase dashboard

## Environment Variables

Your project uses these environment variables (already configured):
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your public API key for client-side access

These are public keys (safe to expose in the browser) and are used for querying public data only.

## Next Steps

1. Add your own content to the Supabase tables
2. Customize the styling and layout of components as needed
3. Deploy to Vercel (environment variables will be inherited from your project settings)
4. Continue managing content directly from the Supabase dashboard
