"use client"

import { useState, useEffect } from "react"
import { Linkedin, Instagram, Youtube, Newspaper } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { BrandLogo } from "@/components/brand-logo"
import { sendContactEmail } from "@/app/actions/contact"
import { supabase } from "@/lib/supabase"
import type { FooterSettings } from "@/lib/supabase"

interface FooterProps {
  data?: FooterSettings | null
}

export function Footer({ data: initialData }: FooterProps) {
  const [data, setData] = useState<FooterSettings | null>(initialData || null)
  const [loading, setLoading] = useState(initialData === undefined)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  useEffect(() => {
    if (initialData === undefined) {
      supabase
        .from("footer_settings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .then(({ data: fetched }) => {
          if (fetched && fetched.length > 0) {
            setData(fetched[0] as FooterSettings)
          }
          setLoading(false)
        })
    }
  }, [initialData])

  const [pending, setPending] = useState(false)

  const handleSubmit = async (formPayload: FormData) => {
    setPending(true)
    const receiverEmail = data?.email || "hello@craftstudio.com"
    const result = await sendContactEmail(formPayload, receiverEmail)
    setPending(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Message sent successfully!")
      setFormData({ name: "", email: "", message: "" })
    }
  }

  if (loading) {
    return (
      <footer className="px-6 md:px-12 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="h-16 md:h-24 w-2/3 bg-muted animate-pulse rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-8">
              <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4/6 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <div className="space-y-8">
              <div className="h-8 w-40 bg-muted animate-pulse rounded-md" />
              <div className="space-y-6">
                <div className="h-10 w-full bg-muted animate-pulse rounded-md border-b border-border" />
                <div className="h-10 w-full bg-muted animate-pulse rounded-md border-b border-border" />
                <div className="h-24 w-full bg-muted animate-pulse rounded-md border-b border-border" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  if (!data) return null

  // Fallbacks if no data provided
  const heading = data.heading || "Say hello."
  const description = data.description || ""
  const email = data?.email || "hello@craftstudio.com"
  const location = data?.location || "San Francisco, California"
  const copyrightText = data?.copyright_text || "© 2026 Craft Studio. All rights reserved."

  // Build active social links array
  const socialLinks = []
  if (data.instagram_url) socialLinks.push({ icon: Instagram, href: data.instagram_url, label: "Instagram" })
  if (data.linkedin_url) socialLinks.push({ icon: Linkedin, href: data.linkedin_url, label: "LinkedIn" })
  if (data.youtube_url) socialLinks.push({ icon: Youtube, href: data.youtube_url, label: "YouTube" })
  if (data.substack_url) socialLinks.push({ icon: Newspaper, href: data.substack_url, label: "Substack" })

  return (
    <footer id="footer" className="px-6 md:px-12 py-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* Big "Say hello" Heading */}
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-16 tracking-tight">
          {heading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left Column - Bio & Social Links */}
          <div className="flex flex-col gap-8">
            <BrandLogo variant="footer" />

            <p className="text-muted-foreground leading-relaxed max-w-md whitespace-pre-wrap">
              {description}
            </p>

            {/* Primary Contact - Direct Email Link */}
            <a
              href={`mailto:${email}`}
              className="text-2xl md:text-3xl font-semibold text-foreground hover:text-muted-foreground transition-colors"
            >
              {email}
            </a>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>{location}</p>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4 pt-4">
                {socialLinks.map((social) => (
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
                ))}
              </div>
            )}

            <p className="text-sm text-muted-foreground mt-auto pt-8">
              {copyrightText}
            </p>
          </div>

          {/* Right Column - Contact Form (Popkon Style) */}
          <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold text-foreground">
              Get in touch
            </h3>

            <form action={handleSubmit} className="flex flex-col gap-8">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
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
                  name="email"
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
                  name="message"
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
                disabled={pending}
                className="self-start px-8 py-3 bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                suppressHydrationWarning
              >
                {pending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  )
}
