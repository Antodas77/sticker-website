"use client"

import { useEffect, useState } from "react"
import { getFooterSettings, updateFooterSettings, FooterSettings } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"

export default function FooterAdminPage() {
  const [settings, setSettings] = useState<FooterSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getFooterSettings()
      setSettings(data)
      if (data?.studio_logo_url) {
        setLogoPreview(data.studio_logo_url)
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field: keyof FooterSettings, value: string) => {
    if (settings) {
      setSettings({
        ...settings,
        [field]: value,
      })
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      // For now, save logo URL as is. In production, you'd upload to cloud storage
      await updateFooterSettings({
        studio_name: settings.studio_name,
        studio_bio: settings.studio_bio,
        studio_email: settings.studio_email,
        studio_location: settings.studio_location,
        studio_logo_url: logoPreview,
        linkedin_url: settings.linkedin_url,
        twitter_url: settings.twitter_url,
        instagram_url: settings.instagram_url,
        github_url: settings.github_url,
      })
      alert("Footer settings saved successfully!")
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
    return <div>No footer settings found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customize Footer</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit the Craft Studio section in the footer including name, bio, and social links.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Studio Information</CardTitle>
            <CardDescription>Update your studio details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Studio Name */}
            <div className="space-y-2">
              <Label htmlFor="studio-name">Studio Name</Label>
              <Input
                id="studio-name"
                value={settings.studio_name}
                onChange={(e) => handleInputChange("studio_name", e.target.value)}
                placeholder="Craft Studio"
              />
            </div>

            {/* Studio Bio */}
            <div className="space-y-2">
              <Label htmlFor="studio-bio">Bio / Description</Label>
              <Textarea
                id="studio-bio"
                value={settings.studio_bio}
                onChange={(e) => handleInputChange("studio_bio", e.target.value)}
                placeholder="Enter your studio bio"
                rows={4}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="studio-email">Email</Label>
              <Input
                id="studio-email"
                type="email"
                value={settings.studio_email}
                onChange={(e) => handleInputChange("studio_email", e.target.value)}
                placeholder="hello@craftstudio.com"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="studio-location">Location</Label>
              <Input
                id="studio-location"
                value={settings.studio_location}
                onChange={(e) => handleInputChange("studio_location", e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Logo / Avatar</Label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <img src={logoPreview} alt="Logo preview" className="w-12 h-12 rounded object-cover" />
                )}
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoSelect}
                  className="text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground">Upload an image or paste a URL</p>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Add your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={settings.linkedin_url}
                onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            {/* Twitter */}
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X URL</Label>
              <Input
                id="twitter"
                value={settings.twitter_url}
                onChange={(e) => handleInputChange("twitter_url", e.target.value)}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                value={settings.instagram_url}
                onChange={(e) => handleInputChange("instagram_url", e.target.value)}
                placeholder="https://instagram.com/yourhandle"
              />
            </div>

            {/* GitHub */}
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                value={settings.github_url}
                onChange={(e) => handleInputChange("github_url", e.target.value)}
                placeholder="https://github.com/yourprofile"
              />
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
