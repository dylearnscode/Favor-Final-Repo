"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter } from "lucide-react"
import { CategoryFilter } from "./category-filter"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface FilterSheetProps {
  selectedCategory?: string
  selectedSubcategory?: string
}

export function FilterSheet({ selectedCategory, selectedSubcategory }: FilterSheetProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("category")
    params.delete("subcategory")

    // Preserve the type parameter
    const type = searchParams.get("type") || "offering"
    params.set("type", type)

    // Preserve the search query if it exists
    const query = searchParams.get("q")
    if (query) {
      params.set("q", query)
    }

    router.push(`/search?${params.toString()}`)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {(selectedCategory || selectedSubcategory) && <span className="ml-1 rounded-full bg-primary w-2 h-2" />}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-xl pt-6">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="py-4 overflow-y-auto h-[calc(80vh-120px)]">
          <CategoryFilter selectedCategory={selectedCategory} selectedSubcategory={selectedSubcategory} />
        </div>
        <SheetFooter className="flex flex-row gap-3 pt-2 border-t">
          <Button variant="outline" className="flex-1" onClick={handleClearFilters}>
            Clear Filters
          </Button>
          <Button className="flex-1" onClick={() => setOpen(false)}>
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
