"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Star, Clock, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { MessageButton } from "@/components/message-button"
import { useAuth } from "@/components/auth-provider"
import type { ExchangePost } from "@/lib/supabase"

const categories = [
  {
    name: "Concert Tickets",
    icon: "🎵",
    color: "bg-purple-100 text-purple-800",
  },
  {
    name: "Dorm Items",
    icon: "🏠",
    color: "bg-blue-100 text-blue-800",
  },
  {
    name: "Preprofessional Help",
    icon: "💼",
    color: "bg-green-100 text-green-800",
  },
  {
    name: "Food Truck Line Service",
    icon: "🚚",
    color: "bg-orange-100 text-orange-800",
  },
]

export default function ExchangeMain() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [services, setServices] = useState<ExchangePost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch services from database
  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/exchange/posts")
      if (!response.ok) {
        throw new Error("Failed to fetch services")
      }

      const data = await response.json()
      setServices(data.posts || [])
    } catch (error) {
      console.error("Error fetching services:", error)
      setError("Failed to load services. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // Filter services based on search and category
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || service.category === selectedCategory
    return matchesSearch && matchesCategory && service.status === "active"
  })

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName)
  }

  const handleRetry = () => {
    fetchServices()
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">Exchange</h1>
          <Button
            onClick={() => router.push("/exchange/posts")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post Service
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {categories.map((category) => (
            <Card
              key={category.name}
              className={`cursor-pointer transition-all duration-200 ${
                selectedCategory === category.name
                  ? "bg-blue-600 border-blue-500"
                  : "bg-gray-900 border-gray-700 hover:bg-gray-800"
              }`}
              onClick={() => handleCategoryClick(category.name)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3
                  className={`font-semibold text-sm ${
                    selectedCategory === category.name ? "text-white" : "text-gray-300"
                  }`}
                >
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* BruinBash Banner */}
        <Card className="bg-gradient-to-r from-yellow-600 to-blue-600 border-0 mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-lg">🎉 BruinBash Special!</h3>
                <p className="text-yellow-100 text-sm">Exclusive concert ticket deals</p>
              </div>
              <Button
                onClick={() => router.push("/exchange/specials")}
                variant="secondary"
                size="sm"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                View Deals
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Filter Display */}
        {selectedCategory && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-400">Filtered by:</span>
            <Badge className="bg-blue-600 text-white">
              {selectedCategory}
              <button onClick={() => setSelectedCategory(null)} className="ml-2 text-white hover:text-gray-300">
                ×
              </button>
            </Badge>
          </div>
        )}
      </div>

      {/* Services List */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading services...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Something went wrong</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={handleRetry} variant="outline" className="text-white border-gray-600 bg-transparent">
              Try Again
            </Button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              {selectedCategory || searchQuery ? "No services found" : "No services yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {selectedCategory || searchQuery
                ? "Try adjusting your search or filters"
                : "Be the first to post a service!"}
            </p>
            {!selectedCategory && !searchQuery && (
              <Button
                onClick={() => router.push("/exchange/posts")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post a Service
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-white text-lg">{service.title}</h3>
                        <Badge
                          className={
                            categories.find((c) => c.name === service.category)?.color || "bg-gray-100 text-gray-800"
                          }
                        >
                          {categories.find((c) => c.name === service.category)?.icon} {service.category}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{service.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={service.user_profiles?.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gray-700 text-white text-xs">
                            {service.user_profiles?.username?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {service.user_profiles?.username || "Unknown User"}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-gray-400">
                              {service.rating ? service.rating.toFixed(1) : "New"}
                              {service.review_count > 0 && ` (${service.review_count})`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">
                          {Math.ceil((new Date(service.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
                          left
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-400">${service.price}</div>
                        {service.price_negotiability === "negotiable" && (
                          <div className="text-xs text-gray-400">Negotiable</div>
                        )}
                      </div>

                      {user && service.user_id !== profile?.id && (
                        <MessageButton
                          recipientId={service.user_id}
                          recipientName={service.user_profiles?.username || "User"}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav activeTab="exchange" />
    </div>
  )
}
