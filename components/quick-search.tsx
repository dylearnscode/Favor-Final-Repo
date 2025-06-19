"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Camera, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuickSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}&type=offering`)
    }
  }

  const popularSearches = ["Tutoring", "Resume Review", "Coffee Chat", "Rideshare", "Food Delivery"]

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className={`bg-gray-900 rounded-full shadow-lg transition-all duration-300 ${isExpanded ? "p-4" : "p-2"}`}>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="What do you need help with?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="snap-search"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="rounded-full h-8 w-8 bg-gray-800 hover:bg-gray-700"
              onClick={() => alert("Voice search coming soon!")}
            >
              <Mic className="h-4 w-4 text-gray-400" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="rounded-full h-8 w-8 bg-gray-800 hover:bg-gray-700"
              onClick={() => alert("Camera search coming soon!")}
            >
              <Camera className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </form>

        {isExpanded && (
          <div className="mt-4 space-y-2 animate-fadeIn">
            <p className="text-sm text-gray-400 px-2">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-gray-800 border-gray-700 hover:bg-gray-700"
                  onClick={() => {
                    setQuery(term)
                    router.push(`/search?q=${encodeURIComponent(term)}&type=offering`)
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
