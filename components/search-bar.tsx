"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SearchBarProps {
  initialQuery?: string
  type?: string
}

export function SearchBar({ initialQuery = "", type = "offering" }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [searchType, setSearchType] = useState(type)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query)}&type=${searchType}`)
  }

  const handleTypeChange = (value: string) => {
    setSearchType(value)
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}&type=${value}`)
    }
  }

  const clearSearch = () => {
    setQuery("")
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search for services..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 bg-secondary border-none text-base rounded-full"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-12 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 rounded-full"
          size="sm"
        >
          Search
        </Button>
      </form>

      <Tabs defaultValue={searchType} onValueChange={handleTypeChange} className="w-full">
        <TabsList className="bg-secondary w-full rounded-full">
          <TabsTrigger value="offering" className="flex-1 data-[state=active]:bg-primary rounded-full">
            Offerings
          </TabsTrigger>
          <TabsTrigger value="requesting" className="flex-1 data-[state=active]:bg-primary rounded-full">
            Requests
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
