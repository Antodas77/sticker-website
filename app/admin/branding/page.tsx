"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { GlobalBranding } from "@/lib/supabase"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft, Loader2, Layers, Image as ImageIcon, Type, Sparkles } from "lucide-react"
import { toast } from "sonner"

const BRAND_TYPES = [
  { value: "text", label: "Text (CS)", icon: Type, description: "Classic monogram square — the current look." },
  { value: "image", label: "Static Image", icon: ImageIcon, description: "A PNG or JPG logo inside the nav." },
  { value: "gif", label: "Animated GIF", icon: Sparkles, description: "A looping or hover-triggered GIF." },
] as const

type BrandType = "text" | "image" | "gif"

const FALLBACK: GlobalBranding = {
  id: "",
  brand_type: "text",
  media_url: null,
  static_poster_url: null,
  label_text: "Craft Studio",
  link_dest: "/",
  gif_loop: true,
  created_at: "",
  updated_at: "",
}

export default function BrandingAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rowId, setRowId] = useState<string | null>(null)
  const [brandType, setBrandType] = useState<BrandType>("text")
  const [mediaUrl, setMediaUrl] = useState("")
  const [staticPosterUrl, setStaticPosterUrl] = useState("")
  const [labelText, setLabelText] = useState("Craft Studio")
  const [linkDest, setLinkDest] = useState("/")
  const [gifLoop, setGifLoop] = useState(true)

  useEffect(() => {
    supabase
      .from("global_branding")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const b = data[0] as GlobalBranding
          setRowId(b.id)
          setBrandType(b.brand_type)
          setMediaUrl(b.media_url ?? "")
          setStaticPosterUrl(b.static_poster_url ?? "")
          setLabelText(b.label_text)
          setLinkDest(b.link_dest)
          setGifLoop(b.gif_loop)
        }
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      // Include id only when we already have one (upsert by id)
      ...(rowId ? { id: rowId } : {}),
      brand_type: brandType,
      media_url: mediaUrl || null,
      static_poster_url: staticPosterUrl || null,
      label_text: labelText,
      link_dest: linkDest || "/",
      gif_loop: gifLoop,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from("global_branding")
      .upsert(payload, { onConflict: "id" })

    // PostgrestError properties are non-enumerable (logs as {}) — check code/message explicitly
    const isRealError = !!(error?.message || error?.code)

    if (isRealError) {
      toast.error(`Failed to save: ${error?.message ?? error?.code ?? "unknown error"}`)
      console.error("[branding] save error — code:", error?.code, "message:", error?.message, "details:", error?.details)
    } else {
      toast.success("Global branding saved! Changes are live instantly.")
      // If this was a fresh insert, fetch the new id for future saves
      if (!rowId) {
        const { data: fresh } = await supabase
          .from("global_branding")
          .select("id")
          .single()
        if (fresh?.id) setRowId(fresh.id)
      }
    }
    setSaving(false)
  }

  // ── Live preview ───────────────────────────────────────
  const PreviewLogo = () => {
    const showMedia = (brandType === "image" || brandType === "gif") && mediaUrl
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border">
        <div className="w-8 h-8 rounded-sm overflow-hidden shrink-0 bg-foreground flex items-center justify-center">
          {brandType === "text" && (
            <span className="text-background font-bold text-xs">
              {labelText
                ? labelText
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                : "CS"}
            </span>
          )}
          {showMedia && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl} alt="preview" className="w-full h-full object-cover" />
          )}
          {(brandType === "image" || brandType === "gif") && !mediaUrl && (
            <span className="text-background/50 font-bold text-xs">?</span>
          )}
        </div>
        <span className="text-sm font-medium text-foreground">{labelText || "Craft Studio"}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-52" />
        {[1, 2].map((i) => (
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Global Branding</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Control the logo mark shown in the top-left navigation across all pages.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Layers className="h-5 w-5 text-emerald-500" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left: Controls (2/3 width) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Brand Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Brand Type</CardTitle>
              <CardDescription>Choose how the logo mark is displayed.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {BRAND_TYPES.map((bt) => (
                  <button
                    key={bt.value}
                    onClick={() => setBrandType(bt.value)}
                    className={`flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      brandType === bt.value
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    <bt.icon className={`h-5 w-5 ${brandType === bt.value ? "text-foreground" : "text-muted-foreground"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${brandType === bt.value ? "text-foreground" : "text-muted-foreground"}`}>
                        {bt.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{bt.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Media Upload — only for image / gif */}
          {(brandType === "image" || brandType === "gif") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {brandType === "gif" ? "Animated GIF" : "Logo Image"}
                </CardTitle>
                <CardDescription>
                  {brandType === "gif"
                    ? "Upload your GIF. It will be cropped to 32×32 and displayed in the nav."
                    : "Upload a PNG, JPG, or WebP. Displayed at 32×32 in the nav."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploader
                  value={mediaUrl}
                  onChange={(url) => setMediaUrl(url)}
                  bucket="images"
                  folder="branding"
                />

                {/* GIF-specific options */}
                {brandType === "gif" && (
                  <>
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">Always loop</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Off = GIF only plays when a visitor hovers over the logo.
                        </p>
                      </div>
                      <Switch checked={gifLoop} onCheckedChange={setGifLoop} />
                    </div>

                    {!gifLoop && (
                      <div className="space-y-2">
                        <Label htmlFor="static-poster">Static Poster URL (hover-off state)</Label>
                        <Input
                          id="static-poster"
                          value={staticPosterUrl}
                          onChange={(e) => setStaticPosterUrl(e.target.value)}
                          placeholder="https://… (first frame or thumbnail)"
                        />
                        <p className="text-xs text-muted-foreground">
                          When the visitor is not hovering, this image is shown instead of the GIF.
                          Leave blank to always show the animated GIF.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Label & Link */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Label & Link</CardTitle>
              <CardDescription>Text shown on hover and where the logo links to.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label-text">Label Text</Label>
                <Input
                  id="label-text"
                  value={labelText}
                  onChange={(e) => setLabelText(e.target.value)}
                  placeholder="Craft Studio"
                />
                <p className="text-xs text-muted-foreground">
                  Appears beside the logo mark on hover.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-dest">Link Destination</Label>
                <Input
                  id="link-dest"
                  value={linkDest}
                  onChange={(e) => setLinkDest(e.target.value)}
                  placeholder="/"
                />
                <p className="text-xs text-muted-foreground">
                  Internal path (e.g. <code className="font-mono">/</code>) or full URL.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Live Preview (1/3 width) ── */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base">Live Preview</CardTitle>
              <CardDescription>How the logo looks in the nav.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dark nav simulation */}
              <div className="rounded-xl bg-[#0a0a0a] border border-white/10 px-4 py-3 flex items-center justify-between">
                <PreviewLogo />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[14px] bg-white/10" />
                  <div className="w-8 h-8 rounded-[14px] bg-white/80" />
                </div>
              </div>
              {/* Light nav simulation */}
              <div className="rounded-xl bg-white border border-black/10 px-4 py-3 flex items-center justify-between">
                <PreviewLogo />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[14px] bg-black/10" />
                  <div className="w-8 h-8 rounded-[14px] bg-black/80" />
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground leading-relaxed">
                <strong>Note:</strong> The hover label fades in on the public site when a visitor moves
                their cursor over the logo mark.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3">
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
            "Save & Go Live"
          )}
        </Button>
      </div>
    </div>
  )
}
