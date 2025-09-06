"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import SplitText from "@/components/split-text"

export default function ExchangeEntry() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/exchange/main")
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <motion.div
      initial={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-black flex flex-col items-center justify-center px-4"
    >
      <div className="text-center">
        <SplitText
          text="Favor Exchange"
          className="text-4xl md:text-6xl font-bold text-white mb-4"
          delay={80}
          duration={0.8}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 50, rotationX: -90 }}
          to={{ opacity: 1, y: 0, rotationX: 0 }}
          threshold={0}
          tag="h1"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-lg text-gray-400 font-medium">Buy and sell services</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
