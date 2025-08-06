"use client"

import type React from "react"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FavorSearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export function FavorSearchBar({
  placeholder = "Search...",
  onSearch,
  className,
  value: controlledValue,
  onChange,
}: FavorSearchBarProps) {
  const [internalValue, setInternalValue] = useState("")

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = onChange || setInternalValue

  const handleSearch = () => {
    onSearch?.(value)
  }

  const handleClear = () => {
    setValue("")
    onSearch?.("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pl-10 pr-10 min-h-[44px] transition-all duration-200 focus:ring-2 focus:ring-black focus:border-black"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
