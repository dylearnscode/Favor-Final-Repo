"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "./supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "./star-rating"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface TransactionDetailsProps {
  transaction: any
  isCurrentUserBuyer: boolean
}

export function TransactionDetails({ transaction, isCurrentUserBuyer }: TransactionDetailsProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const otherParty = isCurrentUserBuyer ? transaction.seller : transaction.buyer
  const userConfirmed = isCurrentUserBuyer ? transaction.buyer_confirmed : transaction.seller_confirmed

  const handleConfirm = async () => {
    setIsLoading(true)

    try {
      const updateField = isCurrentUserBuyer ? "buyer_confirmed" : "seller_confirmed"

      const { error } = await supabase
        .from("transactions")
        .update({ [updateField]: true })
        .eq("id", transaction.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Transaction confirmed successfully",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to confirm transaction",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in_progress":
        return "outline"
      case "pending":
        return "secondary"
      case "disputed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Transaction Details</CardTitle>
          <Badge variant={getStatusBadgeVariant(transaction.status)} className="capitalize">
            {transaction.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Service Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{transaction.services.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">
                {transaction.services.category}
                {transaction.services.subcategory && ` / ${transaction.services.subcategory}`}
              </p>
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
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Participants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Buyer</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={transaction.buyer.avatar_url || ""} />
                  <AvatarFallback>{transaction.buyer.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{transaction.buyer.username}</p>
                  {transaction.buyer.rating && <StarRating rating={transaction.buyer.rating} />}
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Seller</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={transaction.seller.avatar_url || ""} />
                  <AvatarFallback>{transaction.seller.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{transaction.seller.username}</p>
                  {transaction.seller.rating && <StarRating rating={transaction.seller.rating} />}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Payment ID</p>
              <p className="font-medium truncate">{transaction.payment_intent_id || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <Badge variant={transaction.status === "pending" ? "outline" : "default"}>
                {transaction.status === "pending" ? "Processing" : "Completed"}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Completion Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Buyer confirmed</p>
              <Badge variant={transaction.buyer_confirmed ? "default" : "outline"}>
                {transaction.buyer_confirmed ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Seller confirmed</p>
              <Badge variant={transaction.seller_confirmed ? "default" : "outline"}>
                {transaction.seller_confirmed ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      {transaction.status === "in_progress" && !userConfirmed && (
        <CardFooter className="border-t pt-4">
          <Button className="w-full" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm Completion"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
