"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase"
import type { UserProfile } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Session timeout")), 3000))

        const {
          data: { session },
        } = (await Promise.race([sessionPromise, timeoutPromise])) as any

        if (!mounted) return

        if (session?.user) {
          setUser(session.user)
          // Fetch profile without blocking
          fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error("Error getting session:", error)
        if (mounted) {
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Optimized profile fetching with caching and timeout
    const fetchUserProfile = async (userId: string) => {
      try {
        // Add timeout to prevent hanging
        const profilePromise = supabase.from("user_profiles").select("*").eq("id", userId).single()

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Profile fetch timeout")), 2000),
        )

        const { data, error } = (await Promise.race([profilePromise, timeoutPromise])) as any

        if (error) {
          console.error("Error fetching user profile:", error)
          // Don't block the app if profile fetch fails
          return
        }

        if (data && mounted) {
          setProfile(data)
        }
      } catch (error) {
        console.error("Profile fetch timeout or error:", error)
        // Continue without profile - don't block the app
      }
    }

    getInitialSession()

    // Listen for auth changes with optimized handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (session?.user) {
        setUser(session.user)
        // Fetch profile asynchronously without blocking
        setTimeout(() => {
          if (mounted) {
            fetchUserProfile(session.user.id)
          }
        }, 100)
      } else {
        setUser(null)
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return <AuthContext.Provider value={{ user, profile, loading, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
