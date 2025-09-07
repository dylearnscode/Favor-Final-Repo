"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MessageCircle, Plus, RefreshCw } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { ProtectedRoute } from "@/components/protected-route"
import { toast } from "sonner"

interface ExchangePost {
  id: string
  title: string
  description: string
  price: number
  price_negotiability: "negotiable" | "non-negotiable"
  category: string
  rating: number | null
  review_count: number
  created_at: string
  user_profiles: {
    username: string
    full_name: string | null
    avatar_url: string | null
  }
}

const categories = [
  { id: "all", name: "All", icon: "🏪" },
  { id: "Concert Tickets", name: "Concert Tickets", icon: "🎵" },
  { id: "Dorm Items", name: "Dorm Items", icon: "🏠" },
  { id: "Preprofessional Help", name: "Preprofessional Help", icon: "💼" },
  { id: "Food Truck Line Service", name: "Food Truck Line Service", icon: "🚚" },
]

export default function ExchangeMainPage() {
  const [services, setServices] = useState<ExchangePost[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchServices = async (category = "all") => {
    try {
      const url =
        category === "all" ? "/api/exchange/posts" : `/api/exchange/posts?category=${encodeURIComponent(category)}`

      const response = await fetch(url)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch services")
      }

      setServices(result.data || [])
      setError(null)
    } catch (error) {
      console.error("Error fetching services:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch services")
      toast.error("Failed to load services")
    }
  }

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true)
      await fetchServices(selectedCategory)
      setLoading(false)
    }

    loadServices()
  }, [selectedCategory])

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchServices(selectedCategory)
    setRefreshing(false)
    toast.success("Services refreshed!")
  }

  const formatPrice = (price: number, negotiability: string) => {
    const formatted = `$${price.toFixed(2)}`
    return negotiability === "negotiable" ? `${formatted} (negotiable)` : formatted
  }

  const formatRating = (rating: number | null, reviewCount: number) => {
    if (rating === null || reviewCount === 0) {
      return "No rating"
    }
    return `${rating.toFixed(1)} (${reviewCount} reviews)`
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Exchange</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
              <Button onClick={() => router.push("/exchange/posts")} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Post Service
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category.id)}
                className="whitespace-nowrap"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* BruinBash Special Offer Banner */}
        <div className="p-4">
          <Card
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/exchange/specials/specload")}
          >
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">🎉 BruinBash Special Offers</h2>
              <p className="text-blue-100">Exclusive deals for UCLA students!</p>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        <div className="p-4 space-y-4 pb-20">
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-600 mb-2">⚠️ Error loading services</p>
                <p className="text-sm text-red-500 mb-3">{error}</p>
                <Button onClick={handleRefresh} size="sm" variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {services.length === 0 && !error ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">
                  {selectedCategory === "all"
                    ? "No services available at the moment"
                    : `No services in ${selectedCategory} category`}
                </p>
                <Button onClick={() => router.push("/exchange/posts")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post the First Service
                </Button>
              </CardContent>
            </Card>
          ) : (
            services.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                    <Badge variant="secondary">{service.category}</Badge>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg text-green-600">
                        {formatPrice(service.price, service.price_negotiability)}
                      </span>

                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="h-4 w-4" />
                        {formatRating(service.rating, service.review_count)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">by {service.user_profiles.username}</span>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
