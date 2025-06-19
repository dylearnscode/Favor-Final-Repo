"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useSupabase } from "./supabase-provider"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { getCategoryColor } from "@/lib/category-colors"

interface Category {
  id: number
  name: string
  slug: string
  subcategories: Subcategory[]
}

interface Subcategory {
  id: number
  category_id: number
  name: string
  slug: string
}

export function CategoryFilter({
  selectedCategory,
  selectedSubcategory,
}: {
  selectedCategory?: string
  selectedSubcategory?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { supabase } = useSupabase()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const type = searchParams.get("type") || "offering"

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("id")

        if (categoriesError) throw categoriesError

        // Fetch subcategories
        const { data: subcategoriesData, error: subcategoriesError } = await supabase
          .from("subcategories")
          .select("*")
          .order("id")

        if (subcategoriesError) throw subcategoriesError

        // Organize data
        const categoriesWithSubs = categoriesData.map((category) => ({
          ...category,
          subcategories: subcategoriesData.filter((sub) => sub.category_id === category.id),
        }))

        setCategories(categoriesWithSubs)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [supabase])

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
    params.set("type", type)

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSubcategoryClick = (categorySlug: string, subcategorySlug: string) => {
    const params = new URLSearchParams(searchParams)

    params.set("category", categorySlug)
    params.set("subcategory", subcategorySlug)

    // Preserve the type parameter
    params.set("type", type)

    router.push(`${pathname}?${params.toString()}`)
  }

  if (loading) {
    return <div>Loading categories...</div>
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Button
          variant={!selectedCategory ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick("all")}
          className="mb-2 w-full justify-start"
        >
          All Categories
        </Button>
      </div>

      <Accordion type="multiple" className="w-full bg-secondary rounded-lg overflow-hidden">
        {categories.map((category) => {
          const colors = getCategoryColor(category.slug)
          const isSelected = selectedCategory === category.slug

          return (
            <AccordionItem key={category.id} value={category.slug} className="border-b border-border last:border-0">
              <AccordionTrigger
                className={`hover:no-underline px-4 py-3 ${isSelected && !selectedSubcategory ? colors.text : ""}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={isSelected && !selectedSubcategory ? "font-medium" : ""}>{category.name}</span>
                  {isSelected && !selectedSubcategory && <ChevronRight className="h-4 w-4" />}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-4 space-y-1 py-2">
                  {category.subcategories.map((subcategory) => {
                    const isSubSelected = isSelected && selectedSubcategory === subcategory.slug

                    return (
                      <Button
                        key={subcategory.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSubcategoryClick(category.slug, subcategory.slug)}
                        className={`w-full justify-start ${isSubSelected ? colors.text + " font-medium" : ""}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{subcategory.name}</span>
                          {isSubSelected && <ChevronRight className="h-4 w-4" />}
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
