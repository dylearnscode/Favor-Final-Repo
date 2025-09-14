"use client"

import type React from "react"
import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, Plus } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { createClient } from "@/lib/supabase"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import HiveLoadingScreen from "@/components/hive-loading-screen"

interface AcademicPost {
  id: string
  department: string
  course: string
  title: string
  resource: string
  pdf_url: string
  uploaded_by: string
  upload_date: string
  popularity: number
  file_type?: string
  file_size?: number
}

const SAMPLE_ACADEMIC_POSTS: AcademicPost[] = [
  {
    id: "1",
    department: "Computer Science",
    course: "CS 31",
    title: "Introduction to Computer Science I",
    resource: "Midterm Practice Questions",
    pdf_url: "https://web.cs.ucla.edu/classes/fall23/cs31/Exams/midterm_practice.pdf",
    uploaded_by: "Sarah Chen",
    upload_date: "2 days ago",
    popularity: 95,
    file_type: "application/pdf",
    file_size: 1024000,
  },
  {
    id: "2",
    department: "Management",
    course: "Management 1A",
    title: "Principles of Management",
    resource: "Buffet's Annual Letter Worksheet",
    pdf_url: "https://www.polisci.ucla.edu/sites/default/files/study_guide_final.pdf",
    uploaded_by: "Marcus Johnson",
    upload_date: "1 week ago",
    popularity: 87,
    file_type: "application/pdf",
    file_size: 2048000,
  },
  {
    id: "3",
    department: "Computer Science",
    course: "CS 111",
    title: "Operating Systems Principles",
    resource: "Project 2 Solution Guide",
    pdf_url: "https://web.cs.ucla.edu/classes/fall23/cs111/projects/project2_solution.pdf",
    uploaded_by: "Alex Kim",
    upload_date: "3 days ago",
    popularity: 92,
    file_type: "application/pdf",
    file_size: 1536000,
  },
  {
    id: "4",
    department: "Mathematics",
    course: "Math 31A",
    title: "Differential and Integral Calculus",
    resource: "Chapter 5 Practice Problems",
    pdf_url: "https://www.math.ucla.edu/~tao/resource/general/math31a/practice_ch5.pdf",
    uploaded_by: "Emma Rodriguez",
    upload_date: "5 days ago",
    popularity: 78,
    file_type: "application/pdf",
    file_size: 896000,
  },
  {
    id: "5",
    department: "Economics",
    course: "Econ 1",
    title: "Principles of Economics",
    resource: "Final Exam Study Guide",
    pdf_url: "https://example.com/econ1-final.pdf",
    uploaded_by: "David Park",
    upload_date: "4 days ago",
    popularity: 83,
    file_type: "application/pdf",
    file_size: 1200000,
  },
]

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
] as const

const COURSES_BY_DEPARTMENT: Record<string, readonly string[]> = {
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
} as const

const supabase = createClient()

export default function Academic() {
  const router = useRouter()
  const [hasAuth, setHasAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [selectedCourse, setSelectedCourse] = useState("All Courses")
  const [searchQuery, setSearchQuery] = useState("")
  const [academicPosts, setAcademicPosts] = useState<AcademicPost[]>([])

  useEffect(() => {
    const bypassAuth = localStorage.getItem("favor_bypass_auth") === "true"

    if (bypassAuth) {
      setHasAuth(true)
      setLoading(false)
    } else {
      router.push("/auth/signin")
    }
  }, [router])

  const filteredPosts = useMemo(() => {
    let filtered = academicPosts

    if (selectedDepartment !== "All Departments") {
      filtered = filtered.filter((post) => post.department === selectedDepartment)
    }

    if (selectedCourse !== "All Courses") {
      filtered = filtered.filter((post) => post.course === selectedCourse)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.course.toLowerCase().includes(query) ||
          post.resource.toLowerCase().includes(query) ||
          post.department.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [academicPosts, selectedDepartment, selectedCourse, searchQuery])

  const isSearching = useMemo(() => {
    return selectedDepartment !== "All Departments" || selectedCourse !== "All Courses" || searchQuery !== ""
  }, [selectedDepartment, selectedCourse, searchQuery])

  const availableCourses = useMemo(() => {
    return selectedDepartment && selectedDepartment !== "All Departments"
      ? COURSES_BY_DEPARTMENT[selectedDepartment] || []
      : []
  }, [selectedDepartment])

  const postsToShow = isSearching ? filteredPosts : academicPosts

  const loadAcademicPosts = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("academic_posts")
        .select("id, department, course, title, resource, pdf_url, uploaded_by, upload_date, popularity")
        .order("popularity", { ascending: false })
        .limit(100)

      if (error) {
        console.log("Database not connected, using sample data")
        setAcademicPosts(SAMPLE_ACADEMIC_POSTS)
      } else {
        setAcademicPosts(data || [])
      }
    } catch (error) {
      console.error("Error loading academic posts:", error)
      setAcademicPosts(SAMPLE_ACADEMIC_POSTS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (hasAuth) {
      loadAcademicPosts()
    }
  }, [loadAcademicPosts, hasAuth])

  const handleDepartmentChange = useCallback((department: string) => {
    setSelectedDepartment(department)
    setSelectedCourse("All Courses")
  }, [])

  const handleCourseChange = useCallback((course: string) => {
    setSelectedCourse(course)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handlePDFView = useCallback((pdfUrl: string) => {
    window.open(pdfUrl, "_blank", "noopener,noreferrer")
  }, [])

  const handleLoadingComplete = useCallback(() => {
    setShowLoadingScreen(false)
  }, [])

  if (showLoadingScreen) {
    return <HiveLoadingScreen onComplete={handleLoadingComplete} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading academic materials...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!hasAuth) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Academic Hive</h1>
              <p className="text-sm text-amber-400 font-medium">Collaborative learning community</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-amber-900/20 hover:text-amber-400"
            onClick={() => router.push("/academic/post")}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="w-32">
            <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white focus:border-amber-500">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="All Departments">All Departments</SelectItem>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept} className="text-white">
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select
              value={selectedCourse}
              onValueChange={handleCourseChange}
              disabled={!selectedDepartment || selectedDepartment === "All Departments"}
            >
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white focus:border-amber-500">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="All Courses">All Courses</SelectItem>
                {availableCourses.map((course) => (
                  <SelectItem key={course} value={course} className="text-white">
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search resources..."
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {postsToShow.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No materials found</h3>
            <p className="text-gray-500">
              {isSearching ? "Try adjusting your search criteria" : "No academic materials available yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {postsToShow.map((post) => (
              <div
                key={post.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800 hover:border-amber-900/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1 truncate">
                    {post.course} – {post.resource}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{post.title}</p>
                </div>
                <Button
                  onClick={() => handlePDFView(post.pdf_url)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-600 hover:to-amber-700 font-medium px-6 ml-4 flex-shrink-0"
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav activeTab="academic" />
    </div>
  )
}
