import { createClient } from "./supabase"
import type { User } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  username: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface SignUpData {
  email: string
  password: string
  username: string
  fullName: string
}

export interface SignInData {
  email: string
  password: string
}

// Validation functions
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validateUsername = (username: string): boolean => {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8
}

// Check if username is available - simplified version
export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const supabase = createClient()

    // Test the connection first
    const { data: testData, error: testError } = await supabase.from("user_profiles").select("count").limit(1)

    // If we can't connect to the table, assume username is available
    if (testError) {
      console.log("Cannot check username availability, assuming available:", testError.message)
      return true
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("username")
      .eq("username", username)
      .maybeSingle()

    if (error) {
      console.log("Username check error, assuming available:", error.message)
      return true
    }

    return !data
  } catch (error) {
    console.log("Username availability check failed, assuming available:", error)
    return true
  }
}

// Sign up function
export const signUp = async ({ email, password, username, fullName }: SignUpData) => {
  try {
    // Validate inputs
    if (!validateEmail(email)) {
      throw new Error("Please enter a valid email address")
    }

    if (!validateUsername(username)) {
      throw new Error("Username must be 3-20 characters and contain only letters, numbers, and underscores")
    }

    if (!validatePassword(password)) {
      throw new Error("Password must be at least 8 characters long")
    }

    const supabase = createClient()

    // Check username availability (non-blocking)
    const isUsernameAvailable = await checkUsernameAvailability(username)
    if (!isUsernameAvailable) {
      throw new Error("Username is already taken")
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    // Try to create user profile, but don't fail if it doesn't work
    if (data.user) {
      try {
        await supabase.from("user_profiles").insert({
          id: data.user.id,
          username,
          email,
          full_name: fullName,
        })
      } catch (profileError) {
        console.log("Profile creation failed, but user was created:", profileError)
      }
    }

    return { user: data.user, session: data.session }
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}

// Sign in function
export const signIn = async ({ email, password }: SignInData) => {
  try {
    if (!validateEmail(email)) {
      throw new Error("Please enter a valid email address")
    }

    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return { user: data.user, session: data.session }
  } catch (error) {
    console.error("Signin error:", error)
    throw error
  }
}

// Sign out function
export const signOut = async () => {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error("Signout error:", error)
    throw error
  }
}

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("user_profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}
