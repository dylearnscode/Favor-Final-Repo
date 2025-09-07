"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const categories = ["Concert Tickets", "Dorm Items", "Preprofessional Help", "Food Truck Line Service"]

const durations = [
  { value: 1, label: "1 day" },
  { value: 2, label: "2 days" },
  { value: 3, label: "3 days" },
  { value: 7, label: "1 week" },
  { value: 14, label: "2 weeks" },
  { value: 30, label: "1 month" },
]

export default function PostServicePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dollars, setDollars] = useState("")
  const [cents, setCents] = useState("00")
  const [negotiability, setNegotiability] = useState<"negotiable" | "non-negotiable">("non-negotiable")
  const [category, setCategory] = useState("")
  const [duration, setDuration] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("You must be signed in to post a service")
      return
    }

    setLoading(true)

    try {
      // Convert price to decimal
      const price = Number.parseFloat(`${dollars || "0"}.${cents}`)

      if (isNaN(price) || price < 0) {
        toast.error("Please enter a valid price")
        setLoading(false)
        return
      }

      // Get the user's session token
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast.error("Authentication required")
        setLoading(false)
        return
      }

      const response = await fetch("/api/exchange/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price,
          price_negotiability: negotiability,
          category,
          duration_days: Number.parseInt(duration),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create post")
      }

      toast.success("Service posted successfully!")
      router.push("/exchange/main")
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create post")
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
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Concert ticket for Taylor Swift"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your service in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Price</Label>
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center">
                      <span className="text-lg font-medium mr-1">$</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={dollars}
                        onChange={(e) => setDollars(e.target.value)}
                        className="w-20"
                        min="0"
                      />
                      <span className="mx-1">.</span>
                      <Select value={cents} onValueChange={setCents}>
                        <SelectTrigger className="w-16">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                              {i.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Select
                      value={negotiability}
                      onValueChange={(value: "negotiable" | "non-negotiable") => setNegotiability(value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="non-negotiable">Fixed Price</SelectItem>
                        <SelectItem value="negotiable">Negotiable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Post Duration</Label>
                  <Select value={duration} onValueChange={setDuration} required>
                    <SelectTrigger>
                      <SelectValue placeholder="How long should this post be active?" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((dur) => (
                        <SelectItem key={dur.value} value={dur.value.toString()}>
                          {dur.label}
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
