"use client"

import Image from "next/image"

export interface TestimonialData {
  name: string
  role: string
  content: string
  avatar: string
}

// Default testimonials for when Sanity data is not available
const defaultTestimonials: TestimonialData[] = [
  {
    name: "Sarah Chen",
    role: "CEO at TechFlow",
    content: "Absolutely incredible work. They transformed our vision into a product that exceeded all expectations. The attention to detail was remarkable throughout the entire process.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Marcus Johnson",
    role: "Founder at Innovate AI",
    content: "The attention to detail and creative solutions blew us away. Their team understood our complex requirements and delivered a stunning result on time.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Emily Rodriguez",
    role: "CTO at DataPrime",
    content: "Professional, creative, and delivered on time. The best team we have ever worked with. They brought fresh perspectives that elevated our entire brand.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "David Kim",
    role: "Director at CloudScale",
    content: "They do not just build products, they craft experiences. Outstanding results that have significantly improved our user engagement and conversion rates.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Lisa Thompson",
    role: "VP Product at Nexus",
    content: "From concept to launch, every interaction was seamless. A true pleasure to work with. Their collaborative approach made the entire project enjoyable.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "James Wilson",
    role: "CEO at StartupX",
    content: "The team understood our needs perfectly and delivered beyond expectations. Their strategic thinking added immense value to our product direction.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Anna Martinez",
    role: "Design Lead at Pixel",
    content: "Working with this team was a breath of fresh air. They brought creativity and precision in equal measure. Our rebrand exceeded every benchmark we set.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Robert Chang",
    role: "Founder at Quantum",
    content: "Exceptional quality and communication throughout the project. They turned our ambitious vision into reality with remarkable efficiency and skill.",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
  },
]

function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
  return (
    <div className="flex-shrink-0 w-[420px] md:w-[500px] p-8 md:p-10 bg-card border border-border/40 rounded-[2rem] mx-4 hover:border-foreground/20 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
      {/* Highlighted Quote area */}
      <div className="relative mb-10">
        <span className="absolute -top-4 -left-2 text-6xl text-foreground/10 select-none">"</span>
        <blockquote className="relative z-10 text-xl md:text-2xl font-serif italic text-foreground tracking-tight leading-snug">
          {testimonial.content}
        </blockquote>
      </div>

      <div className="flex items-center gap-4 mt-auto">
        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="font-semibold text-foreground text-lg tracking-tight leading-none mb-1.5">
            {testimonial.name}
          </p>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  )
}

interface TestimonialsProps {
  testimonials?: TestimonialData[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const testimonialsToShow = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials
  
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance tracking-tight">
            Wall of Love
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-normal">
            Hear from the people who trust us with their vision.
          </p>
        </div>
      </div>
      
      {/* Single row marquee with pause on hover */}
      <div className="group">
        <div className="relative">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
            {[...testimonialsToShow, ...testimonialsToShow].map((testimonial, index) => (
              <TestimonialCard key={`testimonial-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
