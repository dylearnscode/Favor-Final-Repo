import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
}

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
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
    }
  }
}
