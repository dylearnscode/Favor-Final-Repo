"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, DollarSign, Clock, FileText, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BottomNav from "@/components/bottom-nav"

export default function PostService() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBack = () => {
    router.push("/exchange/main")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Service posted:", formData)

    // Navigate back to exchange main
    router.push("/exchange/main")
  }

  const isFormValid = formData.title && formData.description && formData.price && formData.duration

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-black z-40 px-4 py-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Post a Service</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Guidelines Card */}
        <Card className="mb-6 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Posting Guidelines</CardTitle>
            <CardDescription className="text-gray-400">
              Follow these tips to create an effective service listing
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300 text-sm space-y-2">
            <p>• Be clear and specific about what you're offering</p>
            <p>• Set a fair price based on time and effort required</p>
            <p>• Include all relevant details in the description</p>
            <p>• Respond promptly to interested buyers</p>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Tag className="w-4 h-4" />
              Service Title
            </label>
            <Input
              type="text"
              placeholder="e.g., Wait in line for Salpicon"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500">{formData.title.length}/100 characters</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <Textarea
              placeholder="Describe your service in detail. What exactly will you do? What should the buyer expect?"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 min-h-[120px]"
              maxLength={500}
              required
            />
            <p className="text-xs text-gray-500">{formData.description.length}/500 characters</p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <DollarSign className="w-4 h-4" />
              Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Clock className="w-4 h-4" />
              How long to keep this post up?
            </label>
            <Select
              value={formData.duration}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
            >
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
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500"
          >
            {isSubmitting ? "Posting..." : "Post Service"}
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  )
}
