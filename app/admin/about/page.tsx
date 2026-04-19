"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Info } from "lucide-react"
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
  hero_subtitle: z.string().min(1, "Required"),
  philosophy_heading: z.string().min(1, "Required"),
  philosophy_text_1: z.string().min(1, "Required"),
  philosophy_text_2: z.string().min(1, "Required"),
  philosophy_text_3: z.string().min(1, "Required"),
  stat_1_label: z.string().min(1, "Required"),
  stat_1_value: z.string().min(1, "Required"),
  stat_2_label: z.string().min(1, "Required"),
  stat_2_value: z.string().min(1, "Required"),
  stat_3_label: z.string().min(1, "Required"),
  stat_3_value: z.string().min(1, "Required"),
  stat_4_label: z.string().min(1, "Required"),
  stat_4_value: z.string().min(1, "Required"),
  services: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  founded: z.string().min(1, "Required"),
  team_size: z.string().min(1, "Required"),
})

type AboutFormValues = z.infer<typeof aboutSchema>

export default function AdminAboutPage() {
  const [rowId, setRowId] = useState<string | null>(null)
  const [heroRowId, setHeroRowId] = useState<string | null>(null)
  const [aboutImage, setAboutImage] = useState("")
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
        })
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
      .update({ ...values, updated_at: new Date().toISOString() })
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

          {/* Hero */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hero</CardTitle>
              <CardDescription>The tagline shown under the "About" heading.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="hero_subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Crafting digital experiences that resonate." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Philosophy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Philosophy Section</CardTitle>
              <CardDescription>The left-column text block on the About page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="philosophy_heading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heading</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                        <FormLabel>Paragraph {i + 1}</FormLabel>
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

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stats</CardTitle>
              <CardDescription>The 4 highlight numbers shown on the right side.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {([
                ["stat_1_value", "stat_1_label"],
                ["stat_2_value", "stat_2_label"],
                ["stat_3_value", "stat_3_label"],
                ["stat_4_value", "stat_4_label"],
              ] as const).map(([valueKey, labelKey], i) => (
                <div key={i} className="space-y-3 rounded-lg border border-border p-4">
                  <FormField
                    control={form.control}
                    name={valueKey}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input placeholder="8+" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={labelKey}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input placeholder="Years Experience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Services & Expertise</CardTitle>
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
                        placeholder={"Brand Identity & Strategy\nUI/UX Design\nWeb Development"}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Each line will appear as a separate service card.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Studio Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Studio Info</CardTitle>
              <CardDescription>Displayed in the footer strip at the bottom of the About page.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="San Francisco, CA" {...field} />
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
                    <FormLabel>Founded</FormLabel>
                    <FormControl>
                      <Input placeholder="2018" {...field} />
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
                    <FormLabel>Team Size</FormLabel>
                    <FormControl>
                      <Input placeholder="12 Creatives" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
