"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BottomNav from "@/components/bottom-nav"

export default function ExchangeMain() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handlePostClick = () => {
    router.push("/exchange/posts")
  }

  const handleBruinBashClick = () => {
    router.push("/exchange/specials/specload")
  }

  const categories = [
    {
      id: "concert",
      name: "Concert Tickets",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/521_REpWIE1BUiAwMjMtMjc.jpg-gkjNPhs7XOlhPfkji6OpY8tshQ1vPr.jpeg",
    },
    {
      id: "appliances",
      name: "Dorm Appliances",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lUz4mv0eL0DHh3LUSF5ugEyFAyferD.png",
    },
    {
      id: "professional",
      name: "Preprofessional Help",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YaEScVT1iz8dnYlshrOfBrOns0CBNP.png",
    },
    {
      id: "foodtruck",
      name: "Food Truck Waiter",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-09-07%20at%2012.32.26%E2%80%AFAM-DlU56pc3JqTn4aHB537AXEy28JrMXZ.png",
    },
  ]

  const services = [
    {
      id: 1,
      title: "Wait in line for Salpicon",
      subtitle: "Saves you 40 minutes, Courier swipes for you",
      price: 12,
      rating: 4.8,
      reviews: 156,
      time: "15-20 Min",
      image: "/placeholder.jpg",
      sponsored: false,
    },
    {
      id: 2,
      title: "Coffee Chat with UConsulting Director",
      subtitle: "Get ahead for recruitment.",
      price: 15,
      rating: 4.9,
      reviews: 89,
      time: "30 Min",
      image: "/placeholder.jpg",
      sponsored: false,
    },
    {
      id: 3,
      title: "Resume review from Google APM intern",
      subtitle: "70% of my mentees have FAANG offers",
      price: 20,
      rating: 4.7,
      reviews: 234,
      time: "45 Min",
      image: "/placeholder.jpg",
      sponsored: false,
    },
  ]

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
            variant="outline"
            size="sm"
            className="whitespace-nowrap border-gray-700 text-gray-300 bg-transparent"
          >
            <Filter className="w-4 h-4 mr-2" />
            Price
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="whitespace-nowrap border-gray-700 text-gray-300 bg-transparent"
          >
            Sort
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
            <div key={category.id} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white p-2 mb-2 flex items-center justify-center">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs text-center text-gray-300">{category.name}</span>
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
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{service.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{service.subtitle}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{service.time}</span>
                    <span>
                      ⭐ {service.rating} ({service.reviews})
                    </span>
                    <span className="font-semibold text-white">${service.price}</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gray-800 rounded-lg ml-4"></div>
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
