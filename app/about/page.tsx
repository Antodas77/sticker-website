"use client"

import { motion } from "framer-motion"
import { MenuOverlay } from "@/components/menu-overlay"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { AboutContent } from "@/lib/supabase"

const DEFAULT_ABOUT: AboutContent = {
  id: "",
  hero_subtitle: "Crafting digital experiences that resonate.",
  philosophy_heading: "Our Philosophy",
  philosophy_text_1:
    "We believe that great design is invisible. It guides users naturally, creating experiences that feel intuitive and effortless. Our approach combines strategic thinking with meticulous craftsmanship.",
  philosophy_text_2:
    "Founded in 2018, Craft Studio emerged from a simple idea: that digital products should be as thoughtfully designed as the physical objects we cherish. We bring the same care and attention to every pixel, every interaction, and every line of code.",
  philosophy_text_3:
    "Our team of designers, developers, and strategists work collaboratively to solve complex challenges. We partner with forward-thinking companies who understand that design is a competitive advantage.",
  stat_1_label: "Years Experience",
  stat_1_value: "8+",
  stat_2_label: "Projects Delivered",
  stat_2_value: "120+",
  stat_3_label: "Happy Clients",
  stat_3_value: "85+",
  stat_4_label: "Awards Won",
  stat_4_value: "12",
  services:
    "Brand Identity & Strategy,UI/UX Design,Web Development,Design Systems,Motion Design,Creative Direction",
  location: "San Francisco, CA",
  founded: "2018",
  team_size: "12 Creatives",
  resume_url: "",
}

const DEFAULT_ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=700&fit=crop"

export default function AboutPage() {
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT)
  const [aboutImage, setAboutImage] = useState(DEFAULT_ABOUT_IMAGE)

  useEffect(() => {
    // Fetch about page text
    supabase
      .from("about_content")
      .select("*")
      .single()
      .then(({ data }) => {
        if (data) setAbout(data as AboutContent)
      })

    // Fetch about image from hero_content
    supabase
      .from("hero_content")
      .select("about_image")
      .single()
      .then(({ data }) => {
        if (data?.about_image) setAboutImage(data.about_image)
      })
  }, [])

  const stats = [
    { label: about.stat_1_label, value: about.stat_1_value },
    { label: about.stat_2_label, value: about.stat_2_value },
    { label: about.stat_3_label, value: about.stat_3_value },
    { label: about.stat_4_label, value: about.stat_4_value },
  ]

  // Services are stored as comma-separated or newline-separated
  const services = about.services
    .split(/,|\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <main className="min-h-screen">
      <MenuOverlay />

      {/* Hero Section with Full-Width Photo */}
      <section className="pt-32 pb-12 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto"
        >
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-6">
            ABOUT PAGE
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-10">
            {about.philosophy_heading || "BEHIND THE WORK"}
          </h1>
          <div className="space-y-6 text-xl md:text-2xl text-muted-foreground max-w-4xl leading-relaxed">
            {about.philosophy_text_1 && <p>{about.philosophy_text_1}</p>}
            {about.philosophy_text_2 && <p>{about.philosophy_text_2}</p>}
            {about.philosophy_text_3 && <p>{about.philosophy_text_3}</p>}
          </div>
        </motion.div>
      </section>

      {/* Full-Width Image */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 md:px-12 pb-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-card">
            <Image
              src={aboutImage}
              alt="Behind the work"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </motion.section>

      {/* Approach Section */}
      <section className="px-6 md:px-12 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
          >
            <div className="md:col-span-4">
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                APPROACH
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-6 text-lg md:text-xl text-foreground leading-relaxed max-w-3xl">
                {about.location && <p>{about.location}</p>}
                {about.founded && <p>{about.founded}</p>}
                {about.team_size && <p>{about.team_size}</p>}
              </div>

              {about.stat_1_value && (
                <div className="mt-10 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-card/50">
                  <span className="font-bold text-foreground text-lg">{about.stat_1_value}</span>
                  <span className="text-sm font-medium text-muted-foreground">{about.stat_1_label}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 md:px-12 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
          >
            <div className="md:col-span-4">
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                SERVICE AND EXPERTISE
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="flex flex-col">
                {services.map((service, index) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                    className="py-6 border-b border-border last:border-0 hover:pl-4 transition-all duration-300"
                  >
                    <p className="text-2xl md:text-3xl font-medium text-foreground">
                      {service}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resume Section */}
      {about.resume_url && (
        <ResumeSection resumeUrl={about.resume_url} />
      )}

      <Footer />
    </main>
  )
}

/* ─── PDF Download Component (opens in new tab) ────────────── */
function ResumeSection({ resumeUrl }: { resumeUrl: string }) {
  const handleDownload = () => {
    window.open(resumeUrl, "_blank")
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="px-6 md:px-12 py-16 border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-4">
          Resume
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-lg font-medium text-foreground">See CV</span>
          <button
            onClick={handleDownload}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>
    </motion.section>
  )
}
