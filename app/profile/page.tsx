"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { Settings, Edit, BookOpen, Car, Package, MessageCircle } from "lucide-react"

interface UserPost {
  id: string
  title: string
  category: "academic" | "rideshare" | "exchange"
  created_at: string
  status: "active" | "completed" | "expired"
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const [userPosts, setUserPosts] = useState<UserPost[]>([])
  const [stats, setStats] = useState({
    totalPosts: 0,
    activeRides: 0,
    itemsSold: 0,
    materialsShared: 0,
  })

  useEffect(() => {
    // Mock data
    setUserPosts([
      {
        id: "1",
        title: "CS 101 Study Notes",
        category: "academic",
        created_at: "2024-01-15T10:00:00Z",
        status: "active",
      },
      {
        id: "2",
        title: "Ride to LAX Airport",
        category: "rideshare",
        created_at: "2024-01-14T15:30:00Z",
        status: "completed",
      },
      {
        id: "3",
        title: "MacBook Pro for Sale",
        category: "exchange",
        created_at: "2024-01-13T09:15:00Z",
        status: "active",
      },
    ])

    setStats({
      totalPosts: 12,
      activeRides: 3,
      itemsSold: 5,
      materialsShared: 8,
    })
  }, [])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500"
      case "completed":
        return "bg-blue-500/10 text-blue-500"
      case "expired":
        return "bg-gray-500/10 text-gray-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-safe px-4 py-6 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="text-lg">{getInitials(user?.name || "User")}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user?.name || "User Name"}</h2>
                <p className="text-muted-foreground">{user?.email || "user@university.edu"}</p>
                <p className="text-sm text-muted-foreground mt-1">Member since January 2024</p>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <div className="text-xs text-muted-foreground">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.materialsShared}</div>
                <div className="text-xs text-muted-foreground">Materials</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.activeRides}</div>
                <div className="text-xs text-muted-foreground">Rides</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.itemsSold}</div>
                <div className="text-xs text-muted-foreground">Items Sold</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4 mt-6">
            {userPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getCategoryColor(post.category)}>
                          {getCategoryIcon(post.category)}
                          <span className="ml-1 capitalize">{post.category}</span>
                        </Badge>
                        <Badge variant="secondary" className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{post.title}</CardTitle>
                      <CardDescription>Posted on {new Date(post.created_at).toLocaleDateString()}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm">New message from Sarah Chen</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm">Your study notes were downloaded</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Car className="h-4 w-4 text-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm">Ride to airport completed</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sign Out */}
        <div className="mt-8">
          <Button variant="outline" onClick={signOut} className="w-full bg-transparent">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
