"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SplitText from "@/components/split-text"

export default function ExchangeEntry() {
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Show subtitle after main title animation starts
    const subtitleTimer = setTimeout(() => {
      setShowSubtitle(true)
    }, 800)

    // Show loading screen if page takes too long to load
    const loadingTimer = setTimeout(() => {
      setShowLoading(true)
    }, 3000)

    // Navigate to main exchange page after animations
    const navigationTimer = setTimeout(() => {
      router.push("/exchange")
    }, 2500)

    return () => {
      clearTimeout(subtitleTimer)
      clearTimeout(loadingTimer)
      clearTimeout(navigationTimer)
    }
  }, [router])

  if (showLoading) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading marketplace...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <SplitText
          text="Favor Exchange"
          className="text-6xl md:text-8xl font-bold text-white mb-8"
          tag="h1"
          delay={80}
          duration={0.8}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 60, rotationX: -90 }}
          to={{ opacity: 1, y: 0, rotationX: 0 }}
          threshold={0}
          rootMargin="0px"
          textAlign="center"
        />

        {showSubtitle && (
          <SplitText
            text="Buy and sell services"
            className="text-xl md:text-2xl text-gray-400 font-light"
            tag="p"
            delay={60}
            duration={0.6}
            ease="power2.out"
            splitType="chars"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0}
            rootMargin="0px"
            textAlign="center"
          />
        )}
      </div>
    </div>
  )
}
