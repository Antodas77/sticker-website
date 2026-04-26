import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Browser Supabase client — uses @supabase/ssr so the session is stored
 * in cookies (not just localStorage). This makes the session readable
 * by Next.js middleware for server-side auth guards.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Types
export interface HeroData {
  id: string
  heading: string
  heading_highlight: string
  subheading: string
  badge_text: string
  cta_primary: string
  cta_primary_link: string
  cta_secondary: string
  cta_secondary_link: string
  about_image?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  category: string
  image: string
  link: string
  description: string
  year: string
  role: string
  featured: boolean
  order: number
  created_at: string
  updated_at: string
}

export interface AboutContent {
  id: string
  hero_subtitle: string
  philosophy_heading: string
  philosophy_text_1: string
  philosophy_text_2: string
  philosophy_text_3: string
  stat_1_label: string
  stat_1_value: string
  stat_2_label: string
  stat_2_value: string
  stat_3_label: string
  stat_3_value: string
  stat_4_label: string
  stat_4_value: string
  services: string
  location: string
  founded: string
  team_size: string
  resume_url?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  quote: string
  image: string | null
  featured: boolean
  order: number
  created_at: string
  updated_at: string
}

export interface GlobalBranding {
  id: string
  brand_type: 'text' | 'image' | 'gif'
  media_url: string | null
  static_poster_url: string | null
  label_text: string
  link_dest: string
  gif_loop: boolean
  created_at: string
  updated_at: string
}

export interface FooterSettings {
  id: string
  heading: string
  description: string
  email: string
  location: string
  instagram_url: string | null
  linkedin_url: string | null
  youtube_url: string | null
  substack_url: string | null
  copyright_text: string
  created_at: string
  updated_at: string
}

// Data fetching functions
export async function getHeroData(): Promise<HeroData | null> {
  try {
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching hero data:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('Error fetching hero data:', error)
    return null
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('order', { ascending: true })

    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      console.error('Error fetching all projects:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Error fetching all projects:', error)
    return []
  }
}

export async function getAboutContent(): Promise<AboutContent | null> {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching about content:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('Error fetching about content:', error)
    return null
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('featured', true)
      .order('order', { ascending: true })

    if (error) {
      console.error('Error fetching testimonials:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

export async function getGlobalBranding(): Promise<GlobalBranding | null> {
  try {
    const { data, error } = await supabase
      .from('global_branding')
      .select('*')
      .single()
    if (error) {
      console.error('Error fetching global branding:', error)
      return null
    }
    return data as GlobalBranding
  } catch (error) {
    console.error('Error fetching global branding:', error)
    return null
  }
}

export async function updateGlobalBranding(
  id: string,
  updates: Partial<Omit<GlobalBranding, 'id' | 'created_at' | 'updated_at'>>
): Promise<GlobalBranding | null> {
  try {
    const { data, error } = await supabase
      .from('global_branding')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()
    if (error) {
      console.error('Error updating global branding:', error)
      return null
    }
    return data as GlobalBranding
  } catch (error) {
    console.error('Error updating global branding:', error)
    return null
  }
}

export async function getFooterSettings(): Promise<FooterSettings | null> {
  try {
    const { data, error } = await supabase
      .from('footer_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
    if (error) {
      console.error('Error fetching footer settings:', error)
      return null
    }
    if (data && data.length > 0) {
      return data[0] as FooterSettings
    }
    return null
  } catch (error) {
    console.error('Error fetching footer settings:', error)
    return null
  }
}
