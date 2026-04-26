"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { FooterSettings } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft, Loader2, Layout } from "lucide-react"
import { toast } from "sonner"

const FALLBACK: FooterSettings = {
  id: "",
  heading: "Say hello.",
  description: "We are a design-driven studio focused on creating meaningful digital experiences. Our work spans brand identity, web design, and interactive products that connect with people on a deeper level.",
  email: "hello@craftstudio.com",
  location: "San Francisco, California",
  instagram_url: "https://instagram.com",
  linkedin_url: "https://linkedin.com",
  youtube_url: "https://youtube.com",
  substack_url: "https://substack.com",
  copyright_text: "© 2026 Craft Studio. All rights reserved.",
  created_at: "",
  updated_at: "",
}

export default function FooterAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rowId, setRowId] = useState<string | null>(null)

  const [heading, setHeading] = useState(FALLBACK.heading)
  const [description, setDescription] = useState(FALLBACK.description)
  const [email, setEmail] = useState(FALLBACK.email)
  const [location, setLocation] = useState(FALLBACK.location)
  const [instagramUrl, setInstagramUrl] = useState(FALLBACK.instagram_url || "")
  const [linkedinUrl, setLinkedinUrl] = useState(FALLBACK.linkedin_url || "")
  const [youtubeUrl, setYoutubeUrl] = useState(FALLBACK.youtube_url || "")
  const [substackUrl, setSubstackUrl] = useState(FALLBACK.substack_url || "")
  const [copyrightText, setCopyrightText] = useState(FALLBACK.copyright_text)

  useEffect(() => {
    supabase
      .from("footer_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const s = data[0] as FooterSettings
          setRowId(s.id)
          setHeading(s.heading)
          setDescription(s.description)
          setEmail(s.email)
          setLocation(s.location)
          setInstagramUrl(s.instagram_url || "")
          setLinkedinUrl(s.linkedin_url || "")
          setYoutubeUrl(s.youtube_url || "")
          setSubstackUrl(s.substack_url || "")
          setCopyrightText(s.copyright_text)
        }
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      ...(rowId ? { id: rowId } : {}),
      heading,
      description,
      email,
      location,
      instagram_url: instagramUrl || null,
      linkedin_url: linkedinUrl || null,
      youtube_url: youtubeUrl || null,
      substack_url: substackUrl || null,
      copyright_text: copyrightText,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from("footer_settings")
      .upsert(payload, { onConflict: "id" })

    const isRealError = !!(error?.message || error?.code)

    if (isRealError) {
      toast.error(`Failed to save: ${error?.message ?? error?.code ?? "unknown error"}`)
      console.error("[footer] save error — code:", error?.code, "message:", error?.message)
    } else {
      toast.success("Footer settings saved! Changes are live instantly.")
      if (!rowId) {
        const { data: fresh } = await supabase
          .from("footer_settings")
          .select("id")
          .order("created_at", { ascending: false })
          .limit(1)
        if (fresh && fresh.length > 0) setRowId(fresh[0].id)
      }
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-52" />
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Footer Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize the "Say hello" section at the bottom of all pages.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
          <Layout className="h-5 w-5 text-orange-500" />
        </div>
      </div>

      <div className="grid gap-6">
        {/* Main Text Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Main Content</CardTitle>
            <CardDescription>The primary text displayed in the footer area.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Say hello."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Bio / Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="We are a design-driven studio..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
            <CardDescription>Direct contact details and location.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@craftstudio.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, California"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Social Links</CardTitle>
            <CardDescription>URLs for the social icons. Leave blank to hide an icon.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input
                  id="youtube"
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="substack">Substack URL</Label>
                <Input
                  id="substack"
                  type="url"
                  value={substackUrl}
                  onChange={(e) => setSubstackUrl(e.target.value)}
                  placeholder="https://substack.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Bottom */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Footer Bottom</CardTitle>
            <CardDescription>The small copyright text at the very bottom.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="copyright">Copyright Text</Label>
              <Input
                id="copyright"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder="© 2026 Craft Studio. All rights reserved."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3 sticky bottom-6 z-10 p-4 bg-background/80 backdrop-blur-md rounded-xl border border-border shadow-sm">
        <Button variant="outline" asChild>
          <Link href="/admin">Cancel</Link>
        </Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-[130px]">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}
