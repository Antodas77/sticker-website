"use client"

import Image from "next/image"

export interface TestimonialData {
  name: string
  role: string
  content: string
  avatar: string
}


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
        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-xl font-semibold text-muted-foreground uppercase">
              {testimonial.name?.charAt(0) || "?"}
            </span>
          )}
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
  if (!testimonials || testimonials.length === 0) return null
  
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
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <TestimonialCard key={`testimonial-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
