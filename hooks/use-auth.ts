"use client"

import { useState, useEffect } from "react"
import { MOCK_USER, MOCK_PROFILE } from "@/lib/mock-auth"
import type { UserProfile } from "@/lib/mock-auth"

interface MockUser {
  id: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay for realism
    const timer = setTimeout(() => {
      setUser(MOCK_USER)
      setProfile(MOCK_PROFILE)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return { user, profile, loading }
}
