"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSupabase } from "./supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "./star-rating"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface MyTransactionsProps {
  userId: string
}

export function MyTransactions({ userId }: MyTransactionsProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select(`
            *,
            services(*),
            buyer:profiles!buyer_id(username, avatar_url, rating),
            seller:profiles!seller_id(username, avatar_url, rating)
          `)
          .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
          .order("created_at", { ascending: false })

        if (error) throw error

        setTransactions(data || [])
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load transactions",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [supabase, userId, toast])

  if (loading) {
    return <div>Loading your transactions...</div>
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">You don't have any transactions yet</h3>
        <p className="text-muted-foreground mb-6">Browse services to get started</p>
        <Link href="/services">
          <Button>Browse Services</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Transactions</h2>

      <div className="space-y-4">
        {transactions.map((transaction) => {
          const isBuyer = transaction.buyer_id === userId
          const otherParty = isBuyer ? transaction.seller : transaction.buyer

          return (
            <Card key={transaction.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{transaction.services.title}</CardTitle>
                  <Badge className="capitalize">{transaction.status.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Your role</p>
                    <p className="font-medium">{isBuyer ? "Buyer" : "Seller"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{isBuyer ? "Seller" : "Buyer"}</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={otherParty.avatar_url || ""} />
                        <AvatarFallback>{otherParty.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{otherParty.username}</p>
                        {otherParty.rating && <StarRating rating={otherParty.rating} />}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">${transaction.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(transaction.created_at)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Link href={`/transactions/${transaction.id}`} className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
