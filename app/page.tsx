import { Hero } from "@/components/hero"
import { FeaturedWorks } from "@/components/featured-works"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"
import { MenuOverlay } from "@/components/menu-overlay"
import { getFeaturedProjects, getTestimonials, getHeroData, urlFor } from "@/lib/sanity"

export default async function Home() {
  const [featuredProjects, testimonials, heroData] = await Promise.all([
    getFeaturedProjects(),
    getTestimonials(),
    getHeroData(),
  ])

  // Transform Sanity data to match component props
  const projectsData = featuredProjects.map((project) => ({
    title: project.title,
    category: project.category || 'Project',
    image: project.image ? urlFor(project.image).width(1600).height(1000).url() : '',
    link: project.link || '#',
  }))

  const testimonialsData = testimonials.map((t) => ({
    name: t.name,
    role: t.role,
    content: t.quote,
    avatar: t.image ? urlFor(t.image).width(100).height(100).url() : '',
  }))

  return (
    <main className="min-h-screen">
      <MenuOverlay />
      <Hero data={heroData} />
      <FeaturedWorks projects={projectsData} />
      <Testimonials testimonials={testimonialsData} />
      <Footer />
    </main>
  )
}
