import { createServerClient } from "@/lib/supabase-server"
import { MobileHeader } from "@/components/mobile-header"
import { MobileSearchBar } from "@/components/mobile-search-bar"
import { CategorySlider } from "@/components/category-slider"
import { ServicesList } from "@/components/services-list"
import { MobileNav } from "@/components/mobile-nav"

export default async function Home() {
  const supabase = createServerClient()

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("id")

  // Fetch popular services
  const { data: popularServices } = await supabase
    .from("services")
    .select("*, profiles(username, avatar_url, rating, description)")
    .eq("status", "active")
    .eq("is_offering", true)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <main className="flex flex-col min-h-screen bg-black pb-safe">
      <MobileHeader />
      <MobileSearchBar />
      <CategorySlider categories={categories || []} />

      <div className="flex-1 px-4 py-4">
        <h2 className="text-lg font-semibold mb-4">Popular Services</h2>
        <ServicesList services={popularServices || []} />
      </div>

      <MobileNav />
    </main>
  )
}
