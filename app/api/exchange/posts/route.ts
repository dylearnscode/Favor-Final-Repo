import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getCurrentUser, getUserProfile } from "@/lib/auth"

export async function GET() {
  try {
    const supabase = createClient()

    const { data: posts, error } = await supabase
      .from("exchange_posts")
      .select(`
        *,
        user_profiles (
          id,
          username,
          avatar_url,
          full_name
        )
      `)
      .eq("status", "active")
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
    }

    return NextResponse.json({ success: true, posts: posts || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const profile = await getUserProfile(currentUser.id)
    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, price, category, duration_days, price_negotiability } = body

    // Validation
    if (!title || !description || !price || !category || !duration_days) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (price <= 0) {
      return NextResponse.json({ error: "Price must be greater than 0" }, { status: 400 })
    }

    if (duration_days <= 0 || duration_days > 365) {
      return NextResponse.json({ error: "Duration must be between 1 and 365 days" }, { status: 400 })
    }

    const validCategories = ["Concert Tickets", "Dorm Items", "Preprofessional Help", "Food Truck Line Service"]
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    const supabase = createClient()

    const { data: newPost, error } = await supabase
      .from("exchange_posts")
      .insert({
        user_id: profile.id,
        title: title.trim(),
        description: description.trim(),
        price: Number.parseFloat(price),
        category,
        duration_days: Number.parseInt(duration_days),
        price_negotiability: price_negotiability || "non-negotiable",
        status: "active",
      })
      .select(`
        *,
        user_profiles (
          id,
          username,
          avatar_url,
          full_name
        )
      `)
      .single()

    if (error) {
      console.error("Error creating exchange post:", error)
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }

    return NextResponse.json({ success: true, post: newPost }, { status: 201 })
  } catch (error) {
    console.error("Exchange posts API error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 })
  }
}
