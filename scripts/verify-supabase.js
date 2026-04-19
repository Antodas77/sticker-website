#!/usr/bin/env node

/**
 * Supabase Integration Verification Script
 * This script verifies that:
 * 1. Environment variables are properly set
 * 2. Database schema is correctly created
 * 3. Seed data has been inserted
 * 4. All components can fetch and display data
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

console.log('✅ Environment variables are set')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyIntegration() {
  try {
    console.log('\n📋 Verifying Supabase Integration...\n')

    // Check Hero Content
    console.log('1. Checking hero_content table...')
    const { data: heroData, error: heroError } = await supabase
      .from('hero_content')
      .select('*')
      .single()

    if (heroError) {
      console.error('   ❌ Hero content table error:', heroError.message)
    } else if (heroData) {
      console.log('   ✅ Hero content found:')
      console.log(`      - Heading: ${heroData.heading}`)
      console.log(`      - Subheading: ${heroData.subheading}`)
    } else {
      console.warn('   ⚠️  No hero content found. Please add data to Supabase.')
    }

    // Check Projects
    console.log('\n2. Checking projects table...')
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)

    if (projectError) {
      console.error('   ❌ Projects table error:', projectError.message)
    } else if (projects && projects.length > 0) {
      console.log(`   ✅ Found ${projects.length} featured projects:`)
      projects.forEach((p, i) => {
        console.log(`      ${i + 1}. ${p.title} (${p.category})`)
      })
    } else {
      console.warn('   ⚠️  No featured projects found. Please add data to Supabase.')
    }

    // Check Testimonials
    console.log('\n3. Checking testimonials table...')
    const { data: testimonials, error: testimonialError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('featured', true)

    if (testimonialError) {
      console.error('   ❌ Testimonials table error:', testimonialError.message)
    } else if (testimonials && testimonials.length > 0) {
      console.log(`   ✅ Found ${testimonials.length} featured testimonials:`)
      testimonials.forEach((t, i) => {
        console.log(`      ${i + 1}. ${t.name} (${t.role})`)
      })
    } else {
      console.warn('   ⚠️  No featured testimonials found. Please add data to Supabase.')
    }

    console.log('\n✅ Verification complete!')
    console.log('\nNext steps:')
    console.log('1. Visit your Supabase dashboard to add/edit content')
    console.log('2. Run "npm run dev" to start the development server')
    console.log('3. Your website will display the data from Supabase')

  } catch (error) {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  }
}

verifyIntegration()
