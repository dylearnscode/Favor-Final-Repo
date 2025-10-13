"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BruinBashSpecials() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleBack = () => {
    router.push("/exchange")
  }

  const handleBuyClick = () => {
    // TODO: Navigate to buy flow
    console.log("Buy clicked")
  }

  const handleSellClick = () => {
    // TODO: Navigate to sell flow
    console.log("Sell clicked")
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-black"
        >
          {/* Video Background */}
          <div className="absolute inset-0">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2022395-hd_1920_1080_30fps-9yQLWLILRhMnjYkwSX64oMiZkBvIio.mp4"
                type="video/mp4"
              />
            </video>
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 left-4 z-10 pt-safe"
          >
            <Button onClick={handleBack} variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </motion.div>

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-white mb-12"
            >
              I want to...
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Button
                onClick={handleBuyClick}
                size="lg"
                className="bg-white text-black hover:bg-gray-200 text-xl font-semibold px-12 py-6 rounded-full min-w-[150px]"
              >
                Buy
              </Button>

              <Button
                onClick={handleSellClick}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black text-xl font-semibold px-12 py-6 rounded-full min-w-[150px] bg-transparent"
              >
                Sell
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
