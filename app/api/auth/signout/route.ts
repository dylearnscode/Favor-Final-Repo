import { type NextRequest, NextResponse } from "next/server"
import { signOut } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await signOut()

    return NextResponse.json({
      success: true,
      message: "Signed out successfully",
    })
  } catch (error: any) {
    console.error("Signout API error:", error)
    return NextResponse.json({ error: error.message || "An error occurred during signout" }, { status: 400 })
  }
}
