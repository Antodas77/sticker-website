"use client"

import { useState, useRef } from "react"
import { UploadCloud, X, Loader2, Film, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

type MediaType = "image" | "gif" | "video"

interface MediaUploaderProps {
  value: string
  onChange: (url: string) => void
  mediaType: MediaType
  disabled?: boolean
  bucket?: string
  folder?: string
}

const ACCEPT: Record<MediaType, string> = {
  image: "image/jpeg,image/png,image/webp,image/avif",
  gif: "image/gif",
  video: "video/mp4,video/webm,video/ogg,video/*",
}

const MAX_SIZE: Record<MediaType, number> = {
  image: 10 * 1024 * 1024,   // 10 MB
  gif: 10 * 1024 * 1024,     // 10 MB
  video: 100 * 1024 * 1024,  // 100 MB
}

const LABEL: Record<MediaType, string> = {
  image: "PNG, JPG, WebP up to 10 MB",
  gif: "GIF up to 10 MB",
  video: "MP4, WebM up to 100 MB",
}

export function MediaUploader({
  value,
  onChange,
  mediaType,
  disabled = false,
  bucket = "images",
  folder = "hero-bg",
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    // Validate type
    const isValid =
      mediaType === "video"
        ? file.type.startsWith("video/")
        : mediaType === "gif"
        ? file.type === "image/gif"
        : file.type.startsWith("image/") && file.type !== "image/gif"

    if (!isValid) {
      toast.error(
        mediaType === "video"
          ? "Please upload a video file (MP4, WebM)"
          : mediaType === "gif"
          ? "Please upload a GIF file"
          : "Please upload an image file (PNG, JPG, WebP)"
      )
      return
    }

    // Validate size
    if (file.size > MAX_SIZE[mediaType]) {
      const mbLimit = MAX_SIZE[mediaType] / (1024 * 1024)
      toast.error(`File must be less than ${mbLimit} MB`)
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress("Uploading…")

      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: "3600", upsert: false })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)

      onChange(publicUrl)
      toast.success("Uploaded successfully!")
    } catch (err) {
      console.error("Upload error:", err)
      toast.error("Failed to upload. Please try again.")
    } finally {
      setIsUploading(false)
      setUploadProgress("")
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) uploadFile(e.target.files[0])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !isUploading) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled || isUploading) return
    if (e.dataTransfer.files?.[0]) uploadFile(e.dataTransfer.files[0])
  }

  const handleRemove = () => onChange("")

  // ── Preview state (file already uploaded) ──
  if (value) {
    return (
      <div className="relative group overflow-hidden rounded-lg border border-border">
        {mediaType === "video" ? (
          <video
            key={value}
            src={value}
            autoPlay
            loop
            muted
            playsInline
            className="w-full aspect-video object-cover bg-muted"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Background preview"
            className="w-full aspect-video object-cover bg-muted"
          />
        )}

        {/* Overlay with remove button */}
        {!disabled && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" /> Remove
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8"
            >
              <UploadCloud className="h-4 w-4 mr-1" /> Replace
            </Button>
          </div>
        )}

        {/* Hidden input for replace */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={ACCEPT[mediaType]}
          className="hidden"
        />
      </div>
    )
  }

  // ── Dropzone ──
  return (
    <div
      onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed transition-colors select-none
        ${disabled ? "opacity-50 cursor-not-allowed bg-muted" : "cursor-pointer"}
        ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted-foreground/25 hover:bg-muted/40"}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={ACCEPT[mediaType]}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm">{uploadProgress || "Uploading…"}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-muted-foreground px-6 text-center">
          <div className="p-3 rounded-full bg-muted">
            {mediaType === "video" ? (
              <Film className="h-6 w-6" />
            ) : (
              <ImageIcon className="h-6 w-6" />
            )}
          </div>
          <div className="text-sm">
            <span className="font-semibold text-foreground">Click to upload</span>
            {" "}or drag and drop
          </div>
          <p className="text-xs opacity-60">{LABEL[mediaType]}</p>
        </div>
      )}
    </div>
  )
}
