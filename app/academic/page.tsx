"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

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

// Move static data outside component to prevent recreation on each render
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

export default function AcademicPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main page since academic content is on the home page
    router.push("/")
  }, [router])

  return null
}
