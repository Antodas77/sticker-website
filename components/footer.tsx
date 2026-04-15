"use client"

import { useState } from "react"
import { Linkedin, Twitter, Instagram, Github } from "lucide-react"
import Link from "next/link"

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter/X" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
]

export function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({ name: "", email: "", message: "" })
  }

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
              <div className="w-10 h-10 bg-foreground flex items-center justify-center">
                <span className="text-background font-bold text-sm">CS</span>
              </div>
              <span className="text-xl font-semibold text-foreground">
                Craft Studio
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-md">
              We are a design-driven studio focused on creating meaningful
              digital experiences. Our work spans brand identity, web design,
              and interactive products that connect with people on a deeper
              level.
            </p>

            {/* Primary Contact - Direct Email Link */}
            <a
              href="mailto:hello@craftstudio.com"
              className="text-2xl md:text-3xl font-semibold text-foreground hover:text-muted-foreground transition-colors"
            >
              hello@craftstudio.com
            </a>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>San Francisco, California</p>
            </div>

            {/* Social Links */}
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

            <p className="text-sm text-muted-foreground mt-auto pt-8">
              © 2026 Craft Studio. All rights reserved.
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
