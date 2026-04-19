"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, ExternalLink, Star } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import type { Project } from "@/lib/supabase"
import { ProjectForm } from "@/components/admin/project-form"
import type { ProjectFormValues } from "@/components/admin/project-form"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order", { ascending: true })

    if (error) {
      toast.error("Failed to load projects")
    } else {
      setProjects(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleAdd = () => {
    setSelectedProject(null)
    setFormOpen(true)
  }

  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setFormOpen(true)
  }

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project)
    setDeleteOpen(true)
  }

  const handleFormSubmit = async (values: ProjectFormValues) => {
    setFormLoading(true)
    try {
      if (selectedProject) {
        const { error } = await supabase
          .from("projects")
          .update({ ...values, updated_at: new Date().toISOString() })
          .eq("id", selectedProject.id)

        if (error) throw error
        toast.success("Project updated successfully")
      } else {
        const { error } = await supabase.from("projects").insert([values])
        if (error) throw error
        toast.success("Project added successfully")
      }

      setFormOpen(false)
      await fetchProjects()
    } catch {
      toast.error("Failed to save project. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProject) return
    setDeleteLoading(true)
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", selectedProject.id)

      if (error) throw error
      toast.success("Project deleted")
      setDeleteOpen(false)
      await fetchProjects()
    } catch {
      toast.error("Failed to delete project")
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleToggleFeatured = async (project: Project) => {
    const { error } = await supabase
      .from("projects")
      .update({ featured: !project.featured, updated_at: new Date().toISOString() })
      .eq("id", project.id)

    if (error) {
      toast.error("Failed to update featured status")
    } else {
      toast.success(`${project.featured ? "Removed from" : "Added to"} featured`)
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, featured: !p.featured } : p))
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your portfolio projects.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            All Projects{" "}
            {!loading && (
              <Badge variant="secondary" className="ml-2">
                {projects.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Toggle featured to show/hide projects on the public homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6">#</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-28 text-center">
                  <span className="flex items-center justify-center gap-1">
                    <Star className="h-3.5 w-3.5" /> Featured
                  </span>
                </TableHead>
                <TableHead className="w-32 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6">
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="mx-auto h-5 w-9 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    No projects yet. Click &quot;Add Project&quot; to create one.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="pl-6 text-muted-foreground text-sm">
                      {project.order}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-10 w-10 rounded-md object-cover ring-1 ring-border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/40x40/1a1a1a/666?text=?"
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm">{project.title}</p>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={project.featured}
                        onCheckedChange={() => handleToggleFeatured(project)}
                        aria-label="Toggle featured"
                      />
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(project)}
                          aria-label="Edit project"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteClick(project)}
                          aria-label="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProjectForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        project={selectedProject}
        loading={formLoading}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Project"
        description={`Are you sure you want to delete "${selectedProject?.title}"? This cannot be undone.`}
      />
    </div>
  )
}
