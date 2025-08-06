"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { forwardRef } from "react"

interface FavorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  as?: "input" | "textarea"
  rows?: number
}

export const FavorInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, FavorInputProps>(
  ({ label, error, icon, as = "input", className, rows, ...props }, ref) => {
    const InputComponent = as === "textarea" ? Textarea : Input

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className="text-sm font-medium text-foreground">
            {label}
          </Label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</div>
          )}
          <InputComponent
            ref={ref as any}
            className={cn(
              "min-h-[44px] transition-all duration-200",
              "focus:ring-2 focus:ring-black focus:border-black",
              icon && "pl-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className,
            )}
            rows={rows}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  },
)

FavorInput.displayName = "FavorInput"
