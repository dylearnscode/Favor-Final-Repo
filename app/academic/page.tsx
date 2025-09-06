"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FavorSearchBar } from "@/components/design-system/favor-search-bar"
import { MessageButton } from "@/components/message-button"
import { BookOpen, FileText, Calculator, Beaker, Plus, Filter } from "lucide-react"
import Link from "next/link"

interface AcademicPost {
  id: string
  title: string
  description: string
  subject: string
  course: string
  type: "notes" | "textbook" | "study-guide" | "assignment"
  author: string
  created_at: string
  downloads: number
}

export default function AcademicPage() {
  const [posts, setPosts] = useState<AcademicPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  useEffect(() => {
    // Mock data
    setPosts([
      {
        id: "1",
        title: "Introduction to Computer Science - Complete Notes",
        description:
          "Comprehensive notes covering all topics from CS 101 including algorithms, data structures, and programming fundamentals.",
        subject: "Computer Science",
        course: "CS 101",
        type: "notes",
        author: "Sarah Chen",
        created_at: "2024-01-15T10:00:00Z",
        downloads: 45,
      },
      {
        id: "2",
        title: "Calculus I Textbook - 12th Edition",
        description: "Stewart Calculus textbook in excellent condition. Includes solution manual.",
        subject: "Mathematics",
        course: "MATH 151",
        type: "textbook",
        author: "Mike Johnson",
        created_at: "2024-01-14T15:30:00Z",
        downloads: 23,
      },
      {
        id: "3",
        title: "Organic Chemistry Study Guide",
        description: "Study guide for CHEM 201 midterm exam. Includes practice problems and solutions.",
        subject: "Chemistry",
        course: "CHEM 201",
        type: "study-guide",
        author: "Emma Davis",
        created_at: "2024-01-13T09:15:00Z",
        downloads: 67,
      },
      {
        id: "4",
        title: "Physics Lab Report Template",
        description: "Professional lab report template that follows department guidelines.",
        subject: "Physics",
        course: "PHYS 101",
        type: "assignment",
        author: "Alex Kim",
        created_at: "2024-01-12T14:20:00Z",
        downloads: 89,
      },
    ])
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === "all" || post.subject === selectedSubject
    const matchesType = selectedType === "all" || post.type === selectedType

    return matchesSearch && matchesSubject && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "notes":
        return <FileText className="h-4 w-4" />
      case "textbook":
        return <BookOpen className="h-4 w-4" />
      case "study-guide":
        return <Calculator className="h-4 w-4" />
      case "assignment":
        return <Beaker className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "notes":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "textbook":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "study-guide":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "assignment":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-safe px-4 py-6 border-b border-border/40">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Academic Materials</h1>
          <Link href="/academic/post">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Post
            </Button>
          </Link>
        </div>

        <FavorSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search materials, courses, subjects..."
        />
      </div>

      {/* Filters */}
      <div className="px-4 py-4 border-b border-border/40">
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-fit">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="notes">Notes</SelectItem>
              <SelectItem value="textbook">Textbooks</SelectItem>
              <SelectItem value="study-guide">Study Guides</SelectItem>
              <SelectItem value="assignment">Assignments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 py-6 space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getTypeColor(post.type)}>
                      {getTypeIcon(post.type)}
                      <span className="ml-1 capitalize">{post.type.replace("-", " ")}</span>
                    </Badge>
                    <Badge variant="secondary">{post.course}</Badge>
                  </div>
                  <CardTitle className="text-base">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{post.description}</CardDescription>
                </div>
                <MessageButton userId={post.author} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>By {post.author}</span>
                  <span>{post.downloads} downloads</span>
                </div>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground">No academic materials found</div>
            <div className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</div>
          </div>
        )}
      </div>
    </div>
  )
}
