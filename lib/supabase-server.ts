import { createServerClient as createServerClientSupabase } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

export function createServerClient() {
  const cookieStore = cookies()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or anon key is missing. Check your environment variables.")
    throw new Error("Supabase configuration is incomplete")
  }

  return createServerClientSupabase<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
