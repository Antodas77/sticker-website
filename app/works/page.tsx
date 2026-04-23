"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { MenuOverlay } from "@/components/menu-overlay"
import Link from "next/link"
import { motion, AnimatePresence, LayoutGroup, useMotionValue, useSpring } from "framer-motion"
import { getAllProjects } from "@/lib/supabase"
import type { Project } from "@/lib/supabase"

function CursorFollower({ isVisible, cardRef }: { isVisible: boolean; cardRef: React.RefObject<HTMLElement | null> }) {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 300 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        cursorX.set(e.clientX - rect.left)
        cursorY.set(e.clientY - rect.top)
      }
    }

    const card = cardRef.current
    if (card) {
      card.addEventListener("mousemove", handleMouseMove)
      return () => card.removeEventListener("mousemove", handleMouseMove)
    }
  }, [cardRef, cursorX, cursorY])

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
      style={{
        borderRadius: "16px",
      }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-foreground px-4 py-2"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isVisible ? 1 : 0,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-sm font-medium text-background whitespace-nowrap">
          View Project
        </span>
      </motion.div>
    </motion.div>
  )
}

function ProjectCardWrapper({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      ref={cardRef}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden cursor-none transition-colors duration-300 hover:border-muted-foreground/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CursorFollower
        isVisible={isHovered}
        cardRef={cardRef}
      />
      
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {/* Project Image */}
        <div className="aspect-[4/3] relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                "https://placehold.co/800x600/1a1a1a/444?text=No+Image"
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1.5 text-xs font-medium bg-background/90 backdrop-blur-sm text-foreground rounded-full">
              {project.category}
            </span>
          </div>
        </div>

        {/* Project Info */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
              {project.title}
            </h3>
            {project.year && (
              <span className="text-sm text-muted-foreground shrink-0 tabular-nums">
                {project.year}
              </span>
            )}
          </div>
          {project.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      </a>
    </div>
  )
}

export default function WorksPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")

  useEffect(() => {
    getAllProjects().then((data) => {
      setProjects(data)
      setLoading(false)
    })
  }, [])

  // Derive categories dynamically from DB data
  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category))).sort(),
  ]

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  return (
    <main className="min-h-screen bg-background">
      <MenuOverlay />

      {/* Header */}
      <header className="px-6 md:px-12 pt-8 pb-4">
        <Link
          href="/"
          className="text-foreground font-medium tracking-tight text-lg hover:opacity-70 transition-opacity"
        >
          Craft Studio
        </Link>
      </header>

      {/* Page Title */}
      <section className="px-6 md:px-12 py-12 md:py-16">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight text-balance">
          Selected Works
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          A curated collection of projects spanning design, development, and beyond.
        </p>
      </section>

      {/* Filter Bar */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-6 md:px-12 py-4">
          <LayoutGroup>
            <ul className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {categories.map((category) => {
                const isActive = activeFilter === category
                const count =
                  category === "All"
                    ? projects.length
                    : projects.filter((p) => p.category === category).length

                return (
                  <li key={category} className="relative">
                    <button
                      onClick={() => setActiveFilter(category)}
                      className={`relative px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 rounded-full z-10 ${
                        isActive
                          ? "text-background"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {category}
                        <span
                          className={`text-xs transition-opacity ${
                            isActive ? "opacity-70" : "opacity-50"
                          }`}
                        >
                          {count}
                        </span>
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-foreground rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </LayoutGroup>
        </div>
      </nav>

      {/* Project Grid */}
      <section className="px-6 md:px-12 py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <LayoutGroup>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      opacity: { duration: 0.2 },
                      layout: {
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      },
                    }}
                  >
                    <ProjectCardWrapper project={project} />
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}

        {/* Empty state */}
        <AnimatePresence>
          {!loading && filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">
                No projects found in this category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Project count */}
      {!loading && (
        <section className="px-6 md:px-12 pb-12 border-t border-border pt-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
            {activeFilter !== "All" && (
              <button
                onClick={() => setActiveFilter("All")}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        </section>
      )}
    </main>
  )
}
