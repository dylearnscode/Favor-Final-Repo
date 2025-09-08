"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import type { UserProfile } from "@/lib/supabase" // FIXED: Import from supabase.ts instead of auth

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    // Get initial session with timeout
    const getInitialSession = async () => {
      console.log('🔄 Starting auth check...')
      
      try {
        // Set a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Session timeout")), 5000)
        )

        const sessionPromise = supabase.auth.getSession()

        const {
          data: { session },
          error: sessionError
        } = await Promise.race([sessionPromise, timeoutPromise]) as any

        console.log('📋 Session result:', { session: !!session, error: sessionError })

        if (!mounted) return

        setUser(session?.user ?? null)

        if (session?.user) {
          console.log('👤 User found, fetching profile...')
          // Try to fetch user profile with timeout
          try {
            const profilePromise = supabase
              .from("user_profiles")
              .select("*")
              .eq("id", session.user.id)
              .single()

            const profileTimeout = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Profile timeout")), 3000),
            )

            const { data: profileData, error: profileError } = await Promise.race([
              profilePromise, 
              profileTimeout
            ]) as any

            console.log('👤 Profile result:', { profile: !!profileData, error: profileError })

            if (mounted) {
              setProfile(profileData || null)
            }
          } catch (profileError) {
            console.log("Profile fetch failed, continuing without profile:", profileError)
            if (mounted) {
              setProfile(null)
            }
          }
        } else {
          console.log('❌ No user session found')
        }
      } catch (error) {
        console.log("Session fetch failed:", error)
        if (mounted) {
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (mounted) {
          console.log('✅ Auth check complete, setting loading to false')
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes with cleanup
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event)
      
      if (!mounted) return

      setUser(session?.user ?? null)

      if (session?.user) {
        try {
          const { data: profileData, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          console.log('👤 Profile updated:', { profile: !!profileData, error })

          if (mounted) {
            setProfile(profileData || null)
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

  // Debug logging
  console.log('🔍 useAuth state:', { 
    loading, 
    hasUser: !!user, 
    hasProfile: !!profile,
    userId: user?.id 
  })

  return { user, profile, loading }
}
