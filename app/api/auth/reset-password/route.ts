import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { passwordResetSchema } from "@/lib/validation"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, 3, 60 * 60 * 1000) // 3 attempts per hour
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many password reset attempts. Please try again later.",
          resetTime: rateLimitResult.resetTime 
        }, 
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input using Zod schema
    const validationResult = passwordResetSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(", ")
      return NextResponse.json({ error: errors }, { status: 400 })
    }

    const { email } = validationResult.data
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.nextUrl.origin}/auth/reset-password/confirm`,
    })

    if (error) {
      console.error("Password reset error:", error)
      return NextResponse.json({ 
        error: "Failed to send password reset email. Please try again." 
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Password reset email sent! Please check your inbox.",
    })
  } catch (error: any) {
    console.error("Password reset API error:", error)
    return NextResponse.json({ 
      error: "An error occurred while processing your request" 
    }, { status: 500 })
  }
} 