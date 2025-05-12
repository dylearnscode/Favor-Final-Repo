"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { useRef, useState, useEffect } from "react"

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const nodeRef = useRef(null)
  const [showTransition, setShowTransition] = useState(false)

  // Only enable transitions after initial load
  useEffect(() => {
    setShowTransition(true)
  }, [])

  if (!showTransition) {
    return <>{children}</>
  }

  return (
    <TransitionGroup component={null}>
      <CSSTransition key={pathname} nodeRef={nodeRef} timeout={300} classNames="page-transition" unmountOnExit>
        <div ref={nodeRef} className="w-full h-full">
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  )
}
