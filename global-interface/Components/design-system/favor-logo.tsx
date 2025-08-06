"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface FavorLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  href?: string
  className?: string
}

export function FavorLogo({ size = "md", showText = true, href = "/", className }: FavorLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const LogoContent = () => (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn("bg-black rounded-lg flex items-center justify-center text-white font-bold", sizeClasses[size])}
      >
        <span className={cn(size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base")}>F</span>
      </div>
      {showText && <span className={cn("font-bold text-black", textSizeClasses[size])}>Favor</span>}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-80">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
