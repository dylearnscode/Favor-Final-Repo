import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "./star-rating"
import { CategoryBadge } from "./category-badge"
import Image from "next/image"

interface Service {
  id: string
  title: string
  description: string
  price: number
  category: string
  subcategory: string | null
  is_offering: boolean
  image_url: string | null
  created_at: string
  profiles: {
    username: string
    avatar_url: string | null
    rating?: number
    description?: string | null
  }
}

export function ServicesList({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-base font-medium">No services found</h3>
        <p className="text-gray-400 text-sm">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {services.map((service) => (
        <Link href={`/services/${service.id}`} key={service.id} className="block">
          <Card className="overflow-hidden bg-gray-900 border-none hover:bg-gray-800 transition-colors">
            <div className="flex">
              {service.image_url ? (
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={service.image_url || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-800 flex-shrink-0" />
              )}

              <div className="p-3 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium line-clamp-1">{service.title}</h3>
                  <p className="font-bold text-sm ml-2">${service.price}</p>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 mt-1 mb-2">{service.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={service.profiles.avatar_url || ""} />
                      <AvatarFallback>{service.profiles.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-xs">{service.profiles.username}</span>
                      {service.profiles.rating && (
                        <div className="flex items-center">
                          <StarRating rating={service.profiles.rating} size="xs" />
                        </div>
                      )}
                    </div>
                  </div>

                  <CategoryBadge category={service.category} className="text-xs px-2 py-0.5" />
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
