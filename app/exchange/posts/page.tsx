"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, DollarSign, Calendar, FileText, Type } from "lucide-react"
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
    price: "",
    duration: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle form submission
    console.log("Service posted:", formData)
    router.push("/exchange/main")
  }

  const handleBack = () => {
    router.push("/exchange/main")
  }

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

              {/* Price Field */}
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
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12 pl-8"
                    min="0"
                    step="0.01"
                    required
                  />
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
                    <SelectItem value="indefinite" className="text-white hover:bg-gray-700">
                      Indefinitely
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
                  disabled={!formData.title || !formData.description || !formData.price || !formData.duration}
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
