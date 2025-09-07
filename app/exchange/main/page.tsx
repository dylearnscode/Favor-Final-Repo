"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageCircle, RefreshCw } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

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
    id: string
    username: string
    full_name: string | null
    avatar_url: string | null
  }
}

const categories = [
  { id: "all", name: "All", icon: "🏠" },
  { id: "Concert Tickets", name: "Concert Tickets", icon: "🎵" },
  { id: "Dorm Items", name: "Dorm Items", icon: "🛏️" },
  { id: "Preprofessional Help", name: "Preprofessional Help", icon: "💼" },
  { id: "Food Truck Line Service", name: "Food Truck Line Service", icon: "🚚" },
]

export default function ExchangeMainPage() {
  const [services, setServices] = useState<ExchangePost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchServices = async (category = "all") => {
    try {
      const url =
        category === "all" ? "/api/exchange/posts" : `/api/exchange/posts?category=${encodeURIComponent(category)}`

      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        setServices(result.data)
        setError("")
      } else {
        throw new Error(result.error || "Failed to fetch services")
      }
    } catch (err) {
      console.error("Error fetching services:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch services")
      toast({
        title: "Error loading services",
        description: err instanceof Error ? err.message : "Failed to fetch services",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchServices(selectedCategory)
  }, [selectedCategory])

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setLoading(true)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchServices(selectedCategory)
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

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold">Exchange</h1>
            <Button onClick={() => router.push("/exchange/posts")} size="sm">
              Post Service
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Exchange</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={() => router.push("/exchange/posts")} size="sm">
              Post Service
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white border-b p-4">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(category.id)}
              className="whitespace-nowrap"
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div className="p-4 space-y-4">
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600 text-center">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!error && services.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No services found in this category</p>
              <Button onClick={() => router.push("/exchange/posts")} className="mt-4">
                Be the first to post!
              </Button>
            </CardContent>
          </Card>
        )}

        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={service.user_profiles.avatar_url || undefined} />
                    <AvatarFallback>
                      {service.user_profiles.full_name?.[0] || service.user_profiles.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{service.user_profiles.full_name || service.user_profiles.username}</p>
                    <p className="text-sm text-gray-500">@{service.user_profiles.username}</p>
                  </div>
                </div>
                <Badge variant="secondary">{service.category}</Badge>
              </div>

              <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
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
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
