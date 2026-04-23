"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="w-10 h-10 bg-secondary flex items-center justify-center rounded-2xl transition-all duration-300"
        aria-label="Toggle theme"
        suppressHydrationWarning
      >
        <div className="w-5 h-5" />
      </button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 bg-secondary hover:bg-accent flex items-center justify-center hover:scale-105 transition-all duration-300 rounded-2xl"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      suppressHydrationWarning
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-foreground transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-foreground transition-transform duration-300" />
      )}
    </button>
  )
}
