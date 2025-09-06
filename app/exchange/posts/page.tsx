"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, DollarSign, FileText, Clock, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
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
    console.log("Submitting service:", formData)

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    router.push("/exchange/main")
  }

  const isFormValid = formData.title && formData.description && formData.price && formData.duration

  return (
    <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="sm" className="text-white hover:bg-gray-800 p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Post a Service</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Guidelines Card */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white text-lg">Posting Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 text-sm space-y-2">
            <p>• Be clear and specific about your service</p>
            <p>• Set fair and competitive pricing</p>
            <p>• Respond promptly to inquiries</p>
            <p>• Only post services you can actually provide</p>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Service Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Wait in line for Salpicon"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              maxLength={100}
            />
            <p className="text-xs text-gray-500">{formData.title.length}/100 characters</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your service in detail. What exactly will you do? When are you available?"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 min-h-[120px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500">{formData.description.length}/500 characters</p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="pl-8 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-white flex items-center gap-2">
              <Clock className="w-4 h-4" />
              How long to keep this post up?
            </Label>
            <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="2">2 days</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="4">4 days</SelectItem>
                <SelectItem value="5">5 days</SelectItem>
                <SelectItem value="6">6 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="indefinite">Indefinitely</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full h-12 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isSubmitting ? "Posting..." : "Post Service"}
          </Button>
        </form>
      </div>

      <BottomNav activeTab="exchange" />
    </div>
  )
}
