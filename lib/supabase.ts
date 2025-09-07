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
  created_at: string
  updated_at: string
}

export interface ExchangePost {
  id: string
  title: string
  description: string
  price: number
  price_negotiability: "negotiable" | "non-negotiable"
  category: "Concert Tickets" | "Dorm Items" | "Preprofessional Help" | "Food Truck Line Service"
  user_id: string
  status: "active" | "inactive" | "expired"
  duration_days: number
  expires_at: string
  rating?: number
  review_count: number
  created_at: string
  updated_at: string
  user_profiles?: UserProfile
}

export interface RidesharePost {
  id: string
  title: string
  description: string
  departure_location: string
  destination: string
  departure_time: string
  available_seats: number
  price_per_person: number
  user_id: string
  created_at: string
  user_profiles?: UserProfile
}

export interface AcademicPost {
  id: string
  department: string
  course: string
  title: string
  resource: string
  pdf_url: string
  user_id: string
  upload_date: string
  popularity: number
  created_at: string
  file_size?: number
  file_type?: string
  user_profiles?: UserProfile
}

export interface Conversation {
  id: string
  participant_1: string
  participant_2: string
  created_at: string
  last_message_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  is_read: boolean
  read_at?: string
}
