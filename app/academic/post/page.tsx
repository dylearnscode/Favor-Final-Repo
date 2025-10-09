"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BookOpen, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Management",
  "Economics",
  "Psychology",
  "Biology",
  "Chemistry",
  "Physics",
  "English",
  "History",
]

const COURSES_BY_DEPARTMENT: Record<string, string[]> = {
  "Computer Science": ["CS 31", "CS 32", "CS 33", "CS 111", "CS 118", "CS 131"],
  Mathematics: ["Math 31A", "Math 31B", "Math 32A", "Math 32B", "Math 33A", "Math 33B"],
  Management: ["Management 1A", "Management 1B", "Management 100", "Management 120"],
  Economics: ["Econ 1", "Econ 2", "Econ 11", "Econ 41", "Econ 101", "Econ 102"],
  Psychology: ["Psych 10", "Psych 100A", "Psych 100B", "Psych 110", "Psych 120A"],
  Biology: ["Bio 1", "Bio 2", "Bio 3", "Bio 100", "Bio 101", "Bio 102"],
  Chemistry: ["Chem 14A", "Chem 14B", "Chem 14C", "Chem 14D", "Chem 153A"],
  Physics: ["Physics 1A", "Physics 1B", "Physics 1C", "Physics 4AL", "Physics 4BL"],
  English: ["English 10A", "English 10B", "English 10C", "English 100", "English 120"],
  History: ["History 1A", "History 1B", "History 1C", "History 100", "History 120"],
}

export default function PostAcademic() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    department: "",
    course: "",
    title: "",
    resource: "",
    pdfUrl: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.department || !formData.course || !formData.title || !formData.resource || !formData.pdfUrl) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      alert("Academic material posted successfully! (Demo mode)")
      router.push("/")
      setLoading(false)
    }, 1000)
  }

  const availableCourses = formData.department ? COURSES_BY_DEPARTMENT[formData.department] || [] : []

  return (
    <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Share Material</h1>
              <p className="text-sm text-gray-400 font-medium">Upload academic resources</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Academic Material Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department" className="text-white font-medium">
                  Department *
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => {
                    handleInputChange("department", value)
                    handleInputChange("course", "") // Reset course when department changes
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept} className="text-white hover:bg-gray-700">
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Course */}
              <div className="space-y-2">
                <Label htmlFor="course" className="text-white font-medium">
                  Course *
                </Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => handleInputChange("course", value)}
                  disabled={!formData.department}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {availableCourses.map((course) => (
                      <SelectItem key={course} value={course} className="text-white hover:bg-gray-700">
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Course Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white font-medium">
                  Course Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Computer Science I"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12"
                  required
                />
              </div>

              {/* Resource Name */}
              <div className="space-y-2">
                <Label htmlFor="resource" className="text-white font-medium">
                  Resource Name *
                </Label>
                <Input
                  id="resource"
                  placeholder="e.g., Midterm Practice Questions, Study Guide, Lecture Notes"
                  value={formData.resource}
                  onChange={(e) => handleInputChange("resource", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12"
                  required
                />
              </div>

              {/* PDF URL */}
              <div className="space-y-2">
                <Label htmlFor="pdfUrl" className="text-white font-medium">
                  PDF URL *
                </Label>
                <Input
                  id="pdfUrl"
                  type="url"
                  placeholder="https://example.com/document.pdf"
                  value={formData.pdfUrl}
                  onChange={(e) => handleInputChange("pdfUrl", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12"
                  required
                />
              </div>

              {/* Description (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white font-medium">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about this resource..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[80px]"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 text-base"
              >
                {loading ? "Uploading..." : "Share Material"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-4 bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <h3 className="font-bold text-white mb-2">📚 Sharing Guidelines</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Only share materials you have permission to distribute</li>
              <li>• Ensure PDFs are accessible and high quality</li>
              <li>• Use descriptive names for easy searching</li>
              <li>• Consider adding context in the description</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
