import { ServicesList } from "@/components/services-list"
import { HeroSection } from "@/components/hero-section"
import { CategorySection } from "@/components/category-section"
import { QuickSearch } from "@/components/quick-search"
import { createServerClient } from "@/lib/supabase-server"
import Header from "@/components/header"
import { FloatingActionButton } from "@/components/floating-action-button"

export default async function HomePage() {
  const supabase = createServerClient()

  // Fetch featured services (offerings only)
  const { data: services } = await supabase
    .from("services")
    .select("*, profiles(username, avatar_url, rating)")
    .eq("status", "active")
    .eq("is_offering", true)
    .order("created_at", { ascending: false })
    .limit(6)

  // Fetch categories with subcategories
  const { data: categories } = await supabase.from("categories").select("*").order("id")

  const { data: subcategories } = await supabase.from("subcategories").select("*").order("id")

  // Organize categories with subcategories
  const categoriesWithSubs =
    categories?.map((category) => ({
      ...category,
      subcategories: subcategories?.filter((sub) => sub.category_id === category.id) || [],
    })) || []

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 fade-in">
            <QuickSearch />
          </div>
          <HeroSection />
          <CategorySection categories={categoriesWithSubs} />
          <section className="mt-12 slide-up">
            <h2 className="text-3xl font-bold mb-6">Popular Services</h2>
            <ServicesList services={services || []} />
          </section>
        </div>
      </main>
      <FloatingActionButton />
    </>
  )
}
