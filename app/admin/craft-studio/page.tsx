"use client"

import { useEffect, useState } from "react"
import { getCraftStudioSettings, updateCraftStudioSettings, CraftStudioSettings } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function CraftStudioAdminPage() {
  const [settings, setSettings] = useState<CraftStudioSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getCraftStudioSettings()
      setSettings(data)
      if (data?.image_url) {
        setImagePreview(data.image_url)
        setImageUrl(data.image_url)
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleInputChange = (field: keyof CraftStudioSettings, value: string) => {
    if (settings) {
      setSettings({
        ...settings,
        [field]: value,
      })
    }
  }

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    setImagePreview(url)
    if (settings) {
      setSettings({
        ...settings,
        image_url: url,
      })
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      await updateCraftStudioSettings({
        image_url: imageUrl,
        title: settings.title,
        description: settings.description,
      })
      alert("Craft Studio settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-10">Loading...</div>
  }

  if (!settings) {
    return <div>No craft studio settings found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customize Craft Studio Section</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update the image/gif and description for the craft studio section on the landing page.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Image Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How it appears on the landing page</CardDescription>
          </CardHeader>
          <CardContent>
            {imagePreview && (
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                <img src={imagePreview} alt="Craft Studio preview" className="w-full h-full object-cover" />
              </div>
            )}
            {!imagePreview && (
              <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No image yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Edit craft studio section details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Craft Studio"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={settings.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter craft studio description"
                rows={4}
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Paste the URL of your image or GIF. Supports JPEG, PNG, GIF, WebP formats.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" asChild>
          <Link href="/admin">Cancel</Link>
        </Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}
