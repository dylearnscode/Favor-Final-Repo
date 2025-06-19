import { createServerClient } from "@/lib/supabase-server"
import { ServicesList } from "@/components/services-list"
import { SearchBar } from "@/components/search-bar"
import Header from "@/components/header"
import { CategoryPills } from "@/components/category-pills"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string; category?: string }
}) {
  const supabase = createServerClient()
  const query = searchParams.q || ""
  const type = searchParams.type || "offering"
  const category = searchParams.category || ""

  // Fetch categories for pills
  const { data: categories } = await supabase.from("categories").select("*").order("id")

  let servicesQuery = supabase
    .from("services")
    .select("*, profiles(username, avatar_url, rating)")
    .eq("status", "active")
    .eq("is_offering", type === "offering")

  if (query) {
    servicesQuery = servicesQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (category) {
    servicesQuery = servicesQuery.eq("category", category)
  }

  const { data: services } = await servicesQuery.order("created_at", { ascending: false })

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 slide-up">Search</h1>

          <div className="mb-6 slide-up" style={{ animationDelay: "0.1s" }}>
            <SearchBar initialQuery={query} type={type} />
          </div>

          <div className="mb-6 slide-up" style={{ animationDelay: "0.15s" }}>
            <CategoryPills categories={categories || []} selectedCategory={category} type={type} />
          </div>

          <div className="slide-up" style={{ animationDelay: "0.2s" }}>
            {query || category ? (
              <>
                <h2 className="text-2xl font-bold mb-6">
                  {services?.length || 0} results {query ? `for "${query}"` : ""}
                </h2>
                <ServicesList services={services || []} />
              </>
            ) : (
              <div className="text-center py-12 bg-gray-900 rounded-xl">
                <h3 className="text-lg font-medium mb-2">Search for services</h3>
                <p className="text-gray-400">Enter a keyword or select a category to find services</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
