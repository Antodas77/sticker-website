import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface HeroData {
  id: string
  heading: string
  headingHighlight: string
  subheading: string
  badgeText: string
  ctaPrimary: string
  ctaPrimaryLink: string
  ctaSecondary: string
  ctaSecondaryLink: string
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
