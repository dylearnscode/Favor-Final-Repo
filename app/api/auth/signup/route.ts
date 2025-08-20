import { type NextRequest, NextResponse } from "next/server"
import { signUp } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, username, fullName } = body

    if (!email || !password || !username || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await signUp({ email, password, username, fullName })

    return NextResponse.json({
      success: true,
      user: result.user,
      session: result.session,
    })
  } catch (error) {
    console.error("Signup API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred during signup" },
      { status: 400 },
    )
  }
}
