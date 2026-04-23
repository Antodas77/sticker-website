# Files Changed - Footer and Craft Studio Customization

## Summary of Changes
This update adds customizable footer and craft studio section to the admin dashboard, along with PDF download fixes.

## Files Modified/Created

### 1. **Database Migration Script**
   - **File**: `/scripts/add-footer-craft-studio.sql` (NEW)
   - **Changes**: 
     - Added `footer_settings` table with customizable fields: studio name, bio, email, location, logo URL, and social media links
     - Added `craft_studio_settings` table with customizable image URL, title, and description
     - Added default values for both tables

### 2. **Supabase Library**
   - **File**: `/lib/supabase.ts`
   - **Changes**:
     - Added `FooterSettings` and `CraftStudioSettings` interfaces
     - Added `getFooterSettings()` function to fetch footer customization data
     - Added `updateFooterSettings()` function to save footer changes
     - Added `getCraftStudioSettings()` function to fetch craft studio data
     - Added `updateCraftStudioSettings()` function to save craft studio changes

### 3. **Footer Component**
   - **File**: `/components/footer.tsx`
   - **Changes**:
     - Added `useEffect` to fetch footer settings from database
     - Made studio name, bio, email, location, logo, and social links dynamic from database
     - Logo now displays image if uploaded, otherwise shows "CS" text box
     - All social media links are now customizable

### 4. **Menu Overlay Component**
   - **File**: `/components/menu-overlay.tsx`
   - **Changes**:
     - Added `useEffect` to fetch footer settings
     - Studio name now fetches from database instead of hardcoded "Craft Studio"
     - Logo now displays image if uploaded, otherwise shows "CS" text box

### 5. **About Page - PDF Download**
   - **File**: `/app/about/page.tsx`
   - **Changes**:
     - Simplified `ResumeSection` component to open PDF in new tab directly
     - Removed complex modal/iframe PDF preview functionality
     - Download button now opens PDF in new browser tab
     - Cleaned up unused imports (`useCallback`, `AnimatePresence`, `ExternalLink`, `X`, `FileText`)

### 6. **Admin Dashboard**
   - **File**: `/app/admin/page.tsx`
   - **Changes**:
     - Added new admin links in quick actions section
     - Added "Customize Footer" card linking to `/admin/footer`
     - Added "Customize Craft Studio" card linking to `/admin/craft-studio`
     - Updated icons to include `Mail` and `Image`

### 7. **Footer Admin Page**
   - **File**: `/app/admin/footer/page.tsx` (NEW)
   - **Features**:
     - Edit studio name, bio, email, and location
     - Upload custom logo/avatar image
     - Customize all social media links (LinkedIn, Twitter, Instagram, GitHub)
     - Live preview of changes
     - Save functionality with success/error feedback

### 8. **Craft Studio Admin Page**
   - **File**: `/app/admin/craft-studio/page.tsx` (NEW)
   - **Features**:
     - Upload custom image or GIF for craft studio section
     - Edit title and description
     - Live preview of image
     - Support for JPEG, PNG, GIF, WebP formats

## Features Implemented

### ✅ Footer Customization
- Studio name (text field)
- Bio/description (textarea)
- Email address (text field)
- Location (text field)
- Logo/avatar (image URL)
- Social media links:
  - LinkedIn
  - Twitter / X
  - Instagram
  - GitHub

### ✅ Craft Studio Section Customization
- Image/GIF URL upload
- Title text
- Description text
- Live preview

### ✅ PDF Download
- Direct download opens PDF in new browser tab
- Simplified user experience
- Removed modal/preview functionality

## How to Use

### For Users:
1. Go to Admin Dashboard (`/admin`)
2. Click "Customize Footer" to edit footer settings
3. Click "Customize Craft Studio" to edit the craft studio section
4. Fill in the fields and click "Save Changes"

### For Developers:
1. Run the migration script: `scripts/add-footer-craft-studio.sql` in Supabase
2. All data fetching uses the helper functions in `lib/supabase.ts`
3. Components fetch and display data on first render with loading states

## No Breaking Changes
- All existing functionality remains intact
- Existing admin pages (projects, testimonials, hero) unchanged
- Fallback values ensure app works if database records don't exist
- Backward compatible with existing data
