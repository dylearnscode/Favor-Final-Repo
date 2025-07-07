import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"
import { signInSchema } from "@/lib/validation"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - more strict for signin
    const rateLimitResult = rateLimit(request, 5, 5 * 60 * 1000) // 5 attempts per 5 minutes
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many signin attempts. Please try again later.",
          resetTime: rateLimitResult.resetTime 
        }, 
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input using Zod schema
    const validationResult = signInSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(", ")
      return NextResponse.json({ error: errors }, { status: 400 })
    }

    const { email, password } = validationResult.data

    const result = await signIn({ email, password })

    return NextResponse.json({
      success: true,
      message: "Signed in successfully!",
      user: result.user,
      session: result.session,
    })
  } catch (error: any) {
    console.error("Signin API error:", error)
    
    // Handle specific Supabase errors
    if (error.message?.includes("Invalid login credentials")) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }
    
    if (error.message?.includes("Email not confirmed")) {
      return NextResponse.json({ error: "Please check your email and confirm your account" }, { status: 401 })
    }
    
    return NextResponse.json({ 
      error: error.message || "An error occurred during signin" 
    }, { status: 400 })
  }
}
