"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function MobileSearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="px-4 py-3 border-b border-gray-800">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="What services do you need/offer?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 py-2 h-11 bg-gray-900 border-gray-800 rounded-full text-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </form>
    </div>
  )
}
