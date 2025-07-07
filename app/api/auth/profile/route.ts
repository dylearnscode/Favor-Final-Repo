import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, getUserProfile, updateUserProfile } from "@/lib/auth"
import { updateProfileSchema } from "@/lib/validation"
import { rateLimit } from "@/lib/rate-limit"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const profile = await getUserProfile(user.id)

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error: any) {
    console.error("Get profile API error:", error)
    return NextResponse.json({ error: error.message || "An error occurred while fetching profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, 10, 5 * 60 * 1000) // 10 attempts per 5 minutes
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many profile update attempts. Please try again later.",
          resetTime: rateLimitResult.resetTime 
        }, 
        { status: 429 }
      )
    }

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input using Zod schema
    const validationResult = updateProfileSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(", ")
      return NextResponse.json({ error: errors }, { status: 400 })
    }

    const updatedProfile = await updateUserProfile(user.id, validationResult.data)

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      profile: updatedProfile,
    })
  } catch (error: any) {
    console.error("Update profile API error:", error)
    return NextResponse.json({ error: error.message || "An error occurred while updating profile" }, { status: 500 })
  }
}
