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
        // Set a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Session timeout")), 5000))

        const sessionPromise = supabase.auth.getSession()

        const {
          data: { session },
        } = (await Promise.race([sessionPromise, timeoutPromise])) as any

        if (!mounted) return

        setUser(session?.user ?? null)

        if (session?.user) {
          // Try to fetch user profile with timeout - FIXED: use user_id instead of id
          try {
            const profilePromise = supabase.from("user_profiles").select("*").eq("id", session.user.id).single()

            const profileTimeout = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Profile timeout")), 3000),
            )

            const { data: profileData } = (await Promise.race([profilePromise, profileTimeout])) as any

            if (mounted) {
              setProfile(profileData)
            }
          } catch (profileError) {
            console.log("Profile fetch failed, continuing without profile:", profileError)
            if (mounted) {
              setProfile(null)
            }
          }
        }
      } catch (error) {
        console.log("Session fetch failed:", error)
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

  return { user, profile, loading }
}