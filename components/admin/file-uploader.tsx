"use client"

import { useState, useRef } from "react"
import { UploadCloud, X, Loader2, FileText, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FileUploaderProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
  bucket?: string
  folder?: string
  accept?: string
  label?: string
}

export function FileUploader({
  value,
  onChange,
  disabled = false,
  bucket = "images",
  folder = "documents",
  accept = "application/pdf",
  label = "PDF",
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    if (accept === "application/pdf" && file.type !== "application/pdf") {
      toast.error("Please upload a PDF file")
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be less than 20MB")
      return
    }

    try {
      setIsUploading(true)

      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      onChange(publicUrl)
      toast.success(`${label} uploaded successfully`)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(`Failed to upload ${label}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0])
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0])
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    onChange("")
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput("")
      setShowUrlInput(false)
      toast.success("URL saved")
    }
  }

  // File already uploaded/linked
  if (value) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 shrink-0">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">Resume / CV linked</p>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            View PDF <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        {!disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Drag & Drop zone */}
      <div
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-28 rounded-md border-2 border-dashed transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed bg-muted" : "cursor-pointer"}
          ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50"}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={accept}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="p-2 rounded-full bg-muted">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="text-sm text-center px-4">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs opacity-70">PDF up to 20MB</p>
          </div>
        )}
      </div>

      {/* Or paste URL */}
      {!showUrlInput ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground"
          onClick={() => setShowUrlInput(true)}
        >
          Or paste a URL instead
        </Button>
      ) : (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <Input
            type="url"
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="h-8 text-sm"
            autoFocus
          />
          <Button type="submit" size="sm" className="h-8 shrink-0">
            Save
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 shrink-0"
            onClick={() => setShowUrlInput(false)}
          >
            Cancel
          </Button>
        </form>
      )}
    </div>
  )
}
