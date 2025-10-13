"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function HiveLoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<"flying" | "entering" | "peeking" | "complete">("flying")

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("entering"), 1000)
    const timer2 = setTimeout(() => setStage("peeking"), 2000)
    const timer3 = setTimeout(() => {
      setStage("complete")
      onComplete()
    }, 3500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {stage !== "complete" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-amber-950 flex items-center justify-center z-50"
        >
          <div className="relative flex flex-col items-center">
            {/* Hive SVG */}
            <motion.svg
              width="120"
              height="100"
              viewBox="0 0 120 100"
              className="relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {/* Hive structure */}
              <path d="M60 10 L90 30 L90 70 L60 90 L30 70 L30 30 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
              {/* Hexagonal cells */}
              <path d="M45 25 L55 20 L65 25 L65 35 L55 40 L45 35 Z" fill="#FCD34D" />
              <path d="M65 25 L75 20 L85 25 L85 35 L75 40 L65 35 Z" fill="#FCD34D" />
              <path d="M35 40 L45 35 L55 40 L55 50 L45 55 L35 50 Z" fill="#FCD34D" />
              <path d="M55 40 L65 35 L75 40 L75 50 L65 55 L55 50 Z" fill="#FCD34D" />
              <path d="M75 40 L85 35 L95 40 L95 50 L85 55 L75 50 Z" fill="#FCD34D" />

              {/* Entrance hole */}
              <circle cx="85" cy="45" r="8" fill="#92400E" />
            </motion.svg>

            {/* Bee SVG */}
            <motion.div
              className="absolute"
              initial={{ x: 300, y: 20 }}
              animate={{
                x: stage === "flying" ? 100 : stage === "entering" ? 85 : 80,
                y: stage === "flying" ? 20 : stage === "entering" ? 45 : 55,
                scale: stage === "entering" ? 0.6 : stage === "peeking" ? 0.8 : 1,
              }}
              transition={{
                duration: stage === "flying" ? 1 : 0.8,
                type: "easeInOut",
              }}
            >
              <svg width="40" height="30" viewBox="0 0 40 30">
                {/* Bee body */}
                <ellipse cx="20" cy="15" rx="12" ry="8" fill="#FCD34D" />
                <ellipse cx="20" cy="15" rx="10" ry="6" fill="#F59E0B" />

                {/* Bee stripes */}
                <rect x="12" y="12" width="2" height="6" fill="#92400E" />
                <rect x="18" y="12" width="2" height="6" fill="#92400E" />
                <rect x="24" y="12" width="2" height="6" fill="#92400E" />

                {/* Wings */}
                <motion.ellipse
                  cx="10"
                  cy="10"
                  rx="8"
                  ry="4"
                  fill="rgba(255,255,255,0.7)"
                  animate={{
                    scaleY: [1, 0.3, 1],
                    opacity: [0.7, 0.9, 0.7],
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.ellipse
                  cx="30"
                  cy="10"
                  rx="8"
                  ry="4"
                  fill="rgba(255,255,255,0.7)"
                  animate={{
                    scaleY: [1, 0.3, 1],
                    opacity: [0.7, 0.9, 0.7],
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.1,
                  }}
                />

                {/* Eyes */}
                <circle cx="16" cy="12" r="2" fill="#000" />
                <circle cx="24" cy="12" r="2" fill="#000" />
                <circle cx="16.5" cy="11.5" r="0.5" fill="#fff" />
                <circle cx="24.5" cy="11.5" r="0.5" fill="#fff" />

                {/* Antennae */}
                <line x1="18" y1="8" x2="16" y2="4" stroke="#92400E" strokeWidth="1" />
                <line x1="22" y1="8" x2="24" y2="4" stroke="#92400E" strokeWidth="1" />
                <circle cx="16" cy="4" r="1" fill="#92400E" />
                <circle cx="24" cy="4" r="1" fill="#92400E" />
              </svg>
            </motion.div>

            {/* Hive text */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <h1 className="text-4xl font-bold text-amber-400 font-[family-name:var(--font-work-sans)] text-center">
                Hive
              </h1>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
