import { NextResponse } from "next/server"
import { signOut } from "@/lib/auth"

export async function POST() {
  try {
    await signOut()

    return NextResponse.json({
      success: true,
      message: "Signed out successfully",
    })
  } catch (error) {
    console.error("Signout API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred during signout" },
      { status: 400 },
    )
  }
}
