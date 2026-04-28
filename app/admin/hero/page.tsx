"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Zap } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
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
import { ImageUploader } from "@/components/admin/image-uploader"
import { MediaUploader } from "@/components/admin/media-uploader"

interface HeroContent {
  id: string
  heading: string
  heading_highlight: string
  subheading: string
  badge_text: string
  cta_primary: string
  cta_primary_link: string
  cta_secondary: string
  cta_secondary_link: string
  about_image: string | null
  hero_bg_type: 'none' | 'image' | 'gif' | 'video'
  hero_bg_url: string | null
}

const heroSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  heading_highlight: z.string().min(1, "Heading highlight is required"),
  subheading: z.string().min(1, "Subheading is required"),
  badge_text: z.string().min(1, "Badge text is required"),
  cta_primary: z.string().min(1, "Primary CTA label is required"),
  cta_primary_link: z.string().min(1, "Primary CTA link is required"),
  cta_secondary: z.string().min(1, "Secondary CTA label is required"),
  cta_secondary_link: z.string().min(1, "Secondary CTA link is required"),
})

type HeroFormValues = z.infer<typeof heroSchema>

export default function HeroPage() {
  const [heroId, setHeroId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [bgType, setBgType] = useState<'none' | 'image' | 'gif' | 'video'>('none')
  const [bgUrl, setBgUrl] = useState<string>('')

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      heading: "",
      heading_highlight: "",
      subheading: "",
      badge_text: "",
      cta_primary: "",
      cta_primary_link: "",
      cta_secondary: "",
      cta_secondary_link: "",
    },
  })

  useEffect(() => {
    const fetchHero = async () => {
      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .single()

      if (error) {
        toast.error("Failed to load hero content")
      } else if (data) {
        const hero = data as HeroContent
        setHeroId(hero.id)
        setBgType(hero.hero_bg_type ?? 'none')
        setBgUrl(hero.hero_bg_url ?? '')
        form.reset({
          heading: hero.heading,
          heading_highlight: hero.heading_highlight,
          subheading: hero.subheading,
          badge_text: hero.badge_text,
          cta_primary: hero.cta_primary,
          cta_primary_link: hero.cta_primary_link,
          cta_secondary: hero.cta_secondary,
          cta_secondary_link: hero.cta_secondary_link,
        })
      }
      setLoading(false)
    }

    fetchHero()
  }, [form])

  const onSubmit = async (values: HeroFormValues) => {
    if (!heroId) return
    setSaving(true)

    const { error } = await supabase
      .from("hero_content")
      .update({
        ...values,
        hero_bg_type: bgType,
        hero_bg_url: bgUrl.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", heroId)

    if (error) {
      toast.error("Failed to save. Please try again.")
    } else {
      toast.success("Hero section updated successfully! 🎉")
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hero Section</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit the headline and call-to-action buttons on your homepage.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <Zap className="h-5 w-5 text-amber-500" />
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="space-y-5 pt-6">
            {Array.from({ length: 6 }).map((_, i) => (
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
            {/* Headline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Headline</CardTitle>
                <CardDescription>
                  The main headline displayed on the homepage. Split into a regular part and a highlighted part.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="heading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heading</FormLabel>
                      <FormControl>
                        <Input placeholder="Build Products" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heading_highlight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heading Highlight</FormLabel>
                      <FormControl>
                        <Input placeholder="That Inspire" {...field} />
                      </FormControl>
                      <FormDescription>
                        This part is styled differently (e.g. gradient or accent).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subheading"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Subheading</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief description of what you do..."
                          className="min-h-[80px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="badge_text"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Badge Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Now accepting new projects" {...field} />
                      </FormControl>
                      <FormDescription>
                        Small badge shown above the headline (e.g. &ldquo;Now accepting new projects&rdquo;).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* CTAs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Call-to-Action Buttons</CardTitle>
                <CardDescription>
                  The two buttons shown in the hero section.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cta_primary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Button Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Work with me" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cta_primary_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Button Link</FormLabel>
                      <FormControl>
                        <Input placeholder="#footer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cta_secondary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Button Label</FormLabel>
                      <FormControl>
                        <Input placeholder="View Projects" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cta_secondary_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Button Link</FormLabel>
                      <FormControl>
                        <Input placeholder="/works" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Background Media */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Background Media</CardTitle>
                <CardDescription>
                  Optional full-screen background behind the hero text. Choose a type then paste a public URL.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type selector */}
                <div className="flex flex-wrap gap-2">
                  {(['none', 'image', 'gif', 'video'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBgType(t)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        bgType === t
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t === 'none' ? 'None' : t === 'image' ? 'Image' : t === 'gif' ? 'GIF' : 'Video'}
                    </button>
                  ))}
                </div>

                {bgType !== 'none' && (
                  <div className="space-y-4">
                    {/* Drag-and-drop uploader */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {bgType === 'video' ? 'Upload Video' : bgType === 'gif' ? 'Upload GIF' : 'Upload Image'}
                      </label>
                      <MediaUploader
                        value={bgUrl}
                        onChange={setBgUrl}
                        mediaType={bgType}
                        bucket="images"
                        folder="hero-bg"
                      />
                    </div>

                    {/* OR: paste a URL */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">or paste a URL</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <input
                      type="url"
                      value={bgUrl}
                      onChange={(e) => setBgUrl(e.target.value)}
                      placeholder={bgType === 'video' ? 'https://…/bg.mp4' : 'https://…/bg.jpg'}
                      className="w-full bg-transparent border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">
                      Upload a file above or paste a public URL. Videos: MP4/WebM up to 100 MB.
                    </p>
                  </div>
                )}
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
