"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { getCategoryColor } from "@/lib/category-colors"

interface Category {
  id: number
  name: string
  slug: string
}

export function CategoryPills({ categories, selectedCategory }: { categories: Category[]; selectedCategory?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButtons, setShowScrollButtons] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current
        setShowScrollButtons(scrollWidth > clientWidth)
      }
    }

    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [categories])

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams)

    if (categorySlug === "all") {
      params.delete("category")
      params.delete("subcategory")
    } else {
      params.set("category", categorySlug)
      params.delete("subcategory")
    }

    // Preserve the type parameter
    const type = searchParams.get("type") || "offering"
    params.set("type", type)

    // Preserve the search query if it exists
    const query = searchParams.get("q")
    if (query) {
      params.set("q", query)
    }

    router.push(`/search?${params.toString()}`)
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef
      const scrollAmount = container.clientWidth * 0.8
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  return (
    <div className="relative">
      {showScrollButtons && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-background to-transparent"
            onClick={() => scroll("left")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-l from-background to-transparent"
            onClick={() => scroll("right")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </>
      )}

      <div ref={scrollContainerRef} className="flex overflow-x-auto py-2 px-1 scrollbar-hide -mx-1 snap-x">
        <div className="flex gap-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick("all")}
            className="rounded-full whitespace-nowrap snap-start"
          >
            All Categories
          </Button>

          {categories.map((category) => {
            const colors = getCategoryColor(category.slug)
            const isSelected = selectedCategory === category.slug

            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category.slug)}
                className={`rounded-full whitespace-nowrap snap-start ${isSelected ? colors.bg : ""}`}
              >
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
