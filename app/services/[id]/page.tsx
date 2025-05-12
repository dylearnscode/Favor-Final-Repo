import { createServerClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { MobileHeader } from "@/components/mobile-header"
import { MobileNav } from "@/components/mobile-nav"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "@/components/star-rating"
import { CategoryBadge } from "@/components/category-badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Share2 } from "lucide-react"

export default async function ServicePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { data: service } = await supabase.from("services").select("*, profiles(*)").eq("id", params.id).single()

  if (!service) {
    notFound()
  }

  // Fetch related services in the same category
  const { data: relatedServices } = await supabase
    .from("services")
    .select("*, profiles(username, avatar_url, rating)")
    .eq("category", service.category)
    .eq("status", "active")
    .eq("is_offering", service.is_offering)
    .neq("id", service.id)
    .limit(3)

  return (
    <main className="flex flex-col min-h-screen bg-black pb-safe">
      <MobileHeader />

      <div className="flex-1">
        {service.image_url ? (
          <div className="relative w-full h-64">
            <Image src={service.image_url || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-800" />
        )}

        <div className="p-4">
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-bold">{service.title}</h1>
            <p className="text-xl font-bold">${service.price}</p>
          </div>

          <div className="flex items-center mt-3 mb-4">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={service.profiles.avatar_url || ""} />
              <AvatarFallback>{service.profiles.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <span className="font-medium text-sm">{service.profiles.username}</span>
                {service.profiles.rating && (
                  <div className="flex items-center ml-2">
                    <StarRating rating={service.profiles.rating} size="sm" />
                  </div>
                )}
              </div>
              {service.profiles.description && <p className="text-xs text-gray-400">{service.profiles.description}</p>}
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <CategoryBadge category={service.category} />
            {service.subcategory && <CategoryBadge category={service.subcategory} />}
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <h2 className="text-base font-medium mb-2">Description</h2>
            <p className="text-sm text-gray-300">{service.description}</p>
          </div>

          {relatedServices && relatedServices.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-medium mb-3">Similar Services</h2>
              <div className="grid grid-cols-1 gap-3">
                {relatedServices.map((relatedService) => (
                  <div key={relatedService.id} className="bg-gray-900 rounded-lg p-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm">{relatedService.title}</h3>
                      <span className="font-bold text-sm">${relatedService.price}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <Avatar className="h-5 w-5 mr-1.5">
                        <AvatarImage src={relatedService.profiles.avatar_url || ""} />
                        <AvatarFallback>{relatedService.profiles.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{relatedService.profiles.username}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-16 left-0 right-0 p-4 bg-black border-t border-gray-800">
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="rounded-full">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="flex-1 rounded-full">
            <MessageSquare className="h-5 w-5 mr-2" />
            Message
          </Button>
          <Button className="flex-1 rounded-full">{service.is_offering ? "Buy Now" : "Offer Help"}</Button>
        </div>
      </div>

      <MobileNav />
    </main>
  )
}
