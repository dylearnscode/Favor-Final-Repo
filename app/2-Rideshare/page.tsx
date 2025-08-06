"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Car, Search, MapPin, Clock, Users, Star, ChevronUp, ChevronDown, Calendar } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface RidePost {
  id: string
  title: string
  from_location: string
  to_location: string
  departure_time: string
  available_seats: number
  price_per_person: string
  user_name: string
  user_avatar?: string
  user_rating: number
  created_at: string
  coordinates?: {
    from: { lat: number; lng: number }
    to: { lat: number; lng: number }
  }
}

interface SearchCriteria {
  destination: string
  date: string
  time: string
}

// Popular LA destinations with approximate coordinates
const POPULAR_DESTINATIONS = [
  { name: "LAX Airport", coords: { lat: 33.9425, lng: -118.4081 } },
  { name: "UCLA Campus", coords: { lat: 34.0689, lng: -118.4452 } },
  { name: "Santa Monica Beach", coords: { lat: 34.0195, lng: -118.4912 } },
  { name: "Hollywood Bowl", coords: { lat: 34.1122, lng: -118.3394 } },
  { name: "Dodger Stadium", coords: { lat: 34.0739, lng: -118.24 } },
  { name: "Beverly Hills", coords: { lat: 34.0736, lng: -118.4004 } },
  { name: "Venice Beach", coords: { lat: 33.985, lng: -118.4695 } },
  { name: "Griffith Observatory", coords: { lat: 34.1184, lng: -118.3004 } },
  { name: "SZA Concert - Crypto.com Arena", coords: { lat: 34.043, lng: -118.2673 } },
  { name: "The Forum", coords: { lat: 33.9581, lng: -118.3417 } },
]

const SAMPLE_RIDES: RidePost[] = [
  {
    id: "1",
    title: "UCLA to LAX Airport",
    from_location: "UCLA Campus",
    to_location: "LAX Airport",
    departure_time: "2024-01-20T14:30:00",
    available_seats: 3,
    price_per_person: "$15",
    user_name: "Sarah K.",
    user_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    user_rating: 4.9,
    created_at: "2024-01-15",
    coordinates: {
      from: { lat: 34.0689, lng: -118.4452 },
      to: { lat: 33.9425, lng: -118.4081 },
    },
  },
  {
    id: "2",
    title: "SZA Concert Ride",
    from_location: "UCLA Campus",
    to_location: "SZA Concert - Crypto.com Arena",
    departure_time: "2024-01-25T19:00:00",
    available_seats: 2,
    price_per_person: "$20",
    user_name: "Mike R.",
    user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    user_rating: 4.7,
    created_at: "2024-01-14",
    coordinates: {
      from: { lat: 34.0689, lng: -118.4452 },
      to: { lat: 34.043, lng: -118.2673 },
    },
  },
  {
    id: "3",
    title: "Weekend Beach Trip",
    from_location: "UCLA Campus",
    to_location: "Santa Monica Beach",
    departure_time: "2024-01-21T10:00:00",
    available_seats: 4,
    price_per_person: "$8",
    user_name: "Alex M.",
    user_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    user_rating: 5.0,
    created_at: "2024-01-13",
    coordinates: {
      from: { lat: 34.0689, lng: -118.4452 },
      to: { lat: 34.0195, lng: -118.4912 },
    },
  },
]

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c * 1000 // Convert to meters
}

// Calculate similarity between two strings
const calculateSimilarity = (str1: string, str2: string): number => {
  if (!str1 || !str2) return 0
  const words1 = str1.toLowerCase().split(" ")
  const words2 = str2.toLowerCase().split(" ")
  const commonWords = words1.filter((word) => words2.includes(word))
  return commonWords.length / Math.max(words1.length, words2.length)
}

