"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, DollarSign, Calendar, FileText, Type, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BottomNav from "@/components/bottom-nav"

export default function PostService() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceDollars: "",
    priceCents: "00",
    priceNegotiability: "non-negotiable",
    category: "",
    duration: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Convert price to decimal
    const totalPrice = Number.parseFloat(`${formData.priceDollars}.${formData.priceCents}`)

    const postData = {
      title: formData.title,
      description: formData.description,
      price: totalPrice,
      price_negotiability: formData.priceNegotiability,
      category: formData.category,
      duration_days: Number.parseInt(formData.duration),
    }

    try {
      // TODO: Replace with actual API call to create exchange post
      console.log("Service posted:", postData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push("/exchange/main")
    } catch (error) {
      console.error("Error posting service:", error)
    }
  }

  const handleBack = () => {
    router.push("/exchange/main")
  }

  const isFormValid =
    formData.title && formData.description && formData.priceDollars && formData.category && formData.duration

  // Generate cents options (00, 10, 20, ..., 90)
  const centsOptions = Array.from({ length: 10 }, (_, i) => (i * 10).toString().padStart(2, "0"))

  return (
    <div className="min-h-screen bg-black text-white safe-area-inset">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="text-white hover:bg-gray-800 p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Post a Service</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 pb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Service Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Wait in line for Salpicon, Resume review, Concert ticket pickup"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your service in detail. What exactly will you do? What makes you qualified? Any special requirements?"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[120px] resize-none"
                  required
                />
                <p className="text-xs text-gray-500">Be specific about what you're offering and any requirements</p>
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Category
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Concert Tickets" className="text-white hover:bg-gray-700">
                      Concert Tickets
                    </SelectItem>
                    <SelectItem value="Dorm Items" className="text-white hover:bg-gray-700">
                      Dorm Items
                    </SelectItem>
                    <SelectItem value="Preprofessional Help" className="text-white hover:bg-gray-700">
                      Preprofessional Help
                    </SelectItem>
                    <SelectItem value="Food Truck Line Service" className="text-white hover:bg-gray-700">
                      Food Truck Line Service
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Field */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price
                </Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.priceDollars}
                        onChange={(e) => handleInputChange("priceDollars", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12 pl-8"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-20">
                    <Select
                      value={formData.priceCents}
                      onValueChange={(value) => handleInputChange("priceCents", value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {centsOptions.map((cents) => (
                          <SelectItem key={cents} value={cents} className="text-white hover:bg-gray-700">
                            .{cents}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Select
                      value={formData.priceNegotiability}
                      onValueChange={(value) => handleInputChange("priceNegotiability", value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="non-negotiable" className="text-white hover:bg-gray-700">
                          Fixed
                        </SelectItem>
                        <SelectItem value="negotiable" className="text-white hover:bg-gray-700">
                          Negotiable
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Set a fair price for your service</p>
              </div>

              {/* Duration Field */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  How long to keep this post active?
                </Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12">
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
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Choose how long your service should remain visible to other students
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-200 h-12 font-semibold"
                  disabled={!isFormValid}
                >
                  Post Service
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Guidelines Card */}
        <Card className="bg-gray-900 border-gray-800 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Posting Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-300 space-y-2">
              <p>• Be honest and accurate about what you're offering</p>
              <p>• Set reasonable prices for your services</p>
              <p>• Respond promptly to interested students</p>
              <p>• Follow through on your commitments</p>
              <p>• Report any issues or inappropriate behavior</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
