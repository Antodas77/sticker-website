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


function CursorFollower({ isVisible, cardRef }: { isVisible: boolean; cardRef: React.RefObject<HTMLElement | null> }) {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        cursorX.set(e.clientX - rect.left - rect.width / 2)
        cursorY.set(e.clientY - rect.top - rect.height / 2)
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
        borderRadius: "0",
      }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-foreground px-4 py-2"
        style={{
          x: cursorX,
          y: cursorY,
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

function ProjectCard({
  project,
  index,
  onHoverChange,
  isHoveredFromParent
}: {
  project: ProjectData
  index: number
  onHoverChange: (isHovered: boolean) => void
  isHoveredFromParent: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
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
    <div
      ref={cardRef}
      className="group relative w-full cursor-none overflow-hidden"
      style={{ borderRadius: "0" }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <CursorFollower
        isVisible={isHovered}
        cardRef={cardRef}
      />
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-full block cursor-none"
        style={{ borderRadius: "0" }}
      >
        {/* Image container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ borderRadius: "32px" }}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Text label container — rounded bottom corners */}
        <div
          className="mt-3 flex flex-col md:flex-row md:items-start justify-between gap-4 px-5 py-5"
          style={{ borderRadius: "0 0 32px 32px" }}
        >
          {/* Left Side: Title */}
          <div className="flex items-baseline">
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
      </a>
    </div>
  )
}

interface FeaturedWorksProps {
  projects?: ProjectData[]
  heading?: string
  subheading?: string
}

export function FeaturedWorks({ projects, heading, subheading }: FeaturedWorksProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  if (!projects || projects.length === 0) return null

  return (
    <section ref={sectionRef} className="relative px-4 md:px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {heading}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              isHoveredFromParent={hoveredIndex === index}
              onHoverChange={(isHovered) => setHoveredIndex(isHovered ? index : null)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
