"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Star, MapPin, Clock, User } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

interface ExchangeItem {
  id: string
  title: string
  price: string
  category: string
  condition: string
  seller: string
  sellerRating: number
  location: string
  timePosted: string
  image?: string
  description?: string
}

const SAMPLE_ITEMS: ExchangeItem[] = [
  {
    id: "1",
    title: "iPhone 14 Pro Max",
    price: "$800",
    category: "Electronics",
    condition: "Like New",
    seller: "Sarah K.",
    sellerRating: 4.9,
    location: "Westwood",
    timePosted: "2 hours ago",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
    description: "Barely used iPhone 14 Pro Max in excellent condition. Comes with original box and charger.",
  },
  {
    id: "2",
    title: "MacBook Air M2",
    price: "$1200",
    category: "Electronics",
    condition: "Excellent",
    seller: "Mike R.",
    sellerRating: 4.8,
    location: "UCLA Campus",
    timePosted: "5 hours ago",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop",
    description: "2022 MacBook Air with M2 chip. Perfect for students. Includes charger and case.",
  },
  {
    id: "3",
    title: "Calculus Textbook",
    price: "$80",
    category: "Books",
    condition: "Good",
    seller: "Emma L.",
    sellerRating: 5.0,
    location: "Dorm Building",
    timePosted: "1 day ago",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
    description: "Stewart Calculus 8th Edition. Some highlighting but all pages intact.",
  },
  {
    id: "4",
    title: "Desk Lamp",
    price: "$25",
    category: "Furniture",
    condition: "Good",
    seller: "Alex M.",
    sellerRating: 4.7,
    location: "Westwood",
    timePosted: "3 days ago",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    description: "Adjustable LED desk lamp. Great for studying. Works perfectly.",
  },
]

const SAMPLE_SERVICES: ExchangeItem[] = [
  {
    id: "5",
    title: "Math Tutoring",
    price: "$30/hr",
    category: "Tutoring",
    condition: "Available",
    seller: "David L.",
    sellerRating: 4.9,
    location: "UCLA Library",
    timePosted: "1 hour ago",
    description: "PhD student offering calculus and statistics tutoring. Flexible schedule.",
  },
  {
    id: "6",
    title: "Car Wash Service",
    price: "$20",
    category: "Services",
    condition: "Available",
    seller: "Jessica M.",
    sellerRating: 4.8,
    location: "Parking Lot 7",
    timePosted: "4 hours ago",
    description: "Professional car wash and detailing. Eco-friendly products used.",
  },
  {
    id: "7",
    title: "Resume Writing",
    price: "$50",
    category: "Services",
    condition: "Available",
    seller: "Chris B.",
    sellerRating: 5.0,
    location: "Online",
    timePosted: "2 days ago",
    description: "Professional resume writing and career consulting. 5+ years experience.",
  },
]

export default function Exchange() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"goods" | "services">("goods")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSliding, setIsSliding] = useState(false)

  const handleMessagesClick = () => {
    setIsSliding(true)
    setTimeout(() => {
      router.push("/messages")
    }, 300)
  }

  const currentItems = activeTab === "goods" ? SAMPLE_ITEMS : SAMPLE_SERVICES

  const filteredItems = currentItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div
      className={`min-h-screen bg-black text-white pb-20 safe-area-inset transition-transform duration-300 ${isSliding ? "-translate-x-full" : ""}`}
    >
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Favor Exchange</h1>
              <p className="text-sm text-gray-400 font-medium">Buy and sell with your community</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800" onClick={handleMessagesClick}>
              <div className="relative">
                <div className="w-8 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 text-white">💬</div>
                </div>
              </div>
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <User className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Buy/Sell Toggle */}
        <div className="relative mb-4">
          <div className="bg-gray-900 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab("goods")}
              className={`flex-1 py-3 px-4 rounded-md font-bold text-sm transition-all duration-200 ${
                activeTab === "goods"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              Buy Goods/Services
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`flex-1 py-3 px-4 rounded-md font-bold text-sm transition-all duration-200 ${
                activeTab === "services"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              Sell Goods/Services
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 h-12"
          />
        </div>

        {/* Post Button */}
        <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12">
          <Plus className="w-5 h-5 mr-2" />
          Post {activeTab === "goods" ? "Item" : "Service"}
        </Button>
      </div>

      {/* Items Grid */}
      <div className="p-4">
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  {item.image && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                        }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-white mb-1 truncate">{item.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-900/50 text-blue-300 text-xs">{item.category}</Badge>
                          <Badge className="bg-green-900/50 text-green-300 text-xs">{item.condition}</Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="font-bold text-xl text-white">{item.price}</div>
                      </div>
                    </div>

                    {item.description && <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                          <AvatarFallback className="bg-gray-700 text-white text-xs">
                            {item.seller.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-300">{item.seller}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-400">{item.sellerRating}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.timePosted}</span>
                        </div>
                      </div>
                    </div>

                    <Button size="sm" className="w-full mt-3 bg-white text-black hover:bg-gray-200 font-bold">
                      {activeTab === "goods" ? "Contact Seller" : "Book Service"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No {activeTab} found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or check back later</p>
          </div>
        )}
      </div>

      <BottomNav activeTab="exchange" />
    </div>
  )
}
