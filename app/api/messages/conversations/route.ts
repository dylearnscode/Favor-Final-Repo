// app/api/messages/conversations/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { otherUserId } = body

    if (!otherUserId) {
      return NextResponse.json({ error: "otherUserId is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Get current user's profile
    const { data: currentProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', currentUser.id)
      .single()

    if (!currentProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1.eq.${currentProfile.id},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${currentProfile.id})`)
      .single()

    if (existingConversation) {
      return NextResponse.json({ 
        success: true, 
        conversationId: existingConversation.id,
        existing: true 
      })
    }

    // Create new conversation
    const { data: newConversation, error } = await supabase
      .from('conversations')
      .insert({
        participant_1: currentProfile.id,
        participant_2: otherUserId,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating conversation:", error)
      return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      conversationId: newConversation.id,
      existing: false 
    })

  } catch (error) {
    console.error("Messages API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    )
  }
}
