## Supabase Migration Complete

Your website has been successfully migrated from Sanity CMS to Supabase. Here's what you need to do next:

### 1. Set up Supabase Database

Go to your Supabase project dashboard and run the SQL script to create the tables:

1. Log in to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to the SQL Editor
4. Create a new query and paste the contents of `scripts/setup-supabase.sql`
5. Click "Run" to create the tables and insert default data

### 2. Understanding the Data Structure

Your content is organized in three tables:

**hero_content** - Your landing page hero section
- heading: Main heading text
- heading_highlight: Secondary heading (styled differently)
- subheading: Description text
- badge_text: Status badge (e.g., "Now accepting new projects")
- cta_primary: Primary button text
- cta_primary_link: Primary button link
- cta_secondary: Secondary button text
- cta_secondary_link: Secondary button link

**projects** - Featured work/portfolio items
- title: Project name
- category: Project type
- image: Project image URL
- link: Project link
- featured: Set to `true` to display on homepage
- order: Display order (1, 2, 3, etc.)

**testimonials** - Client/user testimonials
- name: Testimonial author
- role: Author's title/company
- quote: The testimonial text
- image: Author avatar image URL
- featured: Set to `true` to display on homepage
- order: Display order (1, 2, 3, etc.)

### 3. Manage Your Content

To add, edit, or delete content:
1. Go to your Supabase project dashboard
2. Click on "Table Editor" in the left sidebar
3. Select the table you want to edit
4. Add/edit rows directly in the interface

### 4. Default Content

The script includes default hero content, 2 featured projects, and 8 testimonials. Update these with your own information.

### 5. Key Files

- `lib/supabase.ts` - Supabase client and data fetching functions
- `scripts/setup-supabase.sql` - Database schema and seed data
- `app/page.tsx` - Imports data from Supabase and passes to components

All components have fallback default data, so the site will continue working even if Supabase is temporarily unavailable.

### 6. Troubleshooting

If data isn't showing:
- Check that environment variables are set correctly (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Verify the SQL script was executed successfully
- Check browser console for errors
- Make sure `featured: true` is set for items you want to display
