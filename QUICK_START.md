# Quick Start Guide - 5 Minutes to Live

## 1️⃣ Setup Database (2 minutes)

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **SQL Editor** → **New Query**
3. Copy this file: `scripts/setup-supabase.sql`
4. Paste it and click **Run**
5. Done! Tables are created with sample data

## 2️⃣ Verify Everything Works (1 minute)

```bash
npm run verify
```

You should see:
```
✅ Environment variables are set
✅ Hero content found
✅ Found X featured projects
✅ Found X featured testimonials
```

## 3️⃣ See It Live (2 minutes)

```bash
npm run dev
```

Visit: **http://localhost:3000**

You should see:
- 🎯 Hero section with your heading and buttons
- 🖼️ Featured projects in a grid
- 💬 Testimonials in a carousel

## ✏️ Editing Content

### Update Hero Section
1. Supabase Dashboard → Table Editor
2. Select `hero_content`
3. Edit the row (only 1 row exists)
4. Refresh your website

### Add More Projects
1. Supabase Dashboard → Table Editor
2. Select `projects`
3. Click **Insert Row**
4. Fill in: title, category, image URL, link
5. Set `featured = true`
6. Refresh website

### Add More Testimonials
1. Supabase Dashboard → Table Editor
2. Select `testimonials`
3. Click **Insert Row**
4. Fill in: name, role, quote, avatar URL
5. Set `featured = true`
6. Refresh website

## 🚀 Deploy

```bash
git push origin main
```

Your Vercel deployment will automatically pull the latest data from Supabase.

## 📋 Field Reference

### Hero Content Table
- `heading` - Main text (e.g., "Build Products")
- `headingHighlight` - Secondary text (e.g., "That Inspire")
- `subheading` - Description paragraph
- `badgeText` - Small badge text
- `ctaPrimary` - Primary button text
- `ctaPrimaryLink` - Primary button link
- `ctaSecondary` - Secondary button text
- `ctaSecondaryLink` - Secondary button link

### Projects Table
- `title` - Project name
- `category` - Type of project
- `image` - Image URL (1600x1000px works best)
- `link` - Project URL
- `featured` - Set to `true` to show on homepage
- `order` - Display order (1, 2, 3, etc.)

### Testimonials Table
- `name` - Customer name
- `role` - Customer title (e.g., "CEO at Company")
- `quote` - The testimonial text
- `image` - Avatar URL (100x100px works best)
- `featured` - Set to `true` to show on homepage
- `order` - Display order (1, 2, 3, etc.)

## 🎯 Data Flow

```
Supabase Database
        ↓
    app/page.tsx (fetches data)
        ↓
    Components (display data)
        ↓
    Your Website
```

## 🐛 Troubleshooting

**Not seeing your changes?**
- Try refreshing the page
- Check browser console for errors
- Verify `featured = true` is set
- Run `npm run verify` to check connection

**Data not showing?**
- Make sure you ran the SQL migration
- Check that tables exist in Supabase
- Verify environment variables are set
- Restart `npm run dev`

**"Missing environment variables" error?**
- Make sure `NEXT_PUBLIC_SUPABASE_URL` is set
- Make sure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Restart dev server after changing env vars

## 📚 More Information

- **Detailed Setup**: See `SUPABASE_SETUP.md`
- **Complete Integration Details**: See `INTEGRATION_CHECKLIST.md`
- **Data Flow Explanation**: See `FRONTEND_INTEGRATION_SUMMARY.md`
- **Full Report**: See `COMPLETION_REPORT.md`

## ✅ You're All Set!

Your website is now connected to Supabase and displaying content dynamically. Start editing content in the Supabase dashboard and watch it update on your website!
