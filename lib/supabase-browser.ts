import { createBrowserClient as createBrowserClientSupabase } from "@supabase/ssr"

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are not set, return null for development
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase environment variables not set. Using mock data.")
    return null
  }

  return createBrowserClientSupabase(supabaseUrl, supabaseAnonKey)
}
