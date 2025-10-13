"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SpecLoad() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/exchange/specials")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading BruinBash...</p>
      </div>
    </div>
  )
}
