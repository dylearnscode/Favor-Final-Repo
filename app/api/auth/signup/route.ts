import { type NextRequest, NextResponse } from "next/server"
import { signUp } from "@/lib/auth"
import { signUpSchema } from "@/lib/validation"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many signup attempts. Please try again later.",
          resetTime: rateLimitResult.resetTime 
        }, 
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input using Zod schema
    const validationResult = signUpSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(", ")
      return NextResponse.json({ error: errors }, { status: 400 })
    }

    const { email, password, username, fullName } = validationResult.data

    const result = await signUp({ email, password, username, fullName })

    return NextResponse.json({
      success: true,
      message: "Account created successfully! Please check your email to verify your account.",
      user: result.user,
      session: result.session,
    })
  } catch (error: any) {
    console.error("Signup API error:", error)
    
    // Handle specific Supabase errors
    if (error.message?.includes("User already registered")) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: error.message || "An error occurred during signup" 
    }, { status: 400 })
  }
}
