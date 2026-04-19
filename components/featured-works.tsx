"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import Image from "next/image"

export interface ProjectData {
  title: string
  category: string
  image: string
  link: string
  role?: string
}

// Default projects for when data is not available
const defaultProjects: ProjectData[] = [
  {
    title: "Aurora Dashboard",
    category: "Web Application",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=1000&fit=crop&q=80",
    link: "https://example.com/aurora-dashboard",
  },
  {
    title: "Meridian Brand",
    category: "Brand Identity",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=1000&fit=crop&q=80",
    link: "https://example.com/aurora-dashboard",
  },
]

function CursorFollower({ isVisible, containerRef }: { isVisible: boolean; containerRef: React.RefObject<HTMLElement | null> }) {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 300 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        cursorX.set(e.clientX - rect.left)
        cursorY.set(e.clientY - rect.top)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      return () => container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [containerRef, cursorX, cursorY])

  return (
    <motion.div
      className="pointer-events-none absolute z-50 flex items-center justify-center rounded-full bg-foreground px-4 py-2"
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
  )
}

function ProjectCard({
  project,
  index,
  onHoverChange
}: {
  project: ProjectData
  index: number
  onHoverChange: (isHovered: boolean) => void
}) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleHoverStart = () => {
    setIsHovered(true)
    onHoverChange(true)
  }

  const handleHoverEnd = () => {
    setIsHovered(false)
    onHoverChange(false)
  }

  return (
    <motion.a
      ref={cardRef}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-full cursor-none overflow-hidden block"
      style={{ borderRadius: "32px" }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image container with zoom effect */}
      <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ borderRadius: "32px" }}>
        <motion.div
          className="absolute inset-0"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Subtle overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>

      {/* Minimalist text label container */}
      <div className="mt-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left Side: Number + Title */}
        <div className="flex gap-4 md:gap-8 items-baseline">
          <span className="text-sm font-medium text-muted-foreground tabular-nums">
            Project {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-2xl md:text-4xl font-semibold text-foreground group-hover:text-accent transition-colors tracking-tight">
            {project.title}
          </h3>
        </div>
        
        {/* Right Side: Role/Type + Arrow */}
        <div className="flex items-center gap-6 justify-between w-full md:w-auto">
          <p className="text-muted-foreground text-sm md:text-base font-medium">
            {project.role || project.category}
          </p>
          <motion.div
            animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-foreground text-xl"
          >
            ↗
          </motion.div>
        </div>
      </div>
    </motion.a>
  )
}

interface FeaturedWorksProps {
  projects?: ProjectData[]
}

export function FeaturedWorks({ projects }: FeaturedWorksProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const projectsToShow = projects && projects.length > 0 ? projects : defaultProjects

  return (
    <section ref={sectionRef} className="relative px-4 md:px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Featured Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Selected projects showcasing our expertise in design and development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projectsToShow.map((project, index) => (
            <div key={index} className="relative">
              <CursorFollower
                isVisible={hoveredIndex === index}
                containerRef={sectionRef}
              />
              <ProjectCard
                project={project}
                index={index}
                onHoverChange={(isHovered) => setHoveredIndex(isHovered ? index : null)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
