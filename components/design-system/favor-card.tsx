"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface FavorCardProps {
  children: React.ReactNode
  hover?: boolean
  onClick?: () => void
  className?: string
}

export function FavorCard({ children, hover = true, onClick, className }: FavorCardProps) {
  return (
    <Card
      className={cn(
        "border border-border bg-card text-card-foreground transition-all duration-300",
        hover && "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  )
}
