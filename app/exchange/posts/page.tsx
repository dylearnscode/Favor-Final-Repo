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
import { ArrowLeft, Plus } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

export default function PostService() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Navigate back to exchange main
    router.push("/exchange/main")
    setIsSubmitting(false)
  }

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.price.trim() && formData.duration

  return (
    <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-gray-800 p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Post a Service</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Service Listing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white font-medium">
                  Service Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Wait in line for Salpicon, Resume review, Concert ticket pickup"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500">{formData.title.length}/100 characters</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your service in detail. What exactly will you do? What should the buyer expect?"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 min-h-[120px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">{formData.description.length}/500 characters</p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white font-medium">
                  Price *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 pl-8"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500">Set a fair price for your service</p>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-white font-medium">
                  How long to keep this post active? *
                </Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-blue-500">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="1" className="text-white hover:bg-gray-700">
                      1 day
                    </SelectItem>
                    <SelectItem value="2" className="text-white hover:bg-gray-700">
                      2 days
                    </SelectItem>
                    <SelectItem value="3" className="text-white hover:bg-gray-700">
                      3 days
                    </SelectItem>
                    <SelectItem value="4" className="text-white hover:bg-gray-700">
                      4 days
                    </SelectItem>
                    <SelectItem value="5" className="text-white hover:bg-gray-700">
                      5 days
                    </SelectItem>
                    <SelectItem value="6" className="text-white hover:bg-gray-700">
                      6 days
                    </SelectItem>
                    <SelectItem value="7" className="text-white hover:bg-gray-700">
                      7 days
                    </SelectItem>
                    <SelectItem value="indefinite" className="text-white hover:bg-gray-700">
                      Indefinitely
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Your post will automatically expire after this time</p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-400 font-medium py-3"
                >
                  {isSubmitting ? "Posting Service..." : "Post Service"}
                </Button>
              </div>
            </form>

            {/* Guidelines */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2">Posting Guidelines</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Be clear and specific about what you're offering</li>
                <li>• Set reasonable prices for your services</li>
                <li>• Respond promptly to interested buyers</li>
                <li>• Only post services you can actually provide</li>
                <li>• Follow all university policies and guidelines</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav activeTab="exchange" />
    </div>
  )
}
