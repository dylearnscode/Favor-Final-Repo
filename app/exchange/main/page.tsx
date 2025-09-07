"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { ProtectedRoute } from "@/components/protected-route"
import { toast } from "sonner"

interface ExchangePost {
  id: string
  title: string
  description: string
  price: number
  price_negotiability: string
  category: string
  rating: number | null
  review_count: number | null
  created_at: string
  user_profiles: {
    username: string
    full_name: string | null
    avatar_url: string | null
  }
}

const categories = ["Concert Tickets", "Dorm Items", "Preprofessional Help", "Food Truck Line Service"]

export default function ExchangeMainPage() {
  const router = useRouter()
  const [services, setServices] = useState<ExchangePost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchServices = async (category?: string) => {
    try {
      const url = category ? `/api/exchange/posts?category=${encodeURIComponent(category)}` : "/api/exchange/posts"

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch services")
      }

      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
      toast.error("Failed to load services")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleCategoryFilter = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null)
      fetchServices()
    } else {
      setSelectedCategory(category)
      fetchServices(category)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchServices(selectedCategory || undefined)
  }

  const formatPrice = (price: number, negotiability: string) => {
    const formatted = `$${price.toFixed(2)}`
    return negotiability === "negotiable" ? `${formatted} (negotiable)` : formatted
  }

  const renderRating = (rating: number | null, reviewCount: number | null) => {
    if (rating === null || reviewCount === null) {
      return <span className="text-gray-500 text-sm">No rating</span>
    }

    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        <span className="text-gray-500 text-sm">({reviewCount})</span>
      </div>
    )
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Exchange</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                </Button>
                <Button onClick={() => router.push("/exchange/posts")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Service
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="h-auto p-4 text-center"
                  onClick={() => handleCategoryFilter(category)}
                >
                  <div>
                    <div className="font-medium text-sm">{category}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {selectedCategory ? `No services found in ${selectedCategory}` : "No services available"}
              </p>
              <Button onClick={() => router.push("/exchange/posts")}>Post the first service</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {service.category}
                      </Badge>
                      <span className="font-bold text-lg">
                        {formatPrice(service.price, service.price_negotiability)}
                      </span>
                    </div>

                    <h3 className="font-semibold mb-2 line-clamp-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">
                          {service.user_profiles.full_name || service.user_profiles.username}
                        </p>
                        {renderRating(service.rating, service.review_count)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
