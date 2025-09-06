"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SpecLoad() {
  const router = useRouter()

  useEffect(() => {
    // Auto-navigate to main specials page after 2 seconds
    const timer = setTimeout(() => {
      router.push("/exchange/specials")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      {/* Loading Animation */}
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="text-white text-2xl font-bold mb-4"
        >
          Loading BruinBash...
        </motion.div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto"
        />
      </div>
    </motion.div>
  )
}
