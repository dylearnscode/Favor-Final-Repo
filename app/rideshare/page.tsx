"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FavorSearchBar } from "@/components/design-system/favor-search-bar"
import { MessageButton } from "@/components/message-button"
import { Car, Plus, Filter, MapPin, Clock, Users } from "lucide-react"
import Link from "next/link"

interface RidesharePost {
  id: string
  title: string
  description: string
  from: string
  to: string
  departureTime: string
  availableSeats: number
  pricePerSeat: number
  author: string
  created_at: string
}

export default function RidesharePage() {
  const [posts, setPosts] = useState<RidesharePost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDestination, setSelectedDestination] = useState<string>("all")

  useEffect(() => {
    // Mock data
    setPosts([
      {
        id: "1",
        title: "Ride to LAX Airport - Friday 3PM",
        description: "Looking for 2 passengers to share the cost. Reliable driver with 5-star rating.",
        from: "UCLA Campus",
        to: "LAX Airport",
        departureTime: "2024-01-19T15:00:00Z",
        availableSeats: 2,
        pricePerSeat: 25,
        author: "Mike Johnson",
        created_at: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        title: "Weekend Trip to San Francisco",
        description: "Road trip to SF for the weekend. Split gas and have fun!",
        from: "USC Campus",
        to: "San Francisco",
        departureTime: "2024-01-20T08:00:00Z",
        availableSeats: 3,
        pricePerSeat: 40,
        author: "Sarah Chen",
        created_at: "2024-01-14T15:30:00Z",
      },
      {
        id: "3",
        title: "Daily Commute to Downtown LA",
        description: "Regular commute to downtown. Looking for someone to share gas costs.",
        from: "Westwood",
        to: "Downtown LA",
        departureTime: "2024-01-16T07:30:00Z",
        availableSeats: 1,
        pricePerSeat: 15,
        author: "Emma Davis",
        created_at: "2024-01-13T09:15:00Z",
      },
      {
        id: "4",
        title: "Beach Day - Santa Monica",
        description: "Going to Santa Monica Beach this Saturday. Join us!",
        from: "UCLA Campus",
        to: "Santa Monica Beach",
        departureTime: "2024-01-20T11:00:00Z",
        availableSeats: 2,
        pricePerSeat: 10,
        author: "Alex Kim",
        created_at: "2024-01-12T14:20:00Z",
      },
    ])
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.to.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDestination = selectedDestination === "all" || post.to.includes(selectedDestination)

    return matchesSearch && matchesDestination
  })

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-safe px-4 py-6 border-b border-border/40">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Rideshare</h1>
          <Link href="/rideshare/post">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Post Ride
            </Button>
          </Link>
        </div>

        <FavorSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search rides, destinations..." />
      </div>

      {/* Filters */}
      <div className="px-4 py-4 border-b border-border/40">
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-fit">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select value={selectedDestination} onValueChange={setSelectedDestination}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Destinations</SelectItem>
              <SelectItem value="Airport">Airport</SelectItem>
              <SelectItem value="San Francisco">San Francisco</SelectItem>
              <SelectItem value="Downtown">Downtown</SelectItem>
              <SelectItem value="Beach">Beach</SelectItem>
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
                      ${post.pricePerSeat}/seat
                    </Badge>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                      <Users className="h-3 w-3 mr-1" />
                      {post.availableSeats} seats
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mb-3">{post.description}</CardDescription>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {post.from} → {post.to}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatDateTime(post.departureTime)}</span>
                    </div>
                  </div>
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
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground">No rides found</div>
            <div className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</div>
          </div>
        )}
      </div>
    </div>
  )
}
