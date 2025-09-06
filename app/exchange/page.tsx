"use client"

import { useState } from "react"
import { Search, Filter, Star, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ExchangePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    {
      name: "BruinBash",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/521_REpWIE1BUiAwMjMtMjc.jpg-gkjNPhs7XOlhPfkji6OpY8tshQ1vPr.jpeg",
      bgColor: "bg-white",
    },
    {
      name: "Dorm Appliances",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lUz4mv0eL0DHh3LUSF5ugEyFAyferD.png",
      bgColor: "bg-white",
    },
    {
      name: "Preprofessional Help",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YaEScVT1iz8dnYlshrOfBrOns0CBNP.png",
      bgColor: "bg-white",
    },
    {
      name: "Food Truck Waiter",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-09-07%20at%2012.32.26%E2%80%AFAM-DlU56pc3JqTn4aHB537AXEy28JrMXZ.png",
      bgColor: "bg-white",
    },
  ]

  const services = [
    {
      id: 1,
      title: "Wait in line for Salpicon",
      subtitle: "Saves you 40 minutes, Courier swipes for you",
      price: "$12",
      rating: 4.8,
      reviews: 124,
      time: "15-20 Min",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tJPt0XsEADqwGKggB1EOq37NtDl8xm.png",
      featured: true,
    },
    {
      id: 2,
      title: "Coffee Chat with UConsulting Director",
      subtitle: "Get ahead for recruitment.",
      price: "$15",
      rating: 4.9,
      reviews: 89,
      time: "30 Min",
      image: "/business-meeting-collaboration.png",
    },
    {
      id: 3,
      title: "Resume review from Google APM intern",
      subtitle: "70% of my mentees have FAANG offers",
      price: "$20",
      rating: 4.7,
      reviews: 156,
      time: "45 Min",
      image: "/resume-review.jpg",
    },
    {
      id: 4,
      title: "BruinBash VIP Access",
      subtitle: "Skip the line and get priority entry",
      price: "$25",
      rating: 4.6,
      reviews: 78,
      time: "Event Day",
      image: "/concert-tickets.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header with Search */}
      <div className="sticky top-0 bg-black z-10 px-4 py-4 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 whitespace-nowrap bg-transparent"
          >
            <Filter className="h-4 w-4 mr-2" />
            Price
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 whitespace-nowrap bg-transparent"
          >
            Sort
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 whitespace-nowrap bg-transparent"
          >
            Top Rated
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-16 h-16 rounded-full ${category.bgColor} flex items-center justify-center mb-2 mx-auto p-2`}
              >
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs text-gray-300">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Service */}
      <div className="px-4 mb-6">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="relative">
            <img
              src={services[0].image || "/placeholder.svg"}
              alt={services[0].title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs">Featured</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">{services[0].title}</h3>
            <p className="text-gray-400 text-sm mb-2">{services[0].subtitle}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm">{services[0].time}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{services[0].rating}</span>
                  <span className="text-gray-400 text-sm">({services[0].reviews})</span>
                </div>
              </div>
              <span className="font-semibold">{services[0].price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-4">
        <h2 className="text-xl font-semibold mb-4">Available Services</h2>
        <div className="space-y-4">
          {services.slice(1).map((service) => (
            <div key={service.id} className="bg-gray-900 rounded-lg p-4 flex gap-4">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{service.subtitle}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.time}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{service.rating}</span>
                      <span className="text-gray-400 text-sm">({service.reviews})</span>
                    </div>
                  </div>
                  <span className="font-semibold">{service.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Post Button */}
      <div className="fixed bottom-24 right-6 z-20">
        <Button size="lg" className="w-14 h-14 rounded-full bg-white text-black hover:bg-gray-200 shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
