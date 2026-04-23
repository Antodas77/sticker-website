"use client"

import { useState, useEffect } from "react"
import { Linkedin, Twitter, Instagram, Github } from "lucide-react"
import Link from "next/link"
import { getFooterSettings, FooterSettings } from "@/lib/supabase"

export function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [settings, setSettings] = useState<FooterSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      const data = await getFooterSettings()
      setSettings(data)
      setIsLoading(false)
    }
    fetchSettings()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({ name: "", email: "", message: "" })
  }

  if (isLoading) {
    return (
      <footer id="footer" className="px-6 md:px-12 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">Loading footer...</div>
      </footer>
    )
  }

  const {
    studio_name = 'Craft Studio',
    studio_bio = '',
    studio_email = '',
    studio_location = '',
    studio_logo_url = '',
    linkedin_url = '',
    twitter_url = '',
    instagram_url = '',
    github_url = ''
  } = settings || {}

  const socialLinks = [
    { icon: Linkedin, href: linkedin_url || "https://linkedin.com", label: "LinkedIn" },
    { icon: Twitter, href: twitter_url || "https://twitter.com", label: "Twitter/X" },
    { icon: Instagram, href: instagram_url || "https://instagram.com", label: "Instagram" },
    { icon: Github, href: github_url || "https://github.com", label: "GitHub" },
  ]

  return (
    <footer id="footer" className="px-6 md:px-12 py-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* Big "Say hello" Heading */}
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-16 tracking-tight">
          Say hello.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left Column - Bio & Social Links */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              {studio_logo_url ? (
                <img
                  src={studio_logo_url}
                  alt={studio_name}
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-foreground flex items-center justify-center rounded">
                  <span className="text-background font-bold text-sm">CS</span>
                </div>
              )}
              <span className="text-xl font-semibold text-foreground">
                {studio_name}
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-md">
              {studio_bio}
            </p>

            {/* Primary Contact - Direct Email Link */}
            {studio_email && (
              <a
                href={`mailto:${studio_email}`}
                className="text-2xl md:text-3xl font-semibold text-foreground hover:text-muted-foreground transition-colors"
              >
                {studio_email}
              </a>
            )}

            {studio_location && (
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p>{studio_location}</p>
              </div>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-4">
              {socialLinks.map((social) => (
                social.href && (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </Link>
                )
              ))}
            </div>

            <p className="text-sm text-muted-foreground mt-auto pt-8">
              © 2026 {studio_name}. All rights reserved.
            </p>
          </div>

          {/* Right Column - Contact Form (Popkon Style) */}
          <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold text-foreground">
              Get in touch
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your name"
                  className="w-full bg-transparent border-0 border-b border-border pb-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  required
                  suppressHydrationWarning
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Your email"
                  className="w-full bg-transparent border-0 border-b border-border pb-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  required
                  suppressHydrationWarning
                />
              </div>

              <div className="relative">
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Your message"
                  rows={4}
                  className="w-full bg-transparent border-0 border-b border-border pb-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="self-start px-8 py-3 bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                suppressHydrationWarning
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  )
}