export default function Rideshare() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [rides, setRides] = useState<RidePost[]>(SAMPLE_RIDES)
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    destination: "",
    date: "",
    time: "12:00",
  })
  const [showSearch, setShowSearch] = useState(false)
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([])
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/auth/signin")
      return
    }

    const fetchRides = async () => {
      try {
        setLoading(true)
        const supabase = createClient()

        // Try to fetch from database, but handle gracefully if table doesn't exist
        const { data, error } = await supabase
          .from("rideshare_posts")
          .select(`
            *,
            user_profiles!rideshare_posts_user_id_fkey (
              username,
              avatar_url
            )
          `)
          .order("created_at", { ascending: false })
          .limit(20)

        if (error) {
          console.error("Error fetching rides:", error)
          // Use sample data if database query fails
          setRides(SAMPLE_RIDES)
        } else if (data && data.length > 0) {
          // Transform database data to match our interface
          const transformedRides = data.map((ride: any) => ({
            id: ride.id,
            title: ride.title || "Untitled Ride",
            from_location: ride.from_location || "Unknown",
            to_location: ride.to_location || ride.destination || "Unknown",
            departure_time: ride.departure_time || ride.datetime || new Date().toISOString(),
            available_seats: ride.available_seats || ride.max_participants || 1,
            price_per_person: ride.price_per_person || "$0",
            user_name: ride.user_profiles?.username || "Unknown User",
            user_avatar: ride.user_profiles?.avatar_url || "",
            user_rating: 4.5, // Default rating
            created_at: ride.created_at,
            coordinates: ride.coordinates,
          }))
          setRides(transformedRides)
        } else {
          // No data in database, use sample data
          setRides(SAMPLE_RIDES)
        }
      } catch (error) {
        console.error("Error:", error)
        // Fallback to sample data on any error
        setRides(SAMPLE_RIDES)
      } finally {
        setLoading(false)
      }
    }

    fetchRides()
  }, [user, authLoading, router])

  // Handle destination search with suggestions
  const handleDestinationChange = useCallback((value: string) => {
    setSearchCriteria((prev) => ({ ...prev, destination: value }))

    if (value.length > 0) {
      const suggestions = POPULAR_DESTINATIONS.filter((dest) => dest.name.toLowerCase().includes(value.toLowerCase()))
        .map((dest) => dest.name)
        .slice(0, 5)
      setDestinationSuggestions(suggestions)
      setShowDestinationSuggestions(true)
    } else {
      setShowDestinationSuggestions(false)
    }
  }, [])

  // Time picker handlers
  const adjustTime = useCallback(
    (direction: "up" | "down") => {
      const [hours, minutes] = searchCriteria.time.split(":").map(Number)
      let newHours = hours
      let newMinutes = minutes

      if (direction === "up") {
        newMinutes += 15
        if (newMinutes >= 60) {
          newMinutes = 0
          newHours = (newHours + 1) % 24
        }
      } else {
        newMinutes -= 15
        if (newMinutes < 0) {
          newMinutes = 45
          newHours = newHours === 0 ? 23 : newHours - 1
        }
      }

      const timeString = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`
      setSearchCriteria((prev) => ({ ...prev, time: timeString }))
    },
    [searchCriteria.time],
  )

  // Calculate match percentage for rides
  const calculateMatchPercentage = useCallback(
    (ride: RidePost): number => {
      if (!searchCriteria.destination && !searchCriteria.date && !searchCriteria.time) {
        return 0
      }

      let score = 0
      let factors = 0

      // Location proximity (35% weight)
      if (searchCriteria.destination) {
        factors++
        const searchDest = POPULAR_DESTINATIONS.find((d) =>
          d.name.toLowerCase().includes(searchCriteria.destination.toLowerCase()),
        )

        if (searchDest && ride.coordinates?.to) {
          const distance = calculateDistance(
            searchDest.coords.lat,
            searchDest.coords.lng,
            ride.coordinates.to.lat,
            ride.coordinates.to.lng,
          )

          if (distance < 500)
            score += 35 // Very close
          else if (distance < 2000)
            score += 25 // Close
          else if (distance < 5000)
            score += 15 // Moderate
          else score += 5 // Far
        }

        // Title similarity (25% weight)
        const titleSimilarity = calculateSimilarity(ride.title, searchCriteria.destination)
        score += titleSimilarity * 25
      }

      // Time proximity (40% weight)
      if (searchCriteria.time) {
        factors++
        const searchTime = new Date(`2024-01-01T${searchCriteria.time}:00`)
        const rideTime = new Date(ride.departure_time)
        const timeDiff = Math.abs(
          searchTime.getHours() * 60 + searchTime.getMinutes() - rideTime.getHours() * 60 - rideTime.getMinutes(),
        )

        if (timeDiff < 30)
          score += 40 // Within 30 minutes
        else if (timeDiff < 60)
          score += 30 // Within 1 hour
        else if (timeDiff < 120)
          score += 20 // Within 2 hours
        else score += 10 // More than 2 hours
      }

      return factors > 0 ? Math.min(Math.round((score / factors) * (100 / 35)), 100) : 0
    },
    [searchCriteria],
  )

  // Filter and sort rides based on search criteria
  const filteredRides = useMemo(() => {
    const hasSearchCriteria = searchCriteria.destination || searchCriteria.date || searchCriteria.time !== "12:00"

    if (!hasSearchCriteria) {
      return rides
    }

    return rides
      .map((ride) => ({
        ...ride,
        matchPercentage: calculateMatchPercentage(ride),
      }))
      .filter((ride) => ride.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
  }, [rides, searchCriteria, calculateMatchPercentage])

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-400">Loading rides...</p>
          </div>
        </div>
        <BottomNav activeTab="rideshare" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Rideshare</h1>
              <p className="text-sm text-gray-400 font-medium">Find rides and share costs</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="w-6 h-6" />
          </Button>
        </div>

        {/* Collapsible Search */}
        {showSearch && (
          <div className="space-y-4 mb-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
            {/* Destination Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">Where are you going?</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search destination..."
                  value={searchCriteria.destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Destination Suggestions */}
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
                  {destinationSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => {
                        setSearchCriteria((prev) => ({ ...prev, destination: suggestion }))
                        setShowDestinationSuggestions(false)
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="date"
                    value={searchCriteria.date}
                    onChange={(e) => setSearchCriteria((prev) => ({ ...prev, date: e.target.value }))}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <div className="flex items-center bg-gray-800 border border-gray-700 rounded-md">
                    <div className="flex-1 pl-10 pr-2 py-2 text-white">{formatTime(searchCriteria.time)}</div>
                    <div className="flex flex-col border-l border-gray-700">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded-none"
                        onClick={() => adjustTime("up")}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded-none"
                        onClick={() => adjustTime("down")}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Search */}
            <Button
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
              onClick={() => {
                setSearchCriteria({ destination: "", date: "", time: "12:00" })
                setShowDestinationSuggestions(false)
              }}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>

      {/* Rides */}
      <div className="p-4">
        <div className="space-y-4">
          {filteredRides.map((ride) => {
            const matchPercentage = "matchPercentage" in ride ? ride.matchPercentage : 0

            return (
              <Card key={ride.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={ride.user_avatar || "/placeholder.svg"}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(ride.user_name || "User")}&background=374151&color=ffffff&size=40`
                        }}
                      />
                      <AvatarFallback className="bg-gray-700 text-white text-sm font-bold">
                        {ride.user_name ? ride.user_name.charAt(0) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white text-sm">{ride.user_name || "Unknown User"}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-400">{ride.user_rating || 0}</span>
                        </div>
                        {matchPercentage > 0 && (
                          <Badge className="bg-green-900/50 text-green-300 text-xs font-medium">
                            {matchPercentage}% match
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-white">{ride.price_per_person || "$0"}</div>
                      <div className="text-xs text-gray-400">per person</div>
                    </div>
                  </div>

                  <h3 className="font-bold text-white mb-2 tracking-tight">{ride.title || "Untitled Ride"}</h3>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-300">
                        {ride.from_location || "Unknown"} → {ride.to_location || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {ride.departure_time
                            ? new Date(ride.departure_time).toLocaleDateString() +
                              " at " +
                              new Date(ride.departure_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Time TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{ride.available_seats || 0} seats</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Posted {ride.created_at ? new Date(ride.created_at).toLocaleDateString() : "Unknown"}
                    </div>
                    <Button size="sm" className="bg-white text-black hover:bg-gray-200 font-bold">
                      Request Ride
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredRides.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No rides found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <BottomNav activeTab="rideshare" />
    </div>
  )
}
