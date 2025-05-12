import { Badge } from "@/components/ui/badge"
import { CategoryBadge } from "./category-badge"
import { formatDate } from "@/lib/utils"
import Image from "next/image"

interface ServiceDetailsProps {
  service: any
}

export function ServiceDetails({ service }: ServiceDetailsProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{service.title}</h1>
        <Badge variant={service.is_offering ? "default" : "secondary"} className="text-sm">
          {service.is_offering ? "Offering" : "Request"}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={service.category} />
        {service.subcategory && <CategoryBadge category={service.subcategory} />}
        <span className="text-xs md:text-sm text-muted-foreground">Posted {formatDate(service.created_at)}</span>
      </div>

      {service.image_url && (
        <div className="relative w-full h-[200px] md:h-[300px] rounded-lg overflow-hidden">
          <Image src={service.image_url || "/placeholder.svg"} alt={service.title} fill className="object-contain" />
        </div>
      )}

      <div className="bg-secondary p-4 md:p-6 rounded-lg">
        <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Price</h2>
        <p className="text-2xl md:text-3xl font-bold">${service.price}</p>
      </div>

      <div>
        <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Description</h2>
        <div className="prose prose-invert max-w-none text-sm md:text-base">
          <p>{service.description}</p>
        </div>
      </div>
    </div>
  )
}
