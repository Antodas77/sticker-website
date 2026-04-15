import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A modern shopping experience with seamless checkout, real-time inventory, and personalized recommendations.",
    tags: ["Next.js", "Stripe", "Tailwind"],
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "AI Dashboard",
    description: "Analytics dashboard with AI-powered insights, beautiful visualizations, and intuitive navigation.",
    tags: ["React", "TypeScript", "AI SDK"],
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
]

export function ProjectCards() {
  return (
    <section className="px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our latest work and see how we transform ideas into exceptional digital products.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <article
              key={index}
              className="group relative bg-card border border-border rounded-3xl p-8 md:p-10 overflow-hidden transition-all duration-300 hover:border-muted-foreground/30 hover:shadow-2xl hover:shadow-black/20"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                
                {/* Preview placeholder */}
                <div className="mt-8 aspect-video rounded-2xl bg-secondary/50 border border-border flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                    <div className="w-6 h-6 rounded bg-foreground/20" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
