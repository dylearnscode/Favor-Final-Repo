import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

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

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching exchange posts:", error)
      return NextResponse.json({ error: "Failed to fetch exchange posts" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in GET /api/exchange/posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, price_negotiability = "non-negotiable", category, duration_days } = body

    // Validate required fields
    if (!title || !description || price === undefined || !category || !duration_days) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + Number.parseInt(duration_days))

    const { data, error } = await supabase
      .from("exchange_posts")
      .insert({
        title,
        description,
        price: Number.parseFloat(price),
        price_negotiability,
        category,
        duration_days: Number.parseInt(duration_days),
        expires_at: expiresAt.toISOString(),
        user_id: user.id,
        status: "active",
        review_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating exchange post:", error)
      return NextResponse.json({ error: "Failed to create exchange post" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/exchange/posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
