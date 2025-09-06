"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import SplitText from "@/components/split-text"

export default function ExchangeEntry() {
  const [showSubtitle, setShowSubtitle] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Show subtitle after main title animation starts
    const subtitleTimer = setTimeout(() => {
      setShowSubtitle(true)
    }, 400)

    // Navigate to main exchange page after animations
    const navigationTimer = setTimeout(() => {
      router.replace("/exchange/main")
    }, 1500)

    return () => {
      clearTimeout(subtitleTimer)
      clearTimeout(navigationTimer)
    }
  }, [router])

  return (
    <motion.div
      initial={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4"
    >
      <div className="text-center">
        <SplitText
          text="Favor Exchange"
          className="text-6xl md:text-8xl font-bold text-white mb-8"
          tag="h1"
          delay={50}
          duration={0.5}
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
            delay={30}
            duration={0.4}
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
    </motion.div>
  )
}
