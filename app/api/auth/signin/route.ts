import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const result = await signIn({ email, password })

    return NextResponse.json({
      success: true,
      user: result.user,
      session: result.session,
    })
  } catch (error) {
    console.error("Signin API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred during signin" },
      { status: 400 },
    )
  }
}
