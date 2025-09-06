"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Star } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { useRouter } from "next/navigation"

interface ServiceItem {
  id: string
  title: string
  subtitle: string
  price: string
  poster: string
  rating?: number
  reviews?: number
  timeEstimate?: string
  category: string
}

const SAMPLE_SERVICES: ServiceItem[] = [
  {
    id: "1",
    title: "Wait in line for Salpicon",
    subtitle: "Saves you 40 minutes, Courier swipes for you",
    price: "$12",
    poster: "Sarah K.",
    rating: 4.9,
    reviews: 23,
    timeEstimate: "Available now",
    category: "Food Services",
  },
  {
    id: "2",
    title: "Coffee Chat with UConsulting Director",
    subtitle: "Get ahead for recruitment.",
    price: "$15",
    poster: "Mike R.",
    rating: 5.0,
    reviews: 18,
    timeEstimate: "30 min",
    category: "Career Help",
  },
  {
    id: "3",
    title: "Resume review from Google APM intern",
    subtitle: "70% of my mentees have FAANG offers",
    price: "$20",
    poster: "Emma L.",
    rating: 4.8,
    reviews: 45,
    timeEstimate: "24 hours",
    category: "Career Help",
  },
  {
    id: "4",
    title: "Concert ticket pickup service",
    subtitle: "I'll wait in line and deliver to your dorm",
    price: "$8",
    poster: "Alex M.",
    rating: 4.7,
    reviews: 12,
    timeEstimate: "Same day",
    category: "Event Services",
  },
]

const CategoryIcon = ({ type, className }: { type: string; className?: string }) => {
  const iconClass = `w-8 h-8 ${className}`

  switch (type) {
    case "concert":
      return (
        <svg viewBox="0 0 32 32" className={iconClass} fill="currentColor">
          <path d="M6 8h20l-2 16H8L6 8zm2.5 2l1.5 12h12l1.5-12h-15z" />
          <path d="M10 12h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2z" />
          <path d="M8 6h16v2H8z" />
        </svg>
      )
    case "appliances":
      return (
        <svg viewBox="0 0 32 32" className={iconClass} fill="currentColor">
          <path d="M4 6h24v20H4V6zm2 2v16h20V8H6z" />
          <path d="M8 12h16v8H8v-8zm2 2v4h12v-4H10z" />
          <circle cx="12" cy="16" r="1" />
          <circle cx="20" cy="16" r="1" />
        </svg>
      )
    case "coaching":
      return (
        <svg viewBox="0 0 32 32" className={iconClass} fill="currentColor">
          <circle cx="12" cy="8" r="3" />
          <circle cx="20" cy="8" r="3" />
          <path d="M8 14h8v2H8zm12 0h4v2h-4z" />
          <path d="M10 18h4v8h-4zm8 0h4v8h-4z" />
          <path d="M16 20l4-2v4l-4-2z" />
        </svg>
      )
    case "foodtruck":
      return (
        <svg viewBox="0 0 32 32" className={iconClass} fill="currentColor">
          <rect x="8" y="12" width="16" height="8" rx="1" />
          <circle cx="12" cy="22" r="2" />
          <circle cx="20" cy="22" r="2" />
          <path d="M6 16h2v2H6zm20 0h2v2h-2z" />
          <rect x="10" y="14" width="2" height="4" />
          <rect x="14" y="14" width="2" height="4" />
          <rect x="18" y="14" width="2" height="4" />
          <path d="M4 18h2v2H4zm2 2h2v2H6zm2 2h2v2H8z" />
        </svg>
      )
    default:
      return <div className={iconClass} />
  }
}

export default function Exchange() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredServices = SAMPLE_SERVICES.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePostClick = () => {
    // Navigate to exchange post form (similar to academic post)
    router.push("/exchange/post")
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header with Search */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-10 pt-safe">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search services, tutoring, tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 h-12 rounded-lg"
          />
        </div>

        {/* Filter Options */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
            <span className="mr-2">💰</span>
            Price
          </Button>
          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
            Sort
          </Button>
          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
            Top Rated
          </Button>
        </div>
      </div>

      {/* Category Icons */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <CategoryIcon type="concert" className="text-orange-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Concert Tickets</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <CategoryIcon type="appliances" className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Dorm Appliances</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CategoryIcon type="coaching" className="text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Preprofessional Help</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <CategoryIcon type="foodtruck" className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Food Truck Waiter</span>
          </div>
        </div>
      </div>

      {/* Featured Service */}
      <div className="px-4 py-2">
        <Card className="overflow-hidden shadow-sm border-gray-200">
          <div className="relative">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-4xl mb-2">🎫</div>
                <div className="text-lg font-semibold">Premium Services</div>
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-600 text-white">Sponsored</Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg">Concert Ticket Services</h3>
                <p className="text-gray-600 text-sm">$$ • Event Services</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Available Now</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.8 (156)</span>
              </div>
              <span>$5 Service Fee</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Your Favorites Section */}
      <div className="px-4 py-4">
        <h2 className="text-xl font-bold mb-4">Available Services</h2>
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="overflow-hidden shadow-sm border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* Service Image/Icon */}
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                    <div className="text-2xl">
                      {service.category === "Food Services" && "🍽️"}
                      {service.category === "Career Help" && "💼"}
                      {service.category === "Event Services" && "🎫"}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1">{service.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{service.subtitle}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{service.timeEstimate}</span>
                          {service.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>
                                {service.rating} ({service.reviews})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="font-bold text-lg text-green-600">{service.price}</div>
                        <div className="text-xs text-gray-500">By {service.poster}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or check back later</p>
          </div>
        )}
      </div>

      {/* Floating Post Button */}
      <div className="fixed bottom-24 right-6 z-20">
        <Button
          onClick={handlePostClick}
          size="lg"
          className="w-14 h-14 rounded-full bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <BottomNav activeTab="exchange" />
    </div>
  )
}
