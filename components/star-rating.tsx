import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  max?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
}

export function StarRating({ rating, max = 5, size = "sm", showValue = true }: StarRatingProps) {
  const sizes = {
    sm: 14,
    md: 18,
    lg: 24,
  }

  const starSize = sizes[size]

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={starSize}
          className={`${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"} ${
            i === Math.floor(rating) && rating % 1 > 0 ? "fill-gradient-star text-yellow-400" : ""
          }`}
        />
      ))}
      {showValue && <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>}
    </div>
  )
}
