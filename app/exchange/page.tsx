"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FavorSearchBar } from "@/components/design-system/favor-search-bar"
import { MessageButton } from "@/components/message-button"
import { Package, Plus, Filter, DollarSign } from "lucide-react"
import Link from "next/link"

interface ExchangePost {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: "new" | "like-new" | "good" | "fair"
  author: string
  created_at: string
  images: string[]
}

export default function ExchangePage() {
  const [posts, setPosts] = useState<ExchangePost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedCondition, setSelectedCondition] = useState<string>("all")

  useEffect(() => {
    // Mock data
    setPosts([
      {
        id: "1",
        title: 'MacBook Pro 13" M1 - 2021',
        description: "Barely used MacBook Pro with M1 chip. Includes original charger and box. Perfect for students.",
        price: 1200,
        category: "Electronics",
        condition: "like-new",
        author: "Alex Kim",
        created_at: "2024-01-15T10:00:00Z",
        images: ["/placeholder.jpg"],
      },
      {
        id: "2",
        title: "Calculus Textbook - Stewart 8th Edition",
        description: "Stewart Calculus textbook in excellent condition. No highlighting or writing inside.",
        price: 150,
        category: "Textbooks",
        condition: "good",
        author: "Sarah Chen",
        created_at: "2024-01-14T15:30:00Z",
        images: ["/placeholder.jpg"],
      },
      {
        id: "3",
        title: "Dorm Room Mini Fridge",
        description: "Compact refrigerator perfect for dorm rooms. Energy efficient and quiet.",
        price: 80,
        category: "Furniture",
        condition: "good",
        author: "Mike Johnson",
        created_at: "2024-01-13T09:15:00Z",
        images: ["/placeholder.jpg"],
      },
      {
        id: "4",
        title: "Scientific Calculator - TI-84 Plus",
        description: "Texas Instruments TI-84 Plus graphing calculator. Required for many math courses.",
        price: 60,
        category: "School Supplies",
        condition: "good",
        author: "Emma Davis",
        created_at: "2024-01-12T14:20:00Z",
        images: ["/placeholder.jpg"],
      },
    ])
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    const matchesCondition = selectedCondition === "all" || post.condition === selectedCondition

    return matchesSearch && matchesCategory && matchesCondition
  })

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "like-new":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "good":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "fair":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-safe px-4 py-6 border-b border-border/40">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Exchange</h1>
          <Link href="/exchange/post">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Sell
            </Button>
          </Link>
        </div>

        <FavorSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search items, textbooks, electronics..."
        />
      </div>

      {/* Filters */}
      <div className="px-4 py-4 border-b border-border/40">
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-fit">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Textbooks">Textbooks</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="School Supplies">School Supplies</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCondition} onValueChange={setSelectedCondition}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like-new">Like New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 py-6 space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <DollarSign className="h-3 w-3 mr-1" />${post.price}
                    </Badge>
                    <Badge variant="outline" className={getConditionColor(post.condition)}>
                      {post.condition.replace("-", " ")}
                    </Badge>
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-base">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{post.description}</CardDescription>
                </div>
                <MessageButton userId={post.author} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>By {post.author}</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground">No items found</div>
            <div className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</div>
          </div>
        )}
      </div>
    </div>
  )
}
