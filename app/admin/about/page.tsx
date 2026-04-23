"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Info, FileText } from "lucide-react"
import { FileUploader } from "@/components/admin/file-uploader"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { ImageUploader } from "@/components/admin/image-uploader"
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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const aboutSchema = z.object({
  hero_subtitle: z.string().optional(),
  philosophy_heading: z.string().min(1, "Required"),
  philosophy_text_1: z.string().min(1, "Required"),
  philosophy_text_2: z.string().min(1, "Required"),
  philosophy_text_3: z.string().min(1, "Required"),
  stat_1_label: z.string().optional(),
  stat_1_value: z.string().optional(),
  stat_2_label: z.string().optional(),
  stat_2_value: z.string().optional(),
  stat_3_label: z.string().optional(),
  stat_3_value: z.string().optional(),
  stat_4_label: z.string().optional(),
  stat_4_value: z.string().optional(),
  services: z.string().min(1, "Required"),
  location: z.string().optional(),
  founded: z.string().optional(),
  team_size: z.string().optional(),
  resume_url: z.string().optional(),
})

type AboutFormValues = z.infer<typeof aboutSchema>

export default function AdminAboutPage() {
  const [rowId, setRowId] = useState<string | null>(null)
  const [heroRowId, setHeroRowId] = useState<string | null>(null)
  const [aboutImage, setAboutImage] = useState("")
  const [resumeUrl, setResumeUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      hero_subtitle: "",
      philosophy_heading: "",
      philosophy_text_1: "",
      philosophy_text_2: "",
      philosophy_text_3: "",
      stat_1_label: "",
      stat_1_value: "",
      stat_2_label: "",
      stat_2_value: "",
      stat_3_label: "",
      stat_3_value: "",
      stat_4_label: "",
      stat_4_value: "",
      services: "",
      location: "",
      founded: "",
      team_size: "",
      resume_url: "",
    },
  })

  useEffect(() => {
    const fetch = async () => {
      // Fetch about content text
      const { data, error } = await supabase.from("about_content").select("*").single()
      if (error) {
        toast.error("Failed to load About content")
      } else if (data) {
        setRowId(data.id)
        form.reset({
          hero_subtitle: data.hero_subtitle,
          philosophy_heading: data.philosophy_heading,
          philosophy_text_1: data.philosophy_text_1,
          philosophy_text_2: data.philosophy_text_2,
          philosophy_text_3: data.philosophy_text_3,
          stat_1_label: data.stat_1_label,
          stat_1_value: data.stat_1_value,
          stat_2_label: data.stat_2_label,
          stat_2_value: data.stat_2_value,
          stat_3_label: data.stat_3_label,
          stat_3_value: data.stat_3_value,
          stat_4_label: data.stat_4_label,
          stat_4_value: data.stat_4_value,
          services: data.services,
          location: data.location,
          founded: data.founded,
          team_size: data.team_size,
          resume_url: data.resume_url ?? "",
        })
        setResumeUrl(data.resume_url ?? "")
      }

      // Fetch about image from hero_content
      const { data: heroData } = await supabase
        .from("hero_content")
        .select("id, about_image")
        .single()
      if (heroData) {
        setHeroRowId(heroData.id)
        setAboutImage(heroData.about_image ?? "")
      }

      setLoading(false)
    }
    fetch()
  }, [form])

  const onSubmit = async (values: AboutFormValues) => {
    if (!rowId) return

    setSaving(true)
    const { error: textError } = await supabase
      .from("about_content")
      .update({ ...values, resume_url: resumeUrl, updated_at: new Date().toISOString() })
      .eq("id", rowId)

    if (heroRowId && aboutImage) {
      await supabase
        .from("hero_content")
        .update({ about_image: aboutImage, updated_at: new Date().toISOString() })
        .eq("id", heroRowId)
    }

    if (textError) {
      toast.error("Failed to save. Please try again.")
    } else {
      // toast.success("Auto-saved! 🎉") // Muted to prevent spam
    }
    setSaving(false)
  }

  // Auto-save effect
  useEffect(() => {
    const subscription = form.watch(() => {
      // Debounce auto-save
      const timer = setTimeout(() => {
        if (rowId) {
          form.handleSubmit(onSubmit)()
        }
      }, 1500)
      return () => clearTimeout(timer)
    })
    return () => subscription.unsubscribe()
  }, [form, rowId, aboutImage, heroRowId])

  const textareaClass = "min-h-[90px] resize-none"

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="space-y-4 pt-6">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">About Page</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit all text content displayed on the public About page.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
          <Info className="h-5 w-5 text-blue-500" />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* Header Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Header Image</CardTitle>
              <CardDescription>
                The large wide image displayed at the top of the About page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={aboutImage}
                onChange={async (url) => {
                  setAboutImage(url)
                  if (heroRowId && url) {
                    await supabase
                      .from("hero_content")
                      .update({ about_image: url, updated_at: new Date().toISOString() })
                      .eq("id", heroRowId)
                    toast.success("Header image applied instantly! 🎉")
                  }
                }}
                bucket="images"
                folder="pages"
              />
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Main Content ("Behind the Work")</CardTitle>
              <CardDescription>The main heading and introductory paragraphs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="philosophy_heading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Heading</FormLabel>
                    <FormControl>
                      <Input placeholder="BEHIND THE WORK" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(["philosophy_text_1", "philosophy_text_2", "philosophy_text_3"] as const).map(
                (name, i) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Paragraph {i + 1}</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}
            </CardContent>
          </Card>

          {/* Approach */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Approach Section</CardTitle>
              <CardDescription>Three paragraphs and a highlight element for the approach section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approach Paragraph 1</FormLabel>
                    <FormControl>
                      <Textarea className={textareaClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="founded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approach Paragraph 2</FormLabel>
                    <FormControl>
                      <Textarea className={textareaClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="team_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approach Paragraph 3</FormLabel>
                    <FormControl>
                      <Textarea className={textareaClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-3 rounded-lg border border-border p-4 col-span-1 md:col-span-2">
                  <p className="font-medium text-sm mb-2">Highlight Element</p>
                  <FormField
                    control={form.control}
                    name="stat_1_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highlight Text</FormLabel>
                        <FormControl>
                          <Input placeholder="4+ Years Experience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Service & Expertise</CardTitle>
              <CardDescription>
                List your services. One per line.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="services"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services List</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[140px] resize-none font-mono text-sm"
                        placeholder={"Visual Identity\nCreative Direction\nLogo Design"}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Each line will appear as an item in the service list.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Resume */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Resume / CV
              </CardTitle>
              <CardDescription>
                Upload your PDF resume or paste a public link. A &quot;View PDF&quot; button will appear on the public About page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader
                value={resumeUrl}
                onChange={async (url) => {
                  setResumeUrl(url)
                  if (rowId) {
                    await supabase
                      .from("about_content")
                      .update({ resume_url: url, updated_at: new Date().toISOString() })
                      .eq("id", rowId)
                    toast.success(url ? "Resume saved!" : "Resume removed")
                  }
                }}
                bucket="images"
                folder="documents"
                accept="application/pdf"
                label="Resume"
              />
            </CardContent>
          </Card>

          <div className="flex justify-end items-center gap-4">
            {saving && <span className="text-sm text-muted-foreground animate-pulse">Saving changes...</span>}
            <Button type="submit" disabled={saving} className="gap-2 px-6">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
