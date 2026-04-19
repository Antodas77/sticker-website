"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Star, Quote } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import type { Testimonial } from "@/lib/supabase"
import { TestimonialForm } from "@/components/admin/testimonial-form"
import type { TestimonialFormValues } from "@/components/admin/testimonial-form"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Testimonial | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("order", { ascending: true })

    if (error) {
      toast.error("Failed to load testimonials")
    } else {
      setTestimonials(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleAdd = () => {
    setSelected(null)
    setFormOpen(true)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setSelected(testimonial)
    setFormOpen(true)
  }

  const handleDeleteClick = (testimonial: Testimonial) => {
    setSelected(testimonial)
    setDeleteOpen(true)
  }

  const handleFormSubmit = async (values: TestimonialFormValues) => {
    setFormLoading(true)
    try {
      const payload = {
        ...values,
        image: values.image || null,
        updated_at: new Date().toISOString(),
      }

      if (selected) {
        const { error } = await supabase
          .from("testimonials")
          .update(payload)
          .eq("id", selected.id)

        if (error) throw error
        toast.success("Testimonial updated successfully")
      } else {
        const { error } = await supabase.from("testimonials").insert([payload])
        if (error) throw error
        toast.success("Testimonial added successfully")
      }

      setFormOpen(false)
      await fetchTestimonials()
    } catch {
      toast.error("Failed to save testimonial. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    setDeleteLoading(true)
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", selected.id)

      if (error) throw error
      toast.success("Testimonial deleted")
      setDeleteOpen(false)
      await fetchTestimonials()
    } catch {
      toast.error("Failed to delete testimonial")
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleToggleFeatured = async (t: Testimonial) => {
    const { error } = await supabase
      .from("testimonials")
      .update({ featured: !t.featured, updated_at: new Date().toISOString() })
      .eq("id", t.id)

    if (error) {
      toast.error("Failed to update featured status")
    } else {
      toast.success(`${t.featured ? "Removed from" : "Added to"} featured`)
      setTestimonials((prev) =>
        prev.map((item) =>
          item.id === t.id ? { ...item, featured: !item.featured } : item
        )
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Testimonials</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage client reviews and social proof.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            All Testimonials{" "}
            {!loading && (
              <Badge variant="secondary" className="ml-2">
                {testimonials.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Toggle featured to control which reviews appear on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6">#</TableHead>
                <TableHead>Person</TableHead>
                <TableHead>Quote</TableHead>
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
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6">
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="mx-auto h-5 w-9 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : testimonials.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No testimonials yet. Click &quot;Add Testimonial&quot; to create one.
                  </TableCell>
                </TableRow>
              ) : (
                testimonials.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="pl-6 text-muted-foreground text-sm">
                      {t.order}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={t.image ?? undefined} alt={t.name} />
                          <AvatarFallback className="text-xs">
                            {t.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="flex items-start gap-1 text-sm text-muted-foreground line-clamp-2">
                        <Quote className="mt-0.5 h-3 w-3 shrink-0 opacity-50" />
                        {t.quote}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={t.featured}
                        onCheckedChange={() => handleToggleFeatured(t)}
                        aria-label="Toggle featured"
                      />
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(t)}
                          aria-label="Edit testimonial"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteClick(t)}
                          aria-label="Delete testimonial"
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

      <TestimonialForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        testimonial={selected}
        loading={formLoading}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Testimonial"
        description={`Are you sure you want to delete the testimonial from "${selected?.name}"? This cannot be undone.`}
      />
    </div>
  )
}
