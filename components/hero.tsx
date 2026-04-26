"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { HeroData } from "@/lib/supabase"

interface HeroProps {
  data?: HeroData | null
}

// Default values for when Sanity data is not available
const defaults = {
  heading: "Build Products",
  headingHighlight: "That Inspire",
  subheading: "We craft beautiful digital experiences that connect with users and drive results. From concept to launch, we bring your vision to life.",
  badgeText: "Now accepting new projects",
  ctaPrimary: "Work with me",
  ctaPrimaryLink: "#footer",
  ctaSecondary: "View Projects",
  ctaSecondaryLink: "/works",
}

export function Hero({ data }: HeroProps) {
  const heading = data?.heading || defaults.heading
  const headingHighlight = data?.heading_highlight || defaults.headingHighlight
  const subheading = data?.subheading || defaults.subheading
  const badgeText = data?.badge_text || defaults.badgeText
  const ctaPrimary = data?.cta_primary || defaults.ctaPrimary
  const ctaPrimaryLink = data?.cta_primary_link || defaults.ctaPrimaryLink
  const ctaSecondary = data?.cta_secondary || defaults.ctaSecondary
  const ctaSecondaryLink = data?.cta_secondary_link || defaults.ctaSecondaryLink
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-muted/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-muted/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">
            {badgeText}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6 text-balance"
        >
          {heading}
          <br />
          <span className="text-muted-foreground">{headingHighlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty"
        >
          {subheading}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="px-8 py-6 text-lg rounded-full">
            <Link href={ctaPrimaryLink}>
              {ctaPrimary}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-6 text-lg rounded-full border-border hover:bg-secondary"
          >
            <Link href={ctaSecondaryLink}>{ctaSecondary}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
