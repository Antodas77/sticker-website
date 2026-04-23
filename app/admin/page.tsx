"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FolderOpen, MessageSquare, Zap, ArrowRight, TrendingUp, Mail, Image as ImageIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Stats {
  projects: number
  featuredProjects: number
  testimonials: number
  featuredTestimonials: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: projects },
        { count: featuredProjects },
        { count: testimonials },
        { count: featuredTestimonials },
      ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("featured", true),
        supabase.from("testimonials").select("*", { count: "exact", head: true }),
        supabase.from("testimonials").select("*", { count: "exact", head: true }).eq("featured", true),
      ])

      setStats({
        projects: projects ?? 0,
        featuredProjects: featuredProjects ?? 0,
        testimonials: testimonials ?? 0,
        featuredTestimonials: featuredTestimonials ?? 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Projects",
      icon: FolderOpen,
      href: "/admin/projects",
      value: stats?.projects,
      sub: `${stats?.featuredProjects ?? 0} featured`,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Testimonials",
      icon: MessageSquare,
      href: "/admin/testimonials",
      value: stats?.testimonials,
      sub: `${stats?.featuredTestimonials ?? 0} featured`,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Hero Section",
      icon: Zap,
      href: "/admin/hero",
      value: "1",
      sub: "Always up to date",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back! Here&apos;s an overview of your website content.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">{card.value}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Manage Projects",
            description: "Add, edit, or remove projects from your portfolio.",
            href: "/admin/projects",
            icon: FolderOpen,
          },
          {
            title: "Manage Testimonials",
            description: "Update client reviews and control which ones are featured.",
            href: "/admin/testimonials",
            icon: MessageSquare,
          },
          {
            title: "Edit Hero Section",
            description: "Update the headline, CTA buttons and badge text.",
            href: "/admin/hero",
            icon: Zap,
          },
          {
            title: "Customize Footer",
            description: "Edit studio name, bio, email, location and social links.",
            href: "/admin/footer",
            icon: Mail,
          },
          {
            title: "Customize Craft Studio",
            description: "Update the craft studio section image/gif and description.",
            href: "/admin/craft-studio",
            icon: ImageIcon,
          },
        ].map((action) => (
          <Card key={action.href} className="group hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2">
                <action.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">{action.title}</CardTitle>
              </div>
              <CardDescription className="text-sm">{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href={action.href}>
                  Open
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tip */}
      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 pt-6">
          <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Live sync</p>
            <p className="text-sm text-muted-foreground">
              All changes you make here reflect instantly on the public website — no rebuilds required.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
