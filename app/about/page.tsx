"use client"

import { motion } from "framer-motion"
import { MenuOverlay } from "@/components/menu-overlay"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { useEffect, useState } from "react"
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
      <section className="pt-24 pb-12 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6">
            About
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            {about.hero_subtitle}
          </p>
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
              alt="Our team collaborating"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </motion.section>

      {/* Biography Section */}
      <section className="px-6 md:px-12 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                {about.philosophy_heading}
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>{about.philosophy_text_1}</p>
                <p>{about.philosophy_text_2}</p>
                <p>{about.philosophy_text_3}</p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <div className="grid grid-cols-2 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="p-6 border border-border rounded-xl"
                  >
                    <p className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
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
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Services &amp; Expertise
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              We offer end-to-end creative services tailored to your needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 * index }}
                className="p-6 border border-border rounded-xl hover:bg-card transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-foreground group-hover:text-foreground/90">
                    {service}
                  </p>
                  <span className="text-muted-foreground text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Experience */}
      <section className="px-6 md:px-12 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm text-muted-foreground mb-2">Location</p>
              <p className="text-xl font-medium text-foreground">{about.location}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-sm text-muted-foreground mb-2">Founded</p>
              <p className="text-xl font-medium text-foreground">{about.founded}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-sm text-muted-foreground mb-2">Team Size</p>
              <p className="text-xl font-medium text-foreground">{about.team_size}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
