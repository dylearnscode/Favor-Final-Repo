"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { MOCK_USER, MOCK_PROFILE } from "@/lib/mock-auth"
import type { UserProfile } from "@/lib/mock-auth"

interface MockSession {
  access_token: string
}

interface MockUser {
  id: string
  email: string
}

interface SessionContextType {
  session: MockSession | null
  user: MockUser | null
  profile: UserProfile | null
  loading: boolean
}

export const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<MockSession | null>(null)
  const [user, setUser] = useState<MockUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay for realism
    const timer = setTimeout(() => {
      setSession({ access_token: "mock-token" })
      setUser(MOCK_USER)
      setProfile(MOCK_PROFILE)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return <SessionContext.Provider value={{ session, user, profile, loading }}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
