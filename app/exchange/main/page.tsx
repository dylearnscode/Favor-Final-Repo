"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"
import type { ExchangePost } from "@/lib/supabase"

export default function ExchangeMain() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [services, setServices] = useState<ExchangePost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const handlePostClick = () => {
    router.push("/exchange/posts")
  }

  const handleBruinBashClick = () => {
    router.push("/exchange/specials/specload")
  }

  const categories = [
    {
      id: "Concert Tickets",
      name: "Concert Tickets",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/521_REpWIE1BUiAwMjMtMjc.jpg-gkjNPhs7XOlhPfkji6OpY8tshQ1vPr.jpeg",
    },
    {
      id: "Dorm Items",
      name: "Dorm Appliances",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lUz4mv0eL0DHh3LUSF5ugEyFAyferD.png",
    },
    {
      id: "Preprofessional Help",
      name: "Preprofessional Help",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YaEScVT1iz8dnYlshrOfBrOns0CBNP.png",
    },
    {
      id: "Food Truck Line Service",
      name: "Food Truck Waiter",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-09-07%20at%2012.32.26%E2%80%AFAM-DlU56pc3JqTn4aHB537AXEy28JrMXZ.png",
    },
  ]

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

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-black z-40 px-4 py-4 border-b border-gray-800">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick("all")}
            className="whitespace-nowrap border-gray-700 text-gray-300 bg-transparent"
          >
            <Filter className="w-4 h-4 mr-2" />
            All
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="whitespace-nowrap border-gray-700 text-gray-300 bg-transparent"
          >
            Price
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="whitespace-nowrap border-gray-700 text-gray-300 bg-transparent"
          >
            Top Rated
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div
                className={`w-16 h-16 rounded-full p-2 mb-2 flex items-center justify-center transition-colors ${
                  selectedCategory === category.id ? "bg-blue-600" : "bg-white"
                }`}
              >
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className={`text-xs text-center transition-colors ${
                  selectedCategory === category.id ? "text-blue-400" : "text-gray-300"
                }`}
              >
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Service - BruinBash */}
      <div className="px-4 mb-6">
        <div
          onClick={handleBruinBashClick}
          className="relative rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tJPt0XsEADqwGKggB1EOq37NtDl8xm.png"
            alt="BruinBash Concert"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">Sponsored</span>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-xl font-bold text-white mb-1">BruinBash</h3>
            <p className="text-gray-300 text-sm mb-2">$$ • Concert Tickets</p>
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span>Tonight</span>
              <div className="flex items-center gap-4">
                <span>⭐ 4.9 (2.1k)</span>
                <span>Free Entry</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-4">
        <h2 className="text-xl font-bold mb-4">Available Services</h2>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-400">⚠️ Error loading services</p>
            <p className="text-sm text-red-300 mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchServices(selectedCategory)}
              className="mt-2 border-red-700 text-red-400 hover:bg-red-900/30"
            >
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4">
              {selectedCategory === "all" ? "No services available yet" : `No services in ${selectedCategory} category`}
            </p>
            <Button onClick={handlePostClick} className="bg-blue-600 hover:bg-blue-700">
              Post the first service
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{service.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">{service.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>
                        {service.rating ? service.rating.toFixed(1) : "No rating"}
                        {service.review_count > 0 && ` (${service.review_count})`}
                      </span>
                    </div>
                    <span className="font-semibold text-white">${service.price.toFixed(2)}</span>
                    <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                      {service.price_negotiability}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Posted {new Date(service.created_at).toLocaleDateString()}
                    {service.user_profiles && <span> • by {service.user_profiles.username}</span>}
                  </div>
                </div>
                <div className="w-16 h-16 bg-gray-800 rounded-lg ml-4 flex items-center justify-center">
                  <span className="text-2xl">
                    {service.category === "Concert Tickets" && "🎵"}
                    {service.category === "Dorm Items" && "🏠"}
                    {service.category === "Preprofessional Help" && "💼"}
                    {service.category === "Food Truck Line Service" && "🚚"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Post Button */}
      <button
        onClick={handlePostClick}
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-colors z-30"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      <BottomNav />
    </div>
  )
}
