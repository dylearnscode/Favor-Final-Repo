"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Star, Loader2 } from "lucide-react"
import BottomNav from "@/components/bottom-nav"
import { useRouter } from "next/navigation"

interface ServiceItem {
  id: string
  title: string
  description: string
  price: number
  price_negotiability: "negotiable" | "non-negotiable"
  category: string
  poster: string
  rating?: number | null
  review_count?: number
  created_at: string
  expires_at: string
}

const CATEGORIES = ["Concert Tickets", "Dorm Items", "Preprofessional Help", "Food Truck Line Service"]

export default function ExchangeMain() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async (category?: string) => {
    try {
      setLoading(true)
      setError(null)

      const url = new URL("/api/exchange/posts", window.location.origin)
      if (category) {
        url.searchParams.set("category", category)
      }

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error("Failed to fetch services")
      }

      const data = await response.json()
      setServices(data)
    } catch (err) {
      console.error("Error fetching services:", err)
      setError(err instanceof Error ? err.message : "Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices(selectedCategory || undefined)
  }, [selectedCategory])

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const handlePostClick = () => {
    console.log("Post button clicked, navigating to /exchange/posts")
    router.push("/exchange/posts")
  }

  const handleBruinBashClick = () => {
    console.log("BruinBash clicked, navigating to specload")
    router.push("/exchange/specials/specload")
  }

  const handleCategoryClick = (category: string) => {
    const newCategory = selectedCategory === category ? null : category
    setSelectedCategory(newCategory)
  }

  const handleRefresh = () => {
    fetchServices(selectedCategory || undefined)
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="rounded-full bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center">
          {CATEGORIES.map((category) => (
            <div
              key={category}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 p-2 transition-colors ${
                  selectedCategory === category ? "bg-blue-600" : "bg-white hover:bg-gray-200"
                }`}
              >
                <span className="text-2xl">
                  {category === "Concert Tickets" && "🎫"}
                  {category === "Dorm Items" && "🏠"}
                  {category === "Preprofessional Help" && "💼"}
                  {category === "Food Truck Line Service" && "🍽️"}
                </span>
              </div>
              <span
                className={`text-xs font-medium text-center ${
                  selectedCategory === category ? "text-blue-400" : "text-gray-300"
                }`}
              >
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Service - BruinBash */}
      <div className="px-4 py-2">
        <Card
          className="overflow-hidden shadow-sm border-gray-800 bg-gray-900 cursor-pointer hover:bg-gray-800 transition-all duration-200"
          onClick={handleBruinBashClick}
        >
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
        <h2 className="text-xl font-bold mb-4 text-white">
          Available Services
          {selectedCategory && <span className="text-sm font-normal text-gray-400 ml-2">• {selectedCategory}</span>}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-400">Loading services...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Error loading services</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="text-white border-gray-700 hover:bg-gray-800 bg-transparent"
            >
              Try Again
            </Button>
          </div>
        ) : (
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
                        {service.category === "Food Truck Line Service" && "🍽️"}
                        {service.category === "Preprofessional Help" && "💼"}
                        {service.category === "Concert Tickets" && "🎫"}
                        {service.category === "Dorm Items" && "🏠"}
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base mb-1 text-white">{service.title}</h3>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{service.description}</p>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="text-gray-400">By {service.poster}</span>
                            {service.rating && service.review_count && service.review_count > 0 ? (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-gray-400">
                                  {service.rating} ({service.review_count})
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500">No rating</span>
                            )}
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <div className="font-bold text-lg text-white">${service.price.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">
                            {service.price_negotiability === "negotiable" ? "Negotiable" : "Fixed"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4">
              {selectedCategory
                ? `No services found in "${selectedCategory}". Try a different category or search term.`
                : "Try adjusting your search or check back later"}
            </p>
            {selectedCategory && (
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
                className="text-white border-gray-700 hover:bg-gray-800"
              >
                Clear Filter
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Floating Post Button */}
      <div className="fixed bottom-24 right-6 z-50">
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
