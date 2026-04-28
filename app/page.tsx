export const dynamic = 'force-dynamic'
import { Hero } from "@/components/hero"
import { FeaturedWorks } from "@/components/featured-works"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"
import { MenuOverlay } from "@/components/menu-overlay"
import { getFeaturedProjects, getTestimonials, getHeroData, getFooterSettings, getPageContent } from "@/lib/supabase"

export default async function Home() {
  try {
    const [featuredProjects, testimonials, heroData, footerData, pageContent] = await Promise.all([
      getFeaturedProjects(),
      getTestimonials(),
      getHeroData(),
      getFooterSettings(),
      getPageContent(),
    ])

    // Transform Supabase data to match component props
    const projectsData = featuredProjects.map((project) => ({
      title: project.title,
      category: project.category || 'Project',
      image: project.image || "",
      link: project.link || '#',
    }))

    const testimonialsData = testimonials.map((t) => ({
      name: t.name,
      role: t.role,
      content: t.quote,
      avatar: t.image || "",
    }))

    return (
      <main className="min-h-screen">
        <MenuOverlay />
        <Hero data={heroData} />
        <FeaturedWorks
          projects={projectsData}
          heading={pageContent?.featured_works_heading}
          subheading={pageContent?.featured_works_subheading}
        />
        <Testimonials testimonials={testimonialsData} />
        <Footer data={footerData} />
      </main>
    )
  } catch (error) {
    console.error("[v0] Error fetching data:", error)
    
    // Render with fallbacks if data fetching fails
    return (
      <main className="min-h-screen">
        <MenuOverlay />
        <Hero data={null} />
        <FeaturedWorks projects={undefined} />
        <Testimonials testimonials={undefined} />
        <Footer data={null} />
      </main>
    )
  }
}
