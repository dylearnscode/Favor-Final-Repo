"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageCircle, RefreshCw, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { BottomNav } from "@/components/bottom-nav"
import { ProtectedRoute } from "@/components/protected-route"

interface ExchangePost {
  id: string
  title: string
  description: string
  price: number
  price_negotiability: "negotiable" | "non-negotiable"
  category: string
  rating?: number
  review_count: number
  created_at: string
  user_profiles?: {
    id: string
    username: string
    full_name?: string
    avatar_url?: string
  }
}

const CATEGORIES = ["Concert Tickets", "Dorm Items", "Preprofessional Help", "Food Truck Line Service"]

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

  const getRatingDisplay = (rating?: number, reviewCount?: number) => {
    if (!rating || !reviewCount) {
      return "No rating"
    }
    return `${rating.toFixed(1)} (${reviewCount} reviews)`
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Exchange</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
              <Button onClick={() => router.push("/exchange/posts")} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Post Service
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => handleCategoryFilter(category)}
                className="h-12 text-sm font-medium"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Services List */}
          <div className="space-y-4">
            {services.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500 mb-4">
                  {selectedCategory ? `No services found in ${selectedCategory}` : "No services available"}
                </p>
                <Button onClick={() => router.push("/exchange/posts")}>Post the first service</Button>
              </Card>
            ) : (
              services.map((service) => (
                <Card key={service.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{service.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {service.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={service.user_profiles?.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback>
                                {service.user_profiles?.username?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {service.user_profiles?.full_name || service.user_profiles?.username || "Anonymous"}
                              </p>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400" />
                                <span className="text-xs text-gray-500">
                                  {getRatingDisplay(service.rating, service.review_count)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-lg text-blue-600">
                              {formatPrice(service.price, service.price_negotiability)}
                            </p>
                            <Button size="sm" className="mt-2">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
