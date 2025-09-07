"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import type { ExchangePost } from "@/lib/supabase"

const categories = [
  { name: "Concert Tickets", icon: "🎵" },
  { name: "Dorm Items", icon: "🏠" },
  { name: "Preprofessional Help", icon: "💼" },
  { name: "Food Truck Line Service", icon: "🚚" },
]

export default function ExchangeMainPage() {
  const router = useRouter()
  const [services, setServices] = useState<ExchangePost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const fetchServices = async (category = "all") => {
    try {
      setLoading(true)
      setError(null)

      const url =
        category === "all" ? "/api/exchange/posts" : `/api/exchange/posts?category=${encodeURIComponent(category)}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`)
      }

      const data = await response.json()
      setServices(data.posts || [])
    } catch (error) {
      console.error("Error fetching services:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch services")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices(selectedCategory)
  }, [selectedCategory])

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName)
  }

  const handleRefresh = () => {
    fetchServices(selectedCategory)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Exchange</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={() => router.push("/exchange/posts")} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Post Service
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick("all")}
            className="whitespace-nowrap"
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(category.name)}
              className="whitespace-nowrap flex items-center gap-2"
            >
              <span>{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">⚠️ Error loading services</p>
              <p className="text-sm text-red-500 mt-1">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2 bg-transparent">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Services List */}
      <div className="p-4 space-y-4">
        {services.length === 0 && !error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">No services available in this category</p>
              <Button onClick={() => router.push("/exchange/posts")}>Post the first service</Button>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <div className="text-right">
                    <p className="font-bold text-lg">${service.price.toFixed(2)}</p>
                    <Badge variant={service.price_negotiability === "negotiable" ? "secondary" : "outline"}>
                      {service.price_negotiability}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 mb-3">{service.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{service.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {service.rating ? service.rating.toFixed(1) : "No rating"}
                      </span>
                      {service.review_count > 0 && (
                        <span className="text-sm text-gray-500">({service.review_count})</span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    Posted {new Date(service.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}
