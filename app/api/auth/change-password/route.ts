import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { changePasswordSchema } from "@/lib/validation"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many password change attempts. Please try again later.",
          resetTime: rateLimitResult.resetTime 
        }, 
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input using Zod schema
    const validationResult = changePasswordSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(", ")
      return NextResponse.json({ error: errors }, { status: 400 })
    }

    const { currentPassword, newPassword } = validationResult.data
    const supabase = createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      console.error("Password change error:", error)
      
      if (error.message?.includes("Password should be at least")) {
        return NextResponse.json({ error: "New password doesn't meet requirements" }, { status: 400 })
      }
      
      return NextResponse.json({ 
        error: "Failed to update password. Please try again." 
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully!",
    })
  } catch (error: any) {
    console.error("Change password API error:", error)
    return NextResponse.json({ 
      error: "An error occurred while processing your request" 
    }, { status: 500 })
  }
} 