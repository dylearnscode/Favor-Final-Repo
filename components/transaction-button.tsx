"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "./supabase-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { createPaymentIntent, confirmPayment } from "@/lib/payment-service"
import { Card, CardContent } from "@/components/ui/card"
import { Check, CreditCard } from "lucide-react"

interface TransactionButtonProps {
  service: any
}

export function TransactionButton({ service }: TransactionButtonProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"confirm" | "processing" | "success">("confirm")

  const handleTransaction = async () => {
    setIsLoading(true)
    setPaymentStep("processing")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Don't allow transactions on your own services
      if (user.id === service.user_id) {
        toast({
          title: "Error",
          description: "You cannot purchase your own service",
          variant: "destructive",
        })
        setIsLoading(false)
        setShowDialog(false)
        return
      }

      // Create a payment intent
      const paymentIntent = await createPaymentIntent(service.price * 100, {
        service_id: service.id,
        buyer_id: user.id,
        seller_id: service.user_id,
      })

      // Simulate payment confirmation
      await confirmPayment(paymentIntent.id)

      // Create the transaction
      const { data: transaction, error } = await supabase
        .from("transactions")
        .insert({
          service_id: service.id,
          buyer_id: user.id,
          seller_id: service.user_id,
          amount: service.price,
          status: "pending",
          payment_intent_id: paymentIntent.id,
        })
        .select()
        .single()

      if (error) throw error

      setPaymentStep("success")

      setTimeout(() => {
        toast({
          title: "Success!",
          description: "Transaction initiated successfully",
        })

        router.push(`/transactions/${transaction.id}`)
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create transaction",
        variant: "destructive",
      })
      setShowDialog(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button className="w-full" size="lg" onClick={() => setShowDialog(true)}>
        {service.is_offering ? "Purchase Service" : "Offer to Help"}
      </Button>

      <Dialog open={showDialog} onOpenChange={(open) => !open && setShowDialog(false)}>
        <DialogContent className="sm:max-w-md">
          {paymentStep === "confirm" && (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Purchase</DialogTitle>
                <DialogDescription>
                  You are about to {service.is_offering ? "purchase" : "offer help for"} this service.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <Card className="bg-secondary border-none">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium">{service.title}</span>
                      <span className="font-bold">${service.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Service fee</span>
                      <span>${(service.price * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">${(service.price * 1.05).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-black rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                      <CreditCard className="h-8 w-8 text-white" />
                      <span className="text-white font-medium">Pay</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm">Double-tap to pay</span>
                      <span className="text-white font-bold">${(service.price * 1.05).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleTransaction} disabled={isLoading} className="mt-2 sm:mt-0">
                  {isLoading ? "Processing..." : "Confirm Payment"}
                </Button>
              </DialogFooter>
            </>
          )}

          {paymentStep === "processing" && (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <DialogTitle className="text-center mb-2">Processing Payment</DialogTitle>
              <DialogDescription className="text-center">
                Please wait while we process your payment...
              </DialogDescription>
            </div>
          )}

          {paymentStep === "success" && (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <DialogTitle className="text-center mb-2">Payment Successful</DialogTitle>
              <DialogDescription className="text-center">
                Your payment has been processed successfully. Redirecting to transaction details...
              </DialogDescription>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
