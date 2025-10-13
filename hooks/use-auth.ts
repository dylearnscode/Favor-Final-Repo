"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import type { UserProfile } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        console.log("[v0] Starting auth session fetch")
        // Set a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Session timeout")), 3000))

        const sessionPromise = supabase.auth.getSession()

        const {
          data: { session },
        } = (await Promise.race([sessionPromise, timeoutPromise])) as any

        if (!mounted) return

        console.log("[v0] Session fetch complete, user:", !!session?.user)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Try to fetch user profile with timeout - FIXED: use user_id instead of id
          try {
            console.log("[v0] Fetching user profile")
            const profilePromise = supabase.from("user_profiles").select("*").eq("id", session.user.id).single()

            const profileTimeout = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Profile timeout")), 2000),
            )

            const { data: profileData } = (await Promise.race([profilePromise, profileTimeout])) as any

            if (mounted) {
              console.log("[v0] Profile fetch complete:", !!profileData)
              setProfile(profileData)
            }
          } catch (profileError) {
            console.log("[v0] Profile fetch failed, continuing without profile:", profileError)
            if (mounted) {
              setProfile(null)
            }
          }
        }
      } catch (error) {
        console.log("[v0] Session fetch failed:", error)
        if (mounted) {
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (mounted) {
          console.log("[v0] Auth loading complete")
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes with cleanup
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      setUser(session?.user ?? null)

      if (session?.user) {
        try {
          // FIXED: use user_id instead of id
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (mounted) {
            setProfile(profileData)
          }
        } catch (error) {
          console.log("[v0] Profile fetch failed during auth change:", error)
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

  return { user, profile, loading }
}
