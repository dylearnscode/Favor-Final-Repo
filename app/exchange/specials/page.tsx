"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Specials() {
  const router = useRouter()

  const handleBuyClick = () => {
    // Navigate to buy flow
    console.log("Buy clicked")
  }

  const handleSellClick = () => {
    // Navigate to sell flow
    console.log("Sell clicked")
  }

  const handleBackClick = () => {
    router.back()
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/placeholder-concert-video.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
        </video>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10 pt-safe">
        <Button
          onClick={handleBackClick}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 rounded-full p-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold text-white mb-12"
        >
          I want to...
        </motion.h1>

        <div className="flex flex-col gap-6 w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              onClick={handleBuyClick}
              size="lg"
              className="w-full h-16 text-xl font-semibold bg-white text-black hover:bg-gray-200 rounded-xl shadow-lg"
            >
              Buy
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button
              onClick={handleSellClick}
              size="lg"
              variant="outline"
              className="w-full h-16 text-xl font-semibold border-2 border-white text-white hover:bg-white hover:text-black rounded-xl shadow-lg bg-transparent"
            >
              Sell
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
