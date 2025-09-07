import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a server-side Supabase client for API routes
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// GET - Fetch exchange posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query = supabaseAdmin
      .from("exchange_posts")
      .select(`
        *,
        user_profiles (
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

    return NextResponse.json({ data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create exchange post
export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 })
    }

    // Extract the JWT token
    const token = authHeader.replace("Bearer ", "")

    // Verify the token and get user
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, price_negotiability = "non-negotiable", category, duration_days } = body

    // Validate required fields
    if (!title || !description || price === undefined || !category || !duration_days) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate price
    if (typeof price !== "number" || price < 0) {
      return NextResponse.json({ error: "Price must be a non-negative number" }, { status: 400 })
    }

    // Validate duration_days
    if (typeof duration_days !== "number" || duration_days <= 0) {
      return NextResponse.json({ error: "Duration must be a positive number" }, { status: 400 })
    }

    // Insert the exchange post
    const { data, error } = await supabaseAdmin
      .from("exchange_posts")
      .insert({
        title,
        description,
        price,
        price_negotiability,
        category,
        duration_days,
        user_id: user.id,
        status: "active",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create exchange post" }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
