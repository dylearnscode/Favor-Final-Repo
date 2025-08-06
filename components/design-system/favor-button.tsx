"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { forwardRef } from "react"

interface FavorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export const FavorButton = forwardRef<HTMLButtonElement, FavorButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "font-medium transition-all duration-200 min-h-[44px]",
          {
            "bg-black text-white hover:bg-gray-800 active:bg-gray-900": variant === "primary",
            "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300": variant === "secondary",
            "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200": variant === "ghost",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    )
  },
)

FavorButton.displayName = "FavorButton"
