"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PostRidesharePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    from: "",
    to: "",
    departureDate: "",
    departureTime: "",
    availableSeats: 1,
    pricePerSeat: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically submit to your backend
      console.log("Submitting rideshare post:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push("/rideshare")
    } catch (error) {
      console.error("Error submitting post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-safe px-4 py-6 border-b border-border/40">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/rideshare">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Post a Ride</h1>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Share Your Ride</CardTitle>
            <CardDescription>Connect with fellow students and share travel costs</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Ride to LAX Airport - Friday 3PM"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details about your ride..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From *</Label>
                  <Input
                    id="from"
                    placeholder="e.g., UCLA Campus"
                    value={formData.from}
                    onChange={(e) => setFormData((prev) => ({ ...prev, from: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to">To *</Label>
                  <Input
                    id="to"
                    placeholder="e.g., LAX Airport"
                    value={formData.to}
                    onChange={(e) => setFormData((prev) => ({ ...prev, to: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Departure Date *</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, departureDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departureTime">Departure Time *</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, departureTime: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availableSeats">Available Seats *</Label>
                  <Input
                    id="availableSeats"
                    type="number"
                    min="1"
                    max="7"
                    value={formData.availableSeats}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, availableSeats: Number.parseInt(e.target.value) }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerSeat">Price per Seat ($) *</Label>
                  <Input
                    id="pricePerSeat"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerSeat}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, pricePerSeat: Number.parseFloat(e.target.value) }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.title ||
                    !formData.from ||
                    !formData.to ||
                    !formData.departureDate ||
                    !formData.departureTime
                  }
                  className="flex-1"
                >
                  {isSubmitting ? "Posting..." : "Post Ride"}
                </Button>
                <Link href="/rideshare">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
