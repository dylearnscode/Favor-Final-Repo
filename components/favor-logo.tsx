import Link from "next/link"
import Image from "next/image"

interface FavorLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function FavorLogo({ size = "md", showText = true }: FavorLogoProps) {
  const sizes = {
    sm: 24,
    md: 32,
    lg: 48,
  }

  const logoSize = sizes[size]
  const imageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-10%20at%205.45.45%E2%80%AFPM-FzdvkxvEpA6WqQKhIHq1BdVR8IjW7q.jpeg"

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative" style={{ width: logoSize, height: logoSize }}>
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Favor Logo"
          width={logoSize}
          height={logoSize}
          className="rounded-sm object-contain"
        />
      </div>
      {showText && <span className="text-xl font-bold">Favor</span>}
    </Link>
  )
}
