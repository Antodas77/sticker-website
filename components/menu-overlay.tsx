"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { BrandLogo } from "@/components/brand-logo"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#footer" },
]

const socialLinks = [
  { label: "Resume", href: "/about#resume" },
]

export function MenuOverlay() {
  const [isOpen, setIsOpen] = useState(false)

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    if (href.startsWith("#")) {
      // Small timeout to allow the menu closing animation to start
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY
          window.scrollTo({ top: y, behavior: "smooth" })
        }
      }, 100)
    }
  }

  return (
    <>
      {/* Fixed Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5">
        {/* Dynamic Brand Logo */}
        <BrandLogo />

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <ThemeToggle />
          
          {/* 40px Dark Square Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 bg-foreground flex items-center justify-center hover:scale-105 transition-transform relative z-50 rounded-2xl"
            aria-label="Toggle menu"
            suppressHydrationWarning
          >
            <Menu className="w-5 h-5 text-background" />
          </button>
        </div>
      </header>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, transformOrigin: "top right" }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transformOrigin: "top right" }}
              transition={{ 
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="fixed top-16 right-6 z-50 bg-card border border-border rounded-xl p-6 w-56 shadow-xl"
            >
              {/* Navigation Links */}
              <nav className="space-y-3 mb-6">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.href.startsWith("#") ? (
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="block text-sm font-medium text-foreground hover:text-muted-foreground transition-colors w-full text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Divider */}
              <div className="h-px bg-border mb-4" />

              {/* Social Links */}
              <nav className="space-y-2">
                {socialLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
