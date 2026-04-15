import { Hero } from "@/components/hero"
import { FeaturedWorks } from "@/components/featured-works"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"
import { MenuOverlay } from "@/components/menu-overlay"

export default function Home() {
  return (
    <main className="min-h-screen">
      <MenuOverlay />
      <Hero />
      <FeaturedWorks />
      <Testimonials />
      <Footer />
    </main>
  )
}
