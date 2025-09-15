"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"
import type { UserProfile } from "@/lib/auth"

interface SessionContextType {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  loading: boolean
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession()

        if (!mounted) return

        setSession(initialSession)
        setUser(initialSession?.user ?? null)

        if (initialSession?.user) {
          // Fetch user profile
          try {
            const { data: profileData } = await supabase
              .from("user_profiles")
              .select("*")
              .eq("id", initialSession.user.id)
              .single()

            if (mounted) {
              setProfile(profileData)
            }
          } catch (profileError) {
            console.log("Profile fetch failed:", profileError)
            if (mounted) {
              setProfile(null)
            }
          }
        }
      } catch (error) {
        console.log("Session fetch failed:", error)
        if (mounted) {
          setSession(null)
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return

      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        try {
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", newSession.user.id)
            .single()

          if (mounted) {
            setProfile(profileData)
          }
        } catch (error) {
          console.log("Profile fetch failed during auth change:", error)
          if (mounted) {
            setProfile(null)
          }
        }
      } else {
        if (mounted) {
          setProfile(null)
        }
      }

      if (mounted) {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
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
