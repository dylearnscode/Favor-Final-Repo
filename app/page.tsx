"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FavorSearchBar } from "@/components/design-system/favor-search-bar"
import { FavorLogo } from "@/components/design-system/favor-logo"
import { MessageButton } from "@/components/message-button"
import { useAuth } from "@/hooks/use-auth"
import { BookOpen, Car, Package, MessageCircle, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  title: string
  description: string
  category: "academic" | "rideshare" | "exchange"
  author: string
  created_at: string
  price?: number
}

export default function HomePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Mock data for demonstration
    setPosts([
      {
        id: "1",
        title: "CS 101 Study Notes",
        description: "Comprehensive notes for Computer Science 101 midterm",
        category: "academic",
        author: "Sarah Chen",
        created_at: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        title: "Ride to Airport - Friday 3PM",
        description: "Looking for 2 passengers to share ride to LAX",
        category: "rideshare",
        author: "Mike Johnson",
        created_at: "2024-01-15T09:30:00Z",
      },
      {
        id: "3",
        title: 'MacBook Pro 13" - Like New',
        description: "2022 MacBook Pro, barely used, includes charger",
        category: "exchange",
        author: "Alex Kim",
        created_at: "2024-01-15T08:45:00Z",
        price: 1200,
      },
    ])
  }, [])

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "academic":
        return <BookOpen className="h-4 w-4" />
      case "rideshare":
        return <Car className="h-4 w-4" />
      case "exchange":
        return <Package className="h-4 w-4" />
      default:
        return null
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "rideshare":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "exchange":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-safe px-4 py-6 border-b border-border/40">
        <div className="flex items-center justify-between mb-6">
          <FavorLogo />
          {user && (
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                Profile
              </Button>
            </Link>
          )}
        </div>

        <FavorSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search posts, materials, rides..." />
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">1.2k</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold">450</div>
              <div className="text-xs text-muted-foreground">Posts Today</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <MessageCircle className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold">89</div>
              <div className="text-xs text-muted-foreground">New Messages</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link href="/academic">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <BookOpen className="h-6 w-6" />
              <span className="text-xs">Academic</span>
            </Button>
          </Link>
          <Link href="/rideshare">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Car className="h-6 w-6" />
              <span className="text-xs">Rideshare</span>
            </Button>
          </Link>
          <Link href="/exchange">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Package className="h-6 w-6" />
              <span className="text-xs">Exchange</span>
            </Button>
          </Link>
        </div>

        {/* Recent Posts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Posts</h2>
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getCategoryColor(post.category)}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1 capitalize">{post.category}</span>
                      </Badge>
                      {post.price && <Badge variant="secondary">${post.price}</Badge>}
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
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No posts found</div>
            <div className="text-sm text-muted-foreground mt-1">Try adjusting your search terms</div>
          </div>
        )}
      </div>
    </div>
  )
}
