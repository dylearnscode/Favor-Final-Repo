"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function Specials() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/exchange/main")
  }

  const handleBuy = () => {
    // TODO: Navigate to buy flow
    console.log("Buy clicked")
  }

  const handleSell = () => {
    // TODO: Navigate to sell flow
    console.log("Sell clicked")
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden"
    >
      {/* Background Video */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2022395-hd_1920_1080_30fps-9yQLWLILRhMnjYkwSX64oMiZkBvIio.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleBack}
        className="absolute top-6 left-6 z-10 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </motion.button>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold text-white text-center mb-12"
        >
          I want to...
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBuy}
            className="px-12 py-4 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-100 transition-colors min-w-[150px]"
          >
            Buy
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSell}
            className="px-12 py-4 border-2 border-white text-white text-xl font-bold rounded-full hover:bg-white hover:text-black transition-colors min-w-[150px]"
          >
            Sell
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
