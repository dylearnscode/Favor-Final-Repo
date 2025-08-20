// lib/messaging-utils.ts
import { createClient } from "@/lib/supabase"

// Function to start a conversation with another user (for use in other components)
export const startConversationWithUser = async (otherUserId: string) => {
  try {
    const response = await fetch('/api/messages/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otherUserId }),
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create conversation')
    }
    
    return result.conversationId
  } catch (error) {
    console.error('Error starting conversation:', error)
    throw error
  }
}

// Function to get unread message count for current user
export const getUnreadMessageCount = async (userId: string) => {
  const supabase = createClient()
  
  try {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .neq('sender_id', userId)
      .eq('is_read', false)
      .in('conversation_id', 
        supabase
          .from('conversations')
          .select('id')
          .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      )
    
    return count || 0
  } catch (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
}

// Function to mark conversation messages as read
export const markConversationAsRead = async (conversationId: string, userId: string) => {
  const supabase = createClient()
  
  try {
    await supabase
      .from('messages')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('is_read', false)
  } catch (error) {
    console.error('Error marking messages as read:', error)
  }
}

// Function to send a quick message (useful for automated messages)
export const sendQuickMessage = async (conversationId: string, senderId: string, content: string) => {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content.trim(),
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error sending quick message:', error)
    throw error
  }
}
