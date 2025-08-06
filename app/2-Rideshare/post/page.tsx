"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Calendar, Clock, Users, Car } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function PostRide() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    reason: "",
    date: "",
    time: "",
    maxParticipants: "4",
    organizer: "",
  })

  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.destination || !formData.date || !formData.time || !formData.organizer) {
      alert("Please fill in all required fields")
      return
    }

    // Validate date is not in the past
    const selectedDate = new Date(`${formData.date}T${formData.time}`)
    if (selectedDate < new Date()) {
      alert("Please select a future date and time")
      return
    }

    setLoading(true)

    try {
      const datetime = new Date(`${formData.date}T${formData.time}`).toISOString()

      const { error } = await supabase.from("rideshare_posts").insert([
        {
          title: formData.title,
          destination: formData.destination,
          reason: formData.reason || null,
          date: formData.date,
          time: formData.time,
          datetime: datetime,
          max_participants: Number.parseInt(formData.maxParticipants),
          participants: 1, // Organizer is automatically included
          organizer: formData.organizer,
          match_strength: Math.floor(Math.random() * 20) + 80, // Random match strength 80-99%
          distance: `${(Math.random() * 2).toFixed(1)} miles away`, // Random distance for demo
        },
      ])

      if (error) {
        console.error("Error creating ride:", error)
        alert("Error creating ride. Please check your database connection.")
        return
      }

      alert("Ride created successfully!")
      router.push("/rideshare")
    } catch (error) {
      console.error("Error creating ride:", error)
      alert("Error creating ride. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/rideshare">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Create Ride</h1>
              <p className="text-sm text-gray-400 font-medium">Organize a group ride</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ride Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white font-medium">
                  Event Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., SZA Concert, LAX Airport, Beach Day"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12"
                  required
                />
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-white font-medium">
                  Destination *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="destination"
                    placeholder="e.g., SoFi Stadium, Terminal 1, Santa Monica Pier"
                    value={formData.destination}
                    onChange={(e) => handleInputChange("destination", e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12"
                    required
                  />
                </div>
              </div>

              {/* Reason (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-white font-medium">
                  Reason (Optional)
                </Label>
                <Textarea
                  id="reason"
                  placeholder="e.g., Going to see SZA live! Split the Uber cost."
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[80px]"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-white font-medium">
                    Date *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white h-12"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-white font-medium">
                    Time *
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white h-12"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Max Participants */}
              <div className="space-y-2">
                <Label htmlFor="maxParticipants" className="text-white font-medium">
                  Max Participants *
                </Label>
                <Select
                  value={formData.maxParticipants}
                  onValueChange={(value) => handleInputChange("maxParticipants", value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="2" className="text-white hover:bg-gray-700">
                      2 people
                    </SelectItem>
                    <SelectItem value="3" className="text-white hover:bg-gray-700">
                      3 people
                    </SelectItem>
                    <SelectItem value="4" className="text-white hover:bg-gray-700">
                      4 people
                    </SelectItem>
                    <SelectItem value="5" className="text-white hover:bg-gray-700">
                      5 people
                    </SelectItem>
                    <SelectItem value="6" className="text-white hover:bg-gray-700">
                      6 people
                    </SelectItem>
                    <SelectItem value="7" className="text-white hover:bg-gray-700">
                      7 people
                    </SelectItem>
                    <SelectItem value="8" className="text-white hover:bg-gray-700">
                      8 people
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Organizer Name */}
              <div className="space-y-2">
                <Label htmlFor="organizer" className="text-white font-medium">
                  Your Name *
                </Label>
                <Input
                  id="organizer"
                  placeholder="e.g., Maya P."
                  value={formData.organizer}
                  onChange={(e) => handleInputChange("organizer", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 text-base"
              >
                {loading ? "Creating Ride..." : "Create Ride"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-4 bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <h3 className="font-bold text-white mb-2">💡 Tips for a Great Ride</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Be specific about your destination</li>
              <li>• Include pickup/meetup details in the reason</li>
              <li>• Set a realistic departure time</li>
              <li>• Consider traffic and parking time</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
