import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { ServiceForm } from "@/components/service-form"
import Header from "@/components/header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function NewServicePage({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/home")
  }

  const type = searchParams.type || "offering"

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 slide-up">
          {type === "offering" ? "Offer a Service" : "Request a Service"}
        </h1>

        <Tabs defaultValue={type} className="mb-6 slide-up" style={{ animationDelay: "0.1s" }}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="offering" className="data-[state=active]:bg-primary" asChild>
              <a href="/dashboard/services/new?type=offering">Offer</a>
            </TabsTrigger>
            <TabsTrigger value="requesting" className="data-[state=active]:bg-primary" asChild>
              <a href="/dashboard/services/new?type=requesting">Request</a>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="max-w-2xl mx-auto slide-up" style={{ animationDelay: "0.2s" }}>
          <ServiceForm type={type as "offering" | "requesting"} />
        </div>
      </div>
    </>
  )
}
