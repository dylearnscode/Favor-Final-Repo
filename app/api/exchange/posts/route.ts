import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // Build query to fetch active posts with user profile info
    let query = supabase
      .from("exchange_posts")
      .select(`
        id,
        title,
        description,
        price,
        price_negotiability,
        category,
        status,
        rating,
        review_count,
        created_at,
        expires_at,
        user_id,
        user_profiles!exchange_posts_user_id_fkey (
          username,
          full_name
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

    const transformedData =
      data?.map((post) => ({
        id: post.id,
        title: post.title,
        description: post.description,
        price: post.price,
        price_negotiability: post.price_negotiability,
        category: post.category,
        poster: post.user_profiles?.full_name || post.user_profiles?.username || "Anonymous",
        rating: post.rating,
        review_count: post.review_count,
        created_at: post.created_at,
        expires_at: post.expires_at,
      })) || []

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )
    const body = await request.json()

    const { title, description, price, price_negotiability = "non-negotiable", category, duration_days } = body

    // Validate required fields
    if (!title || !description || price == null || !category || !duration_days) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate price
    if (typeof price !== "number" || price < 0) {
      return NextResponse.json({ error: "Price must be a non-negative number" }, { status: 400 })
    }

    // Validate duration
    if (!Number.isInteger(duration_days) || duration_days < 1 || duration_days > 30) {
      return NextResponse.json({ error: "Duration must be an integer between 1 and 30 days" }, { status: 400 })
    }

    // Validate category
    const validCategories = ["Concert Tickets", "Dorm Items", "Preprofessional Help", "Food Truck Line Service"]
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    // Validate price negotiability
    const validNegotiability = ["negotiable", "non-negotiable"]
    if (!validNegotiability.includes(price_negotiability)) {
      return NextResponse.json({ error: "Invalid price negotiability" }, { status: 400 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Insert post
    const { data: postData, error: postError } = await supabase
      .from("exchange_posts")
      .insert({
        title,
        description,
        price,
        price_negotiability,
        category,
        duration_days,
        user_id: user.id, // Use authenticated user's ID instead of request body user_id
        status: "active",
        rating: null,
        review_count: 0,
      })
      .select()
      .single()

    if (postError) {
      console.error("Error creating exchange post:", postError)
      return NextResponse.json({ error: "Failed to create exchange post" }, { status: 500 })
    }

    return NextResponse.json(postData, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
