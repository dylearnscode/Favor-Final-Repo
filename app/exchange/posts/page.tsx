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
import { BottomNav } from "@/components/bottom-nav"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"

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
  const [negotiability, setNegotiability] = useState("non-negotiable")
  const [category, setCategory] = useState("")
  const [duration, setDuration] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a service",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const price = Number.parseFloat(`${dollars || "0"}.${cents}`)

      const response = await fetch("/api/exchange/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

      if (result.success) {
        toast({
          title: "Service Posted!",
          description: "Your service has been posted successfully",
        })

        // Reset form
        setTitle("")
        setDescription("")
        setDollars("")
        setCents("00")
        setNegotiability("non-negotiable")
        setCategory("")
        setDuration("")

        // Navigate back to main page
        router.push("/exchange/main")
      } else {
        throw new Error(result.error || "Failed to post service")
      }
    } catch (error) {
      console.error("Error posting service:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post service",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-lg font-semibold">Post a Service</h1>
            <div className="w-16" />
          </div>
        </div>

        <div className="p-4">
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What service are you offering?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your service in detail..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Price</Label>
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center">
                      <span className="text-lg font-medium mr-1">$</span>
                      <Input
                        type="number"
                        value={dollars}
                        onChange={(e) => setDollars(e.target.value)}
                        placeholder="0"
                        min="0"
                        className="w-20"
                      />
                    </div>
                    <span className="text-lg">.</span>
                    <Select value={cents} onValueChange={setCents}>
                      <SelectTrigger className="w-20">
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
                    <Select value={negotiability} onValueChange={setNegotiability}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="non-negotiable">Fixed</SelectItem>
                        <SelectItem value="negotiable">Negotiable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
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
                  <Label htmlFor="duration">Post Duration</Label>
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

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
