import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

export function createBrowserClient() {
  return createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
