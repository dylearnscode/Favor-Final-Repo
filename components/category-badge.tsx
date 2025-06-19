import { getCategoryColor } from "@/lib/category-colors"

interface CategoryBadgeProps {
  category: string
  className?: string
}

export function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  const colors = getCategoryColor(category)

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      {category}
    </span>
  )
}
