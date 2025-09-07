import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"

// GET - Fetch exchange posts
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query = supabase
      .from("exchange_posts")
      .select(`
        *,
        user_profiles (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq("status", "active")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch exchange posts" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create exchange post
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient()

    // Get the current user from the session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, price_negotiability = "non-negotiable", category, duration_days } = body

    // Validate required fields
    if (!title || !description || !price || !category || !duration_days) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate price
    const priceNum = Number.parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 })
    }

    // Validate duration
    const durationNum = Number.parseInt(duration_days)
    if (isNaN(durationNum) || durationNum < 1) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 })
    }

    // Create the exchange post
    const { data, error } = await supabase
      .from("exchange_posts")
      .insert({
        title,
        description,
        price: priceNum,
        price_negotiability,
        category,
        duration_days: durationNum,
        user_id: user.id,
        status: "active",
      })
      .select(`
        *,
        user_profiles (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create exchange post" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
