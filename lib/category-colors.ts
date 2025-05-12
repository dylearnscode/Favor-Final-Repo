// Define color mapping for categories
export const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  academic: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-800 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  clubs: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-800 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
  },
  preprofessional: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-800 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  "internship-connect": {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
  },
  social: {
    bg: "bg-rose-100 dark:bg-rose-900/30",
    text: "text-rose-800 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
  },
  // Default color for any other categories
  default: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-800 dark:text-gray-300",
    border: "border-gray-200 dark:border-gray-700",
  },
}

// Function to get color for a category
export function getCategoryColor(category: string | null | undefined) {
  if (!category) return categoryColors.default

  const slug = category.toLowerCase().replace(/\s+/g, "-")
  return categoryColors[slug] || categoryColors.default
}
