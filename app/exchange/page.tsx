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
    <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
      {/* Header with Search */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search services, tutoring, tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 h-12 rounded-lg"
          />
        </div>

        {/* Filter Options */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
          >
            <span className="mr-2">💰</span>
            Price
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
          >
            Sort
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
          >
            Top Rated
          </Button>
        </div>
      </div>

      {/* Category Icons */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 p-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/521_REpWIE1BUiAwMjMtMjc.jpg-gkjNPhs7XOlhPfkji6OpY8tshQ1vPr.jpeg"
                alt="Concert"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <span className="text-xs font-medium text-gray-300">Concert Tickets</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 p-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lUz4mv0eL0DHh3LUSF5ugEyFAyferD.png"
                alt="Dorm Appliances"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-medium text-gray-300">Dorm Appliances</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 p-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YaEScVT1iz8dnYlshrOfBrOns0CBNP.png"
                alt="Preprofessional Help"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-medium text-gray-300">Preprofessional Help</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 p-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-09-07%20at%2012.32.26%E2%80%AFAM-DlU56pc3JqTn4aHB537AXEy28JrMXZ.png"
                alt="Food Truck Waiter"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-medium text-gray-300">Food Truck Waiter</span>
          </div>
        </div>
      </div>

      {/* Featured Service - BruinBash */}
      <div className="px-4 py-2">
        <Card className="overflow-hidden shadow-sm border-gray-800 bg-gray-900">
          <div className="relative">
            <div className="h-48 overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tJPt0XsEADqwGKggB1EOq37NtDl8xm.png"
                alt="BruinBash Concert"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-3 right-3">
              <Badge className="bg-blue-600 text-white">Sponsored</Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg text-white">BruinBash</h3>
                <p className="text-gray-400 text-sm">$$ • Event Services</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Available Now</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white">4.8 (156)</span>
              </div>
              <span>$5 Service Fee</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Services Section */}
      <div className="px-4 py-4">
        <h2 className="text-xl font-bold mb-4 text-white">Available Services</h2>
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="overflow-hidden shadow-sm border-gray-800 bg-gray-900 hover:bg-gray-800 transition-all duration-200"
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* Service Image/Icon */}
                  <div className="w-24 h-24 bg-gray-800 flex items-center justify-center flex-shrink-0">
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
                        <h3 className="font-semibold text-base mb-1 text-white">{service.title}</h3>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{service.subtitle}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{service.timeEstimate}</span>
                          {service.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-gray-400">
                                {service.rating} ({service.reviews})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="font-bold text-lg text-white">{service.price}</div>
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
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or check back later</p>
          </div>
        )}
      </div>

      {/* Floating Post Button */}
      <div className="fixed bottom-24 right-6 z-20">
        <Button
          onClick={handlePostClick}
          size="lg"
          className="w-14 h-14 rounded-full bg-white text-black hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <BottomNav activeTab="exchange" />
    </div>
  )
}
