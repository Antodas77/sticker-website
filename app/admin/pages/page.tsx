"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, FileText } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import type { PageContent } from "@/lib/supabase"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const schema = z.object({
  featured_works_heading: z.string(),
  featured_works_subheading: z.string(),
  works_page_heading: z.string(),
  works_page_subheading: z.string(),
})

type FormValues = z.infer<typeof schema>

export default function PageContentAdminPage() {
  const [pageId, setPageId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      featured_works_heading: "",
      featured_works_subheading: "",
      works_page_heading: "",
      works_page_subheading: "",
    },
  })

  useEffect(() => {
    supabase
      .from("page_content")
      .select("*")
      .single()
      .then(({ data, error }) => {
        if (error) {
          toast.error("Failed to load page content")
        } else if (data) {
          const pc = data as PageContent
          setPageId(pc.id)
          form.reset({
            featured_works_heading: pc.featured_works_heading,
            featured_works_subheading: pc.featured_works_subheading,
            works_page_heading: pc.works_page_heading,
            works_page_subheading: pc.works_page_subheading,
          })
        }
        setLoading(false)
      })
  }, [form])

  const onSubmit = async (values: FormValues) => {
    if (!pageId) return
    setSaving(true)
    const { error } = await supabase
      .from("page_content")
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq("id", pageId)

    if (error) {
      toast.error("Failed to save. Please try again.")
    } else {
      toast.success("Page content updated successfully! 🎉")
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Page Content</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit the headings and descriptions on the Home and Works pages.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10">
          <FileText className="h-5 w-5 text-sky-500" />
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="space-y-5 pt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Home Page — Featured Works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Home Page — Featured Works</CardTitle>
                <CardDescription>
                  The section heading and description shown below the hero on the homepage.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="featured_works_heading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heading</FormLabel>
                      <FormControl>
                        <Input placeholder="Featured Works" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featured_works_subheading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subheading</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Selected projects showcasing our expertise..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Short description displayed below the heading.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Works Page */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Works Page</CardTitle>
                <CardDescription>
                  The main heading and description at the top of /works.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="works_page_heading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heading</FormLabel>
                      <FormControl>
                        <Input placeholder="Selected Works" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="works_page_subheading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subheading</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="A curated collection of projects..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Short description displayed below the heading.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="gap-2 px-6">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
