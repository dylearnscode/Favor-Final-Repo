import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, getUserProfile, updateUserProfile } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const profile = await getUserProfile(user.id)

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error) {
    console.error("Profile GET API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred fetching profile" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const updatedProfile = await updateUserProfile(user.id, body)

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    })
  } catch (error) {
    console.error("Profile PUT API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred updating profile" },
      { status: 500 },
    )
  }
}
