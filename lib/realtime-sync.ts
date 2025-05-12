import { createBrowserClient } from "@/lib/supabase-browser"

// Initialize Supabase client
const getSupabase = () => createBrowserClient()

// User authentication sync
export const syncUserAuth = async (userData: any) => {
  const supabase = getSupabase()

  try {
    // Update user profile
    const { error } = await supabase.from("profiles").upsert({
      id: userData.id,
      username: userData.username,
      full_name: userData.fullName,
      avatar_url: userData.avatarUrl,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error syncing user auth:", error)
    return { success: false, error }
  }
}

// Service posting sync
export const syncServicePost = async (serviceData: any) => {
  const supabase = getSupabase()

  try {
    // Create or update service
    const { data, error } = await supabase.from("services").upsert({
      id: serviceData.id || undefined,
      title: serviceData.title,
      description: serviceData.description,
      price: serviceData.price,
      category: serviceData.category,
      subcategory: serviceData.subcategory,
      user_id: serviceData.userId,
      is_offering: serviceData.isOffering,
      status: serviceData.status || "active",
      image_url: serviceData.imageUrl,
      created_at: serviceData.id ? undefined : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error syncing service post:", error)
    return { success: false, error }
  }
}

// Transaction sync
export const syncTransaction = async (transactionData: any) => {
  const supabase = getSupabase()

  try {
    // Create or update transaction
    const { data, error } = await supabase.from("transactions").upsert({
      id: transactionData.id || undefined,
      service_id: transactionData.serviceId,
      buyer_id: transactionData.buyerId,
      seller_id: transactionData.sellerId,
      amount: transactionData.amount,
      status: transactionData.status || "pending",
      buyer_confirmed: transactionData.buyerConfirmed || false,
      seller_confirmed: transactionData.sellerConfirmed || false,
      payment_intent_id: transactionData.paymentIntentId,
      created_at: transactionData.id ? undefined : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    // Create notification for seller
    await supabase.from("notifications").insert({
      user_id: transactionData.sellerId,
      content: `New transaction for your service: ${transactionData.serviceTitle}`,
      type: "transaction",
      related_id: data[0].id,
      is_read: false,
    })

    return { success: true, data }
  } catch (error) {
    console.error("Error syncing transaction:", error)
    return { success: false, error }
  }
}

// Payment method sync
export const syncPaymentMethod = async (paymentData: any) => {
  const supabase = getSupabase()

  try {
    // Store payment method (in a secure way)
    const { error } = await supabase.from("payment_methods").upsert({
      id: paymentData.id || undefined,
      user_id: paymentData.userId,
      type: paymentData.type,
      last_four: paymentData.lastFour,
      expiry_date: paymentData.expiryDate,
      is_default: paymentData.isDefault,
      created_at: paymentData.id ? undefined : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error syncing payment method:", error)
    return { success: false, error }
  }
}

// Set up real-time subscriptions
export const setupRealtimeSubscriptions = (userId: string, callbacks: any) => {
  const supabase = getSupabase()

  // Subscribe to notifications
  const notificationsSubscription = supabase
    .channel("notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        if (callbacks.onNotification) {
          callbacks.onNotification(payload.new)
        }
      },
    )
    .subscribe()

  // Subscribe to transactions
  const transactionsSubscription = supabase
    .channel("transactions")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "transactions",
        filter: `buyer_id=eq.${userId} OR seller_id=eq.${userId}`,
      },
      (payload) => {
        if (callbacks.onTransactionUpdate) {
          callbacks.onTransactionUpdate(payload.new)
        }
      },
    )
    .subscribe()

  // Subscribe to messages
  const messagesSubscription = supabase
    .channel("messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `transaction_id=in.(SELECT id FROM transactions WHERE buyer_id=eq.${userId} OR seller_id=eq.${userId})`,
      },
      (payload) => {
        if (callbacks.onMessage) {
          callbacks.onMessage(payload.new)
        }
      },
    )
    .subscribe()

  // Return unsubscribe function
  return () => {
    notificationsSubscription.unsubscribe()
    transactionsSubscription.unsubscribe()
    messagesSubscription.unsubscribe()
  }
}
