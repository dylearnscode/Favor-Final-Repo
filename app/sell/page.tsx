import { createServerClient } from "@/lib/supabase-server"
import { MobileHeader } from "@/components/mobile-header"
import { MobileSearchBar } from "@/components/mobile-search-bar"
import { CategorySlider } from "@/components/category-slider"
import { ServicesList } from "@/components/services-list"
import { MobileNav } from "@/components/mobile-nav"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SellPage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login")
  }

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("id")

  // Fetch user's service requests
  const { data: myServices } = await supabase
    .from("services")
    .select("*, profiles(username, avatar_url, rating, description)")
    .eq("user_id", session.user.id)
    .eq("is_offering", false)
    .order("created_at", { ascending: false })

  // Fetch other service requests
  const { data: otherServices } = await supabase
    .from("services")
    .select("*, profiles(username, avatar_url, rating, description)")
    .neq("user_id", session.user.id)
    .eq("status", "active")
    .eq("is_offering", false)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <main className="flex flex-col min-h-screen bg-black pb-safe">
      <MobileHeader />
      <MobileSearchBar />
      <CategorySlider categories={categories || []} />

      <div className="flex-1 px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Service Requests</h2>
          <Link href="/create-post?type=requesting">
            <Button size="sm" variant="outline">
              Post Request
            </Button>
          </Link>
        </div>

        {myServices && myServices.length > 0 ? (
          <ServicesList services={myServices || []} />
        ) : (
          <div className="bg-gray-900 rounded-lg p-4 text-center mb-6">
            <p className="text-gray-400 mb-2">You haven't posted any service requests yet</p>
            <Link href="/create-post?type=requesting">
              <Button size="sm">Post a Request</Button>
            </Link>
          </div>
        )}

        <h2 className="text-lg font-semibold mt-8 mb-4">Service Requests</h2>
        <ServicesList services={otherServices || []} />
      </div>

      <MobileNav />
    </main>
  )
}
