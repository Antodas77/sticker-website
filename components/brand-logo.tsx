"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import type { GlobalBranding } from "@/lib/supabase"

interface BrandLogoProps {
  variant?: "nav" | "footer"
}

export function BrandLogo({ variant = "nav" }: BrandLogoProps = {}) {
  const [branding, setBranding] = useState<GlobalBranding | null>(null)
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    supabase
      .from("global_branding")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setBranding(data[0] as GlobalBranding)
        }
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className={`rounded-sm bg-muted animate-pulse ${variant === "footer" ? "w-10 h-10" : "w-8 h-8"}`} />
    )
  }

  if (!branding) return null

  // For hover-only GIF: swap src between poster and animated URL
  const gifSrc =
    branding.brand_type === "gif" && !branding.gif_loop
      ? isHovered
        ? (branding.media_url ?? "")
        : (branding.static_poster_url ?? branding.media_url ?? "")
      : (branding.media_url ?? "")

  return (
    <Link
      href={branding.link_dest || "/"}
      className="flex items-center gap-2 group"
    >
      {/* ── Logo Mark ─────────────────────────────────────── */}
      <div
        className={`relative rounded-sm overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          variant === "footer" ? "w-10 h-10" : "w-8 h-8"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {branding.brand_type === "text" && (
          <div className="w-full h-full bg-foreground flex items-center justify-center">
            <span className={`text-background font-bold select-none ${variant === "footer" ? "text-sm" : "text-xs"}`}>
              {branding.label_text
                ? branding.label_text
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                : "CS"}
            </span>
          </div>
        )}

        {branding.brand_type === "image" && branding.media_url && (
          <Image
            src={branding.media_url}
            alt={branding.label_text}
            fill
            className="object-cover"
            sizes="32px"
            unoptimized
          />
        )}

        {branding.brand_type === "gif" && (
          gifSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={gifSrc}
                alt={branding.label_text}
                className="w-full h-full object-cover"
              />
              {/* Hover shimmer ring for gif */}
              <div
                className={`absolute inset-0 rounded-sm ring-2 ring-foreground/30 transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />
            </>
          ) : (
            /* No GIF uploaded yet — show text fallback */
            <div className="w-full h-full bg-foreground flex items-center justify-center">
              <span className={`text-background font-bold select-none ${variant === "footer" ? "text-sm" : "text-xs"}`}>
                {branding.label_text
                  ? branding.label_text
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                  : "CS"}
              </span>
            </div>
          )
        )}
      </div>

      {/* ── Label ─────────────────────────────────────────── */}
      <span
        className={`text-foreground whitespace-nowrap ${
          variant === "footer"
            ? "text-xl font-semibold ml-1"
            : "text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        }`}
      >
        {branding.label_text}
      </span>
    </Link>
  )
}
