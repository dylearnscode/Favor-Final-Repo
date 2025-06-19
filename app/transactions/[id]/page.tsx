import { redirect, notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { TransactionDetails } from "@/components/transaction-details"
import { MessageList } from "@/components/message-list"
import { MessageForm } from "@/components/message-form"

export default async function TransactionPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const userId = session.user.id

  const { data: transaction } = await supabase
    .from("transactions")
    .select(`
      *,
      services(*),
      buyer:profiles!buyer_id(*),
      seller:profiles!seller_id(*)
    `)
    .eq("id", params.id)
    .single()

  if (!transaction || (transaction.buyer_id !== userId && transaction.seller_id !== userId)) {
    notFound()
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*, profiles(*)")
    .eq("transaction_id", params.id)
    .order("created_at", { ascending: true })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Transaction Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <TransactionDetails transaction={transaction} isCurrentUserBuyer={transaction.buyer_id === userId} />

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Messages</h2>
            <MessageList messages={messages || []} currentUserId={userId} />
            <MessageForm transactionId={transaction.id} />
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Transaction Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">{transaction.services.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">${transaction.amount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{transaction.status.replace("_", " ")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
