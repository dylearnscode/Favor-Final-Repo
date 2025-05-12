import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { CreatePostForm } from "@/components/create-post-form"
import { MobileHeader } from "@/components/mobile-header"
import { MobileNav } from "@/components/mobile-nav"

export default async function CreatePostPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login")
  }

  return (
    <main className="flex flex-col min-h-screen bg-black pb-safe">
      <MobileHeader />
      <div className="flex-1 px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Create a Post</h1>
        <CreatePostForm />
      </div>
      <MobileNav />
    </main>
  )
}
