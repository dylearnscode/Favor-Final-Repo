"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "./supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload, ImageIcon } from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
}

interface Subcategory {
  id: number
  category_id: number
  name: string
  slug: string
}

interface ServiceFormProps {
  type: "offering" | "requesting"
}

export function ServiceForm({ type }: ServiceFormProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    image_url: "",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("id")

        if (categoriesError) throw categoriesError

        const { data: subcategoriesData, error: subcategoriesError } = await supabase
          .from("subcategories")
          .select("*")
          .order("id")

        if (subcategoriesError) throw subcategoriesError

        setCategories(categoriesData || [])
        setSubcategories(subcategoriesData || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [supabase])

  useEffect(() => {
    if (formData.category) {
      const selectedCategory = categories.find((cat) => cat.slug === formData.category)
      if (selectedCategory) {
        const filtered = subcategories.filter((sub) => sub.category_id === selectedCategory.id)
        setFilteredSubcategories(filtered)

        // Reset subcategory if the current one doesn't belong to the selected category
        if (formData.subcategory) {
          const subcategoryExists = filtered.some((sub) => sub.slug === formData.subcategory)
          if (!subcategoryExists) {
            setFormData((prev) => ({ ...prev, subcategory: "" }))
          }
        }
      }
    } else {
      setFilteredSubcategories([])
      setFormData((prev) => ({ ...prev, subcategory: "" }))
    }
  }, [formData.category, categories, subcategories])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return null

    try {
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `service-images/${fileName}`

      const { error: uploadError } = await supabase.storage.from("service-images").upload(filePath, imageFile)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("service-images").getPublicUrl(filePath)
      return data.publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Upload image if provided
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage()
      }

      const { error } = await supabase.from("services").insert({
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        subcategory: formData.subcategory || null,
        is_offering: type === "offering",
        user_id: user.id,
        status: "active",
        image_url: imageUrl,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: `Service ${type === "offering" ? "offered" : "requested"} successfully`,
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${type === "offering" ? "offer" : "request"} service`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-secondary border-none">
      <CardHeader>
        <CardTitle>{type === "offering" ? "Offer a Service" : "Request a Service"}</CardTitle>
        <CardDescription>
          {type === "offering"
            ? "Fill out the form below to offer your service to others"
            : "Fill out the form below to request a service from others"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder={
                type === "offering" ? "e.g., Professional Logo Design" : "e.g., Need Help with Math Homework"
              }
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your service in detail..."
              value={formData.description}
              onChange={handleChange}
              required
              className="bg-background border-border min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="1"
              step="0.01"
              placeholder="e.g., 99.99"
              value={formData.price}
              onChange={handleChange}
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)} required>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.category && filteredSubcategories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select value={formData.subcategory} onValueChange={(value) => handleSelectChange("subcategory", value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.slug}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="image">Image (Optional)</Label>
            <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-md border-border bg-background">
              {imagePreview ? (
                <div className="relative w-full max-w-md">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-auto rounded-md mb-4 max-h-[200px] object-contain"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">Upload an image for your service</p>
                </>
              )}
              <div className="flex items-center gap-2">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                    <Upload className="h-4 w-4" />
                    <span>{imagePreview ? "Change Image" : "Upload Image"}</span>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : type === "offering" ? "Offer Service" : "Request Service"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
