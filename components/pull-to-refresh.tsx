"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false)
  const [pullStartY, setPullStartY] = useState(0)
  const [pullMoveY, setPullMoveY] = useState(0)
  const [pulling, setPulling] = useState(false)
  const [shouldRefresh, setShouldRefresh] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const pullThreshold = 80 // Minimum pull distance to trigger refresh

  useEffect(() => {
    if (shouldRefresh && !refreshing) {
      handleRefresh()
    }
  }, [shouldRefresh])

  const handleRefresh = async () => {
    setRefreshing(true)
    setShouldRefresh(false)

    try {
      await onRefresh()
    } catch (error) {
      console.error("Refresh failed:", error)
    } finally {
      setRefreshing(false)
      setPulling(false)
      setPullMoveY(0)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull to refresh when at the top of the page
    if (window.scrollY === 0) {
      setPulling(true)
      setPullStartY(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling) return

    const touchY = e.touches[0].clientY
    const pullDistance = touchY - pullStartY

    // Only allow pulling down, not up
    if (pullDistance > 0) {
      // Apply resistance to make the pull feel more natural
      const resistance = 0.4
      const newPullMoveY = pullDistance * resistance

      setPullMoveY(newPullMoveY)

      // Determine if we should trigger a refresh
      if (newPullMoveY >= pullThreshold) {
        setShouldRefresh(true)
      } else {
        setShouldRefresh(false)
      }

      // Prevent default scrolling behavior when pulling
      e.preventDefault()
    }
  }

  const handleTouchEnd = () => {
    if (!pulling) return

    if (shouldRefresh && !refreshing) {
      // Keep the indicator visible during refresh
      setPullMoveY(pullThreshold)
    } else {
      // Reset if not refreshing
      setPullMoveY(0)
      setPulling(false)
      setShouldRefresh(false)
    }
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull to refresh indicator */}
      <div
        className={`ptr-element ${shouldRefresh ? "ptr-refresh" : ""} ${refreshing ? "ptr-loading" : ""}`}
        style={{
          transform: `translateY(${pullMoveY - 50}px)`,
          opacity: pullMoveY / pullThreshold,
        }}
      >
        {refreshing ? <div className="ptr-spinner" /> : <div className="ptr-icon">↓</div>}
      </div>

      {/* Content with transform based on pull distance */}
      <div
        style={{
          transform: `translateY(${pullMoveY}px)`,
          transition: pulling ? "none" : "transform 0.2s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  )
}
