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
export const validateUCLAEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@g\.ucla\.edu$/.test(email)
}

export const validateUsername = (username: string): boolean => {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8
}

// Check if username is available
export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const supabase = createClient()

    console.log("Checking username availability for:", username)

    const { data, error } = await supabase
      .from("user_profiles")
      .select("username")
      .eq("username", username)
      .maybeSingle()

    console.log("Username check result:", { data, error })

    // If there's an error, log it and handle specific cases
    if (error) {
      console.error("Error checking username:", error)

      // If the table doesn't exist or there's a permission error
      if (error.code === "42P01" || error.code === "PGRST116") {
        console.log("Table might not exist or no rows found, username is available")
        return true
      }

      // For other errors, assume username is available to not block signup
      return true
    }

    // If no data returned, username is available
    const isAvailable = !data
    console.log("Username available:", isAvailable)
    return isAvailable
  } catch (error) {
    console.error("Error checking username availability:", error)
    // On any error, assume username is available to not block signup
    return true
  }
}

// Sign up function
export const signUp = async ({ email, password, username, fullName }: SignUpData) => {
  try {
    console.log("Starting signup process for:", { email, username, fullName })

    // Validate inputs
    if (!validateUCLAEmail(email)) {
      throw new Error("Please use a valid UCLA email address (@g.ucla.edu)")
    }

    if (!validateUsername(username)) {
      throw new Error("Username must be 3-20 characters and contain only letters, numbers, and underscores")
    }

    if (!validatePassword(password)) {
      throw new Error("Password must be at least 8 characters long")
    }

    // Check username availability
    const isUsernameAvailable = await checkUsernameAvailability(username)
    console.log("Username availability check result:", isUsernameAvailable)

    if (!isUsernameAvailable) {
      throw new Error("Username is already taken")
    }

    const supabase = createClient()

    // Sign up with Supabase Auth
    console.log("Creating user with Supabase Auth...")
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
      console.error("Supabase auth signup error:", error)
      throw error
    }

    console.log("User created successfully:", data.user?.id)

    // Create user profile if user was created
    if (data.user) {
      console.log("Creating user profile...")
      const { error: profileError } = await supabase.from("user_profiles").insert({
        id: data.user.id,
        username,
        email,
        full_name: fullName,
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
        // Don't throw here as the user is already created in auth
        // The profile can be created later if needed
      } else {
        console.log("User profile created successfully")
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
    if (!validateUCLAEmail(email)) {
      throw new Error("Please use a valid UCLA email address (@g.ucla.edu)")
    }

    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
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
      throw error
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
