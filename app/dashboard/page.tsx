import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { MyServices } from "@/components/my-services"
import { MyTransactions } from "@/components/my-transactions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const userId = session.user.id
  const tab = searchParams.tab || "services"

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 slide-up">Dashboard</h1>

        <Tabs defaultValue={tab} className="w-full slide-up" style={{ animationDelay: "0.1s" }}>
          <TabsList className="mb-6 bg-secondary">
            <TabsTrigger value="services" className="data-[state=active]:bg-primary" asChild>
              <a href="/dashboard?tab=services">My Services</a>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-primary" asChild>
              <a href="/dashboard?tab=transactions">My Transactions</a>
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-primary" asChild>
              <a href="/dashboard?tab=messages">Messages</a>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="slide-up" style={{ animationDelay: "0.2s" }}>
            <MyServices userId={userId} />
          </TabsContent>

          <TabsContent value="transactions" className="slide-up" style={{ animationDelay: "0.2s" }}>
            <MyTransactions userId={userId} />
          </TabsContent>

          <TabsContent value="messages" className="slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-secondary p-8 rounded-lg text-center">
              <h3 className="text-xl font-medium mb-2">Messages coming soon</h3>
              <p className="text-muted-foreground">
                We're working on a new messaging system to help you communicate with other users.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
