import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

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
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  category: string
  image: string
  link: string
  featured: boolean
  order: number
  created_at: string
  updated_at: string
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
