"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface HiveLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  href?: string
  className?: string
}

export function HiveLogo({ size = "md", showText = true, href = "/", className }: HiveLogoProps) {
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
        className={cn(
          "bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-black font-bold shadow-lg",
          sizeClasses[size],
        )}
        style={{
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
      >
        <span className={cn(size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base", "font-black")}>H</span>
      </div>
      {showText && <span className={cn("font-bold text-amber-600", textSizeClasses[size])}>Hive</span>}
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
