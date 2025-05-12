import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { getCategoryColor } from "@/lib/category-colors"

interface Subcategory {
  id: number
  category_id: number
  name: string
  slug: string
}

interface Category {
  id: number
  name: string
  slug: string
  subcategories: Subcategory[]
}

export function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section className="mt-8 md:mt-12 slide-up">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 tracking-tight">Browse Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {categories.map((category) => {
          const colors = getCategoryColor(category.slug)

          return (
            <Card
              key={category.id}
              className="bg-secondary hover:bg-secondary/80 transition-colors duration-200 overflow-hidden"
            >
              <CardContent className="p-0">
                <Link href={`/services?category=${category.slug}&type=offering`} className="block p-4 md:p-6">
                  <div className="flex justify-between items-center mb-2 md:mb-4">
                    <h3 className={`text-lg md:text-xl font-semibold ${colors.text}`}>{category.name}</h3>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
                <div className="border-t border-border">
                  {category.subcategories.slice(0, 3).map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/services?category=${category.slug}&subcategory=${subcategory.slug}&type=offering`}
                      className="flex justify-between items-center p-3 md:p-4 hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-xs md:text-sm">{subcategory.name}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                  {category.subcategories.length > 3 && (
                    <Link
                      href={`/services?category=${category.slug}&type=offering`}
                      className={`block p-3 md:p-4 text-center text-xs md:text-sm ${colors.text} hover:underline`}
                    >
                      View all {category.subcategories.length} subcategories
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
