import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  username: string
  email: string
  full_name?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface ExchangePost {
  id: string
  user_id: string
  title: string
  description: string
  price: number
  price_negotiability: "negotiable" | "non-negotiable"
  category: "Concert Tickets" | "Dorm Items" | "Preprofessional Help" | "Food Truck Line Service"
  duration_days: number
  expires_at: string
  status: "active" | "inactive" | "completed"
  rating?: number
  review_count?: number
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, "created_at" | "updated_at">
        Update: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>
      }
      exchange_posts: {
        Row: ExchangePost
        Insert: Omit<ExchangePost, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<ExchangePost, "id" | "created_at" | "updated_at">>
      }
    }
  }
}
