import { createBrowserClient } from "@/lib/supabase-browser"

// Initialize Supabase client
const getSupabase = () => createBrowserClient()

// Mock payment provider API (in a real app, this would be Stripe, PayPal, etc.)
const mockPaymentProvider = {
  createPaymentIntent: async (amount: number, metadata: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: `pi_${Math.random().toString(36).substring(2, 15)}`,
      client_secret: `secret_${Math.random().toString(36).substring(2, 15)}`,
      amount,
      status: "requires_payment_method",
      metadata,
    }
  },

  confirmPayment: async (paymentIntentId: string, paymentMethodId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: paymentIntentId,
      status: "succeeded",
    }
  },
}

// Payment service
export const PaymentService = {
  // Get user's payment methods
  getUserPaymentMethods: async (userId: string) => {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })

    if (error) throw error

    return data
  },

  // Add payment method
  addPaymentMethod: async (userId: string, paymentDetails: any) => {
    const supabase = getSupabase()

    // In a real app, this would tokenize the card with Stripe, PayPal, etc.
    // For demo purposes, we'll just store the last four digits

    const { data, error } = await supabase
      .from("payment_methods")
      .insert({
        user_id: userId,
        type: paymentDetails.type,
        last_four: paymentDetails.cardNumber.slice(-4),
        expiry_date: `${paymentDetails.expiryMonth}/${paymentDetails.expiryYear.slice(-2)}`,
        is_default: paymentDetails.isDefault,
      })
      .select()

    if (error) throw error

    // If this is the default payment method, update other payment methods
    if (paymentDetails.isDefault) {
      await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", userId).neq("id", data[0].id)
    }

    return data[0]
  },

  // Create transaction
  createTransaction: async (serviceId: string, buyerId: string, sellerId: string, amount: number) => {
    const supabase = getSupabase()

    // Create payment intent with payment provider
    const paymentIntent = await mockPaymentProvider.createPaymentIntent(amount, {
      service_id: serviceId,
      buyer_id: buyerId,
      seller_id: sellerId,
    })

    // Create transaction in database
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        service_id: serviceId,
        buyer_id: buyerId,
        seller_id: sellerId,
        amount,
        status: "pending",
        payment_intent_id: paymentIntent.id,
        buyer_confirmed: false,
        seller_confirmed: false,
      })
      .select()

    if (transactionError) throw transactionError

    return {
      transaction: transaction[0],
      paymentIntent,
    }
  },

  // Process payment
  processPayment: async (transactionId: string, paymentMethodId: string, paymentIntentId: string) => {
    const supabase = getSupabase()

    // Confirm payment with payment provider
    const paymentResult = await mockPaymentProvider.confirmPayment(paymentIntentId, paymentMethodId)

    if (paymentResult.status !== "succeeded") {
      throw new Error("Payment failed")
    }

    // Create payment transaction record
    const { data: paymentTransaction, error: paymentError } = await supabase
      .from("payment_transactions")
      .insert({
        transaction_id: transactionId,
        amount: 0, // Will be updated from the transaction
        fee: 0, // Calculate fee based on amount
        status: "pending",
        payment_method_id: paymentMethodId,
        payment_provider: "mock", // In a real app, this would be 'stripe', 'paypal', etc.
        payment_provider_id: paymentIntentId,
      })
      .select()

    if (paymentError) throw paymentError

    // Update transaction with payment transaction ID
    const { data: updatedTransaction, error: updateError } = await supabase
      .from("transactions")
      .update({
        status: "paid",
        payment_transaction_id: paymentTransaction[0].id,
      })
      .eq("id", transactionId)
      .select()

    if (updateError) throw updateError

    // Create notification for seller
    await supabase.from("notifications").insert({
      user_id: updatedTransaction[0].seller_id,
      content: "You have received a new payment",
      type: "payment",
      related_id: transactionId,
      is_read: false,
    })

    return {
      transaction: updatedTransaction[0],
      paymentTransaction: paymentTransaction[0],
    }
  },

  // Confirm transaction completion (buyer)
  confirmTransactionBuyer: async (transactionId: string) => {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from("transactions")
      .update({
        buyer_confirmed: true,
      })
      .eq("id", transactionId)
      .select()

    if (error) throw error

    // Create notification for seller
    await supabase.from("notifications").insert({
      user_id: data[0].seller_id,
      content: "Buyer has confirmed transaction completion",
      type: "transaction",
      related_id: transactionId,
      is_read: false,
    })

    return data[0]
  },

  // Confirm transaction completion (seller)
  confirmTransactionSeller: async (transactionId: string) => {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from("transactions")
      .update({
        seller_confirmed: true,
      })
      .eq("id", transactionId)
      .select()

    if (error) throw error

    // Create notification for buyer
    await supabase.from("notifications").insert({
      user_id: data[0].buyer_id,
      content: "Seller has confirmed transaction completion",
      type: "transaction",
      related_id: transactionId,
      is_read: false,
    })

    return data[0]
  },
}
