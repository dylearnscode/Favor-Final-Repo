import { ServicesList } from "@/components/services-list"
import { CategoryFilter } from "@/components/category-filter"
import { createServerClient } from "@/lib/supabase-server"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { CreateServiceButton } from "@/components/create-service-button"
import { redirect } from "next/navigation"

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: { category?: string; subcategory?: string; type?: string }
}) {
  const supabase = createServerClient()
  const category = searchParams.category
  const subcategory = searchParams.subcategory
  const type = searchParams.type || "offering"

  // Redirect to offerings by default
  if (!searchParams.type) {
    redirect("/services?type=offering")
  }

  let query = supabase
    .from("services")
    .select("*, profiles(username, avatar_url, rating, description)")
    .eq("status", "active")

  if (category) {
    query = query.eq("category", category)

    if (subcategory) {
      query = query.eq("subcategory", subcategory)
    }
  }

  // Always filter by type (offering or requesting)
  if (type === "offering") {
    query = query.eq("is_offering", true)
  } else if (type === "requesting") {
    query = query.eq("is_offering", false)
  }

  const { data: services } = await query.order("created_at", { ascending: false })

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 slide-up">
          {type === "offering" ? "Browse Services" : "Service Requests"}
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4 slide-up" style={{ animationDelay: "0.1s" }}>
            <CategoryFilter selectedCategory={category} selectedSubcategory={subcategory} />
          </div>

          <div className="w-full md:w-3/4 slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex justify-between items-center mb-6">
              <Tabs defaultValue={type} className="flex-1">
                <TabsList className="bg-secondary">
                  <TabsTrigger value="offering" className="data-[state=active]:bg-primary" asChild>
                    <a
                      href={`/services?type=offering${category ? `&category=${category}` : ""}${subcategory ? `&subcategory=${subcategory}` : ""}`}
                    >
                      Offerings
                    </a>
                  </TabsTrigger>
                  <TabsTrigger value="requesting" className="data-[state=active]:bg-primary" asChild>
                    <a
                      href={`/services?type=requesting${category ? `&category=${category}` : ""}${subcategory ? `&subcategory=${subcategory}` : ""}`}
                    >
                      Requests
                    </a>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <CreateServiceButton type={type as "offering" | "requesting"} />
            </div>

            <ServicesList services={services || []} />
          </div>
        </div>
      </div>
    </>
  )
}
