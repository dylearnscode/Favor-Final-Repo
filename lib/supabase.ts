import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          username: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      rideshare_posts: {
        Row: {
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
        }
        Insert: {
          id?: string
          title: string
          description: string
          departure_location: string
          destination: string
          departure_time: string
          available_seats: number
          price_per_person: number
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          departure_location?: string
          destination?: string
          departure_time?: string
          available_seats?: number
          price_per_person?: number
          user_id?: string
          created_at?: string
        }
      }
      academic_posts: {
        Row: {
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
          file_size: number | null
          file_type: string | null
        }
        Insert: {
          id?: string
          department: string
          course: string
          title: string
          resource: string
          pdf_url: string
          user_id: string
          upload_date?: string
          popularity?: number
          created_at?: string
          file_size?: number | null
          file_type?: string | null
        }
        Update: {
          id?: string
          department?: string
          course?: string
          title?: string
          resource?: string
          pdf_url?: string
          user_id?: string
          upload_date?: string
          popularity?: number
          created_at?: string
          file_size?: number | null
          file_type?: string | null
        }
      }
      exchange_posts: {
        Row: {
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
          rating: number | null
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          price_negotiability?: "negotiable" | "non-negotiable"
          category: "Concert Tickets" | "Dorm Items" | "Preprofessional Help" | "Food Truck Line Service"
          user_id: string
          status?: "active" | "inactive" | "expired"
          duration_days: number
          expires_at?: string
          rating?: number | null
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          price_negotiability?: "negotiable" | "non-negotiable"
          category?: "Concert Tickets" | "Dorm Items" | "Preprofessional Help" | "Food Truck Line Service"
          user_id?: string
          status?: "active" | "inactive" | "expired"
          duration_days?: number
          expires_at?: string
          rating?: number | null
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          participant_1: string
          participant_2: string
          created_at: string
          last_message_at: string
        }
        Insert: {
          id?: string
          participant_1: string
          participant_2: string
          created_at?: string
          last_message_at?: string
        }
        Update: {
          id?: string
          participant_1?: string
          participant_2?: string
          last_message_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          created_at: string
          is_read: boolean
          read_at: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          created_at?: string
          is_read?: boolean
          read_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          is_read?: boolean
          read_at?: string | null
        }
      }
    }
  }
}
