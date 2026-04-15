"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { MenuOverlay } from "@/components/menu-overlay"
import Link from "next/link"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"

const categories = ["All", "AI Solutions", "UI/UX", "Development"]

const projects = [
  {
    id: 1,
    title: "Neural Canvas",
    category: "AI Solutions",
    year: "2024",
    description: "AI-powered design tool that generates creative assets from natural language prompts.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Vertex Dashboard",
    category: "UI/UX",
    year: "2024",
    description: "Enterprise analytics platform with real-time data visualization and reporting.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Synthwave AI",
    category: "AI Solutions",
    year: "2024",
    description: "Generative music composition engine using deep learning and audio synthesis.",
    image: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Pulse Health",
    category: "Development",
    year: "2024",
    description: "Full-stack health tracking platform with wearable device integration.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    title: "Lumina Studio",
    category: "UI/UX",
    year: "2023",
    description: "Brand identity and web experience for a creative photography collective.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
  },
  {
    id: 6,
    title: "DataMesh API",
    category: "Development",
    year: "2023",
    description: "Scalable microservices architecture for real-time data processing pipelines.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
  },
  {
    id: 7,
    title: "Vision GPT",
    category: "AI Solutions",
    year: "2023",
    description: "Multimodal AI assistant for image analysis and intelligent content generation.",
    image: "https://images.unsplash.com/photo-1684369176170-463e84248b70?w=800&h=600&fit=crop",
  },
  {
    id: 8,
    title: "Orbit Finance",
    category: "UI/UX",
    year: "2023",
    description: "Modern fintech interface for cryptocurrency portfolio management.",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=600&fit=crop",
  },
]

export default function WorksPage() {
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  return (
    <main className="min-h-screen bg-background">
      <MenuOverlay />
      
      {/* Header */}
      <header className="px-6 md:px-12 pt-8 pb-4">
        <Link href="/" className="text-foreground font-medium tracking-tight text-lg hover:opacity-70 transition-opacity">
          Craft Studio
        </Link>
      </header>

      {/* Page Title */}
      <section className="px-6 md:px-12 py-12 md:py-16">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight text-balance">
          Selected Works
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          A curated collection of projects spanning AI, design, and development.
        </p>
      </section>

      {/* Filter Bar - Cargo Style with animated pill */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-6 md:px-12 py-4">
          <LayoutGroup>
            <ul className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {categories.map((category) => {
                const isActive = activeFilter === category
                const count = category === "All" 
                  ? projects.length 
                  : projects.filter(p => p.category === category).length
                
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
                        <span className={`text-xs transition-opacity ${isActive ? "opacity-70" : "opacity-50"}`}>
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
                  className="group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-colors duration-300 hover:border-muted-foreground/50"
                >
                  {/* Project Image */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Arrow icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <ArrowUpRight className="w-5 h-5 text-foreground" />
                    </div>

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
                      <span className="text-sm text-muted-foreground shrink-0 tabular-nums">
                        {project.year}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {/* Empty state */}
        <AnimatePresence>
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">No projects found in this category.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Project count */}
      <section className="px-6 md:px-12 pb-12 border-t border-border pt-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          <p className="text-sm text-muted-foreground">
            {activeFilter !== "All" && (
              <button 
                onClick={() => setActiveFilter("All")}
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Clear filter
              </button>
            )}
          </p>
        </div>
      </section>
    </main>
  )
}
