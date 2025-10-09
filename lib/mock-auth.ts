// Mock authentication for frontend-only demo
"use client"

export interface UserProfile {
  id: string
  username: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface MockUser {
  id: string
  email: string
}

// Mock current user - always logged in for demo
export const MOCK_USER: MockUser = {
  id: "demo-user-123",
  email: "demo@favorrhive.com",
}

export const MOCK_PROFILE: UserProfile = {
  id: "demo-user-123",
  username: "demo_user",
  email: "demo@favorrhive.com",
  full_name: "Demo User",
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Mock sign in - always succeeds
export const signIn = async (email: string, password: string) => {
  return { user: MOCK_USER, session: { access_token: "mock-token" } }
}

// Mock sign up - always succeeds
export const signUp = async (email: string, password: string, username: string, fullName: string) => {
  return { user: MOCK_USER, session: { access_token: "mock-token" } }
}

// Mock sign out
export const signOut = async () => {
  // No-op for demo
}

// Get current user - always returns mock user
export const getCurrentUser = async () => {
  return MOCK_USER
}

// Get user profile
export const getUserProfile = async (userId: string) => {
  return MOCK_PROFILE
}
