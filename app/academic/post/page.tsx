"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"

const departments = [
  "Computer Science (CS)",
  "Mathematics (Math)",
  "Political Science (Pol Sci)",
  "Economics (Econ)",
  "Psychology (Psych)",
  "Biology (Bio)",
  "Chemistry (Chem)",
  "Physics",
  "English",
  "History",
]

export default function PostAcademic() {
  const [formData, setFormData] = useState({
    department: "",
    course: "",
    title: "",
    resource: "",
    uploadedBy: "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [supabaseStatus, setSupabaseStatus] = useState<"loading" | "connected" | "error">("loading")

  const supabase = createClient()

  // Check connection on component mount
  useState(() => {
    checkConnection()
  })

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from("academic_posts").select("count").limit(1)
      setSupabaseStatus(error ? "error" : "connected")
    } catch (err) {
      setSupabaseStatus("error")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (newFiles: File[]) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg", "application/msword", "text/plain"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    const validFiles = newFiles.filter((file) => {
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type`)
        return false
      }
      if (file.size > maxSize) {
        alert(`${file.name} is too large (max 10MB)`)
        return false
      }
      return true
    })

    setFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFileToSupabase = async (file: File) => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `academic/${fileName}`

    const { data, error } = await supabase.storage.from("academic-files").upload(filePath, file)

    if (error) {
      throw error
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("academic-files").getPublicUrl(filePath)

    return publicUrl
  }

  const validateForm = () => {
    const { department, course, title, resource, uploadedBy } = formData
    return department && course && title && resource && uploadedBy && files.length > 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      alert("Please fill in all fields and upload at least one file")
      return
    }

    if (supabaseStatus !== "connected") {
      alert("Database not connected. Please set up Supabase to post materials.")
      return
    }

    setLoading(true)

    try {
      // Upload files to Supabase Storage
      const uploadPromises = files.map((file) => uploadFileToSupabase(file))
      const fileUrls = await Promise.all(uploadPromises)

      // Create posts for each file
      const posts = fileUrls.map((url, index) => ({
        department: formData.department,
        course: formData.course,
        title: formData.title,
        resource: formData.resource,
        pdf_url: url,
        uploaded_by: formData.uploadedBy,
        upload_date: "Just now",
        popularity: Math.floor(Math.random() * 30) + 70, // Random popularity 70-100%
        file_size: files[index].size,
        file_type: files[index].type,
      }))

      const { data, error } = await supabase.from("academic_posts").insert(posts)

      if (error) {
        console.error("Error creating academic post:", error)
        alert("Failed to create post. Please try again.")
      } else {
        alert("Academic material posted successfully!")
        // Redirect back to academic page
        window.location.href = "/"
      }
    } catch (err) {
      console.error("Failed to create academic post:", err)
      alert("Failed to create post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (window.location.href = "/")}
            className="text-white hover:bg-gray-800 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Share Material</h1>
            <p className="text-sm text-gray-400 font-medium">Upload study resources</p>
          </div>
        </div>

        {/* Connection Status */}
        <Alert
          className={`mb-4 ${supabaseStatus === "connected" ? "border-green-800 bg-green-900/20" : "border-red-800 bg-red-900/20"}`}
        >
          <div className="flex items-center gap-2">
            {supabaseStatus === "connected" ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400" />
            )}
            <AlertDescription className={supabaseStatus === "connected" ? "text-green-300" : "text-red-300"}>
              {supabaseStatus === "loading" && "Checking database connection..."}
              {supabaseStatus === "connected" && "Ready to upload materials"}
              {supabaseStatus === "error" && "Database not connected - run SQL script to enable uploads"}
            </AlertDescription>
          </div>
        </Alert>
      </div>

      {/* Form */}
      <div className="p-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Material Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department" className="text-white font-medium">
                  Department *
                </Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {departments.map((dept) => (
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
                <Input
                  id="course"
                  placeholder="e.g., CS 31, Math 31A, Pol Sci 10"
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white font-medium">
                  Course Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Computer Science I"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>

              {/* Resource Type */}
              <div className="space-y-2">
                <Label htmlFor="resource" className="text-white font-medium">
                  Resource Type *
                </Label>
                <Input
                  id="resource"
                  placeholder="e.g., Midterm Practice Questions, Study Guide, Lecture Notes"
                  value={formData.resource}
                  onChange={(e) => handleInputChange("resource", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-white font-medium">Upload Files *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? "border-white bg-gray-800" : "border-gray-600 hover:border-gray-500"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-300 mb-2">Drag and drop files here, or click to select</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Supports PDF, images, Word docs, text files (max 10MB each)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("file-upload")?.click()}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Select Files
                  </Button>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label className="text-white font-medium">Selected Files:</Label>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-white text-sm font-medium">{file.name}</p>
                            <p className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Uploaded By */}
              <div className="space-y-2">
                <Label htmlFor="uploadedBy" className="text-white font-medium">
                  Your Name *
                </Label>
                <Input
                  id="uploadedBy"
                  placeholder="e.g., Sarah Chen"
                  value={formData.uploadedBy}
                  onChange={(e) => handleInputChange("uploadedBy", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12"
                disabled={loading || !validateForm() || supabaseStatus !== "connected"}
              >
                {loading ? "Uploading..." : "Share Material"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
