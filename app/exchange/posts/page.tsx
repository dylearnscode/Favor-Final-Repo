"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"

const categories = ["Concert Tickets", "Dorm Items", "Preprofessional Help", "Food Truck Line Service"]

const durations = [
  { value: "1", label: "1 day" },
  { value: "2", label: "2 days" },
  { value: "3", label: "3 days" },
  { value: "7", label: "1 week" },
  { value: "14", label: "2 weeks" },
  { value: "30", label: "1 month" },
]

export default function PostServicePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dollars: "0",
    cents: "00",
    negotiability: "non-negotiable",
    category: "",
    duration: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("You must be signed in to post a service")
      return
    }

    setLoading(true)

    try {
      const price = Number.parseFloat(`${formData.dollars}.${formData.cents}`)

      const response = await fetch("/api/exchange/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: price,
          price_negotiability: formData.negotiability,
          category: formData.category,
          duration_days: Number.parseInt(formData.duration),
        }),
      })

      if (response.ok) {
        alert("Service posted successfully!")
        router.push("/exchange/main")
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error posting service:", error)
      alert("Failed to post service. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Post a Service</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Service Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter service title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your service"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor="dollars" className="text-sm text-gray-600">
                          Dollars
                        </Label>
                        <Input
                          id="dollars"
                          type="number"
                          min="0"
                          value={formData.dollars}
                          onChange={(e) => setFormData({ ...formData, dollars: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="w-20">
                        <Label htmlFor="cents" className="text-sm text-gray-600">
                          Cents
                        </Label>
                        <Select
                          value={formData.cents}
                          onValueChange={(value) => setFormData({ ...formData, cents: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => i * 10).map((cents) => (
                              <SelectItem key={cents} value={cents.toString().padStart(2, "0")}>
                                {cents.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Negotiability</Label>
                    <Select
                      value={formData.negotiability}
                      onValueChange={(value) => setFormData({ ...formData, negotiability: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="non-negotiable">Non-negotiable</SelectItem>
                        <SelectItem value="negotiable">Negotiable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Post Duration</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Posting..." : "Post Service"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
