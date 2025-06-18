import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/database.types"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or anon key is missing. Check your environment variables.")
    throw new Error("Supabase configuration is incomplete")
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
