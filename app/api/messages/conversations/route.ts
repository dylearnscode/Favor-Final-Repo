import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const supabase = createClient()

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        id,
        participant_1,
        participant_2,
        created_at,
        last_message_at,
        messages (
          id,
          content,
          created_at,
          sender_id
        )
      `)
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
      .order("last_message_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "An error occurred fetching conversations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { otherUserId } = await request.json()

    if (!otherUserId) {
      return NextResponse.json({ error: "Other user ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("id")
      .or(
        `and(participant_1.eq.${user.id},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${user.id})`,
      )
      .single()

    if (existingConversation) {
      return NextResponse.json({ conversationId: existingConversation.id })
    }

    // Create new conversation
    const { data: newConversation, error } = await supabase
      .from("conversations")
      .insert({
        participant_1: user.id,
        participant_2: otherUserId,
        last_message_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ conversationId: newConversation.id })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "An error occurred creating conversation" }, { status: 500 })
  }
}
