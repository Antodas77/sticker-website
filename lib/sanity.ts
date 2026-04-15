import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Types
export interface Project {
  _id: string
  title: string
  slug: { current: string }
  image: SanityImageSource
  description?: string
  category?: string
  link?: string
  featured: boolean
  order?: number
}

export interface Testimonial {
  _id: string
  name: string
  role: string
  company?: string
  quote: string
  image?: SanityImageSource
  order?: number
}

export interface HeroData {
  _id: string
  heading: string
  headingHighlight?: string
  subheading?: string
  badgeText?: string
  ctaPrimary?: string
  ctaPrimaryLink?: string
  ctaSecondary?: string
  ctaSecondaryLink?: string
}

// Data fetching functions
export async function getProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project"] | order(order asc, _createdAt desc) {
      _id,
      title,
      slug,
      image,
      description,
      category,
      link,
      featured,
      order
    }`
  )
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project" && featured == true] | order(order asc, _createdAt desc) {
      _id,
      title,
      slug,
      image,
      description,
      category,
      link,
      featured,
      order
    }`
  )
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch(
    `*[_type == "testimonial"] | order(order asc, _createdAt desc) {
      _id,
      name,
      role,
      company,
      quote,
      image,
      order
    }`
  )
}

export async function getHeroData(): Promise<HeroData | null> {
  return client.fetch(
    `*[_type == "hero"][0] {
      _id,
      heading,
      headingHighlight,
      subheading,
      badgeText,
      ctaPrimary,
      ctaPrimaryLink,
      ctaSecondary,
      ctaSecondaryLink
    }`
  )
}
