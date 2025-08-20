"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Search, MoreVertical, Phone, Video } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  sender_name?: string
  sender_avatar?: string
}

interface Conversation {
  id: string
  other_user_name: string
  other_user_avatar?: string
  last_message: string
  last_message_time: string
  unread_count: number
  is_online: boolean
}

// Sample conversations for fallback
const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    other_user_name: "Sarah K.",
    other_user_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    last_message: "Hey! Is the iPhone still available?",
    last_message_time: "2m ago",
    unread_count: 2,
    is_online: true,
  },
  {
    id: "2",
    other_user_name: "Mike R.",
    other_user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    last_message: "Thanks for the ride yesterday!",
    last_message_time: "1h ago",
    unread_count: 0,
    is_online: false,
  },
  {
    id: "3",
    other_user_name: "Emma L.",
    other_user_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    last_message: "Can you help me with calculus homework?",
    last_message_time: "3h ago",
    unread_count: 1,
    is_online: true,
  },
]

// Sample messages for fallback
const SAMPLE_MESSAGES: { [key: string]: Message[] } = {
  "1": [
    {
      id: "1",
      conversation_id: "1",
      sender_id: "user2",
      content: "Hey! I saw your iPhone listing. Is it still available?",
      created_at: "2024-01-15T10:00:00Z",
      sender_name: "Sarah K.",
    },
    {
      id: "2",
      conversation_id: "1",
      sender_id: "current-user",
      content: "Yes, it's still available! Are you interested?",
      created_at: "2024-01-15T10:05:00Z",
      sender_name: "You",
    },
  ],
}

// Utility functions
const createConversation = async (participant1Id: string, participant2Id: string, supabase: any) => {
  try {
    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1.eq.${participant1Id},participant_2.eq.${participant2Id}),and(participant_1.eq.${participant2Id},participant_2.eq.${participant1Id})`)
      .single()

    if (existingConversation) {
      return { data: existingConversation, error: null }
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        participant_1: participant1Id,
        participant_2: participant2Id,
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "sample">("sample")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Use your existing auth hook
  const { user, profile, loading: authLoading } = useAuth()

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Load conversations - FIXED VERSION
  const loadConversations = useCallback(async () => {
    if (!profile?.id) {
      console.log("No profile ID available")
      return
    }

    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          id,
          created_at,
          participant_1,
          participant_2,
          last_message_at,
          messages(
            content,
            created_at,
            sender_id
          )
        `)
        .or(`participant_1.eq.${profile.id},participant_2.eq.${profile.id}`)
        .order("last_message_at", { ascending: false })

      if (error) {
        console.log("Database error:", error)
        setConversations(SAMPLE_CONVERSATIONS)
        setConnectionStatus("sample")
        return
      }

      // Get other participants' profiles
      const userIds = data?.map(conv => 
        conv.participant_1 === profile.id ? conv.participant_2 : conv.participant_1
      ).filter(Boolean) || []

      if (userIds.length === 0) {
        setConversations([])
        setConnectionStatus("connected")
        return
      }

      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, username, avatar_url')
        .in('id', userIds)

      const profilesMap = profiles?.reduce((acc, profileData) => {
        acc[profileData.id] = profileData
        return acc
      }, {} as any) || {}

      const transformedConversations: Conversation[] = (data || []).map((conv: any) => {
        const otherUserId = conv.participant_1 === profile.id ? conv.participant_2 : conv.participant_1
        const otherUser = profilesMap[otherUserId]
        const lastMessage = conv.messages?.[0]

        return {
          id: conv.id,
          other_user_name: otherUser?.username || "Unknown User",
          other_user_avatar: otherUser?.avatar_url,
          last_message: lastMessage?.content || "No messages yet",
          last_message_time: lastMessage ? new Date(lastMessage.created_at).toLocaleTimeString() : "",
          unread_count: 0, // TODO: Calculate unread count
          is_online: Math.random() > 0.5, // TODO: Implement real online status
        }
      })

      setConversations(transformedConversations)
      setConnectionStatus("connected")
    } catch (error) {
      console.error("Error loading conversations:", error)
      setConversations(SAMPLE_CONVERSATIONS)
      setConnectionStatus("sample")
    } finally {
      setLoading(false)
    }
  }, [profile?.id, supabase])

  // Load messages for a conversation - FIXED VERSION
  const loadMessages = useCallback(
    async (conversationId: string) => {
      try {
        if (connectionStatus === "sample") {
          setMessages(SAMPLE_MESSAGES[conversationId] || [])
          return
        }

        const { data, error } = await supabase
          .from("messages")
          .select(`
            id,
            conversation_id,
            sender_id,
            content,
            created_at,
            user_profiles!sender_id(username, avatar_url)
          `)
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true })

        if (error) {
          console.error("Error loading messages:", error)
          setMessages(SAMPLE_MESSAGES[conversationId] || [])
        } else {
          const transformedMessages: Message[] = (data || []).map((msg: any) => ({
            id: msg.id,
            conversation_id: msg.conversation_id,
            sender_id: msg.sender_id,
            content: msg.content,
            created_at: msg.created_at,
            sender_name: msg.user_profiles?.username || "Unknown",
            sender_avatar: msg.user_profiles?.avatar_url,
          }))

          setMessages(transformedMessages)
        }
      } catch (error) {
        console.error("Error loading messages:", error)
        setMessages(SAMPLE_MESSAGES[conversationId] || [])
      }
    },
    [connectionStatus, supabase],
  )

  // Send message - FIXED VERSION
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !selectedConversation || !profile?.id) return

      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: selectedConversation,
        sender_id: profile.id,
        content: content.trim(),
        created_at: new Date().toISOString(),
        sender_name: "You",
      }

      // Optimistic update
      setMessages((prev) => [...prev, tempMessage])
      setNewMessage("")

      try {
        if (connectionStatus === "connected") {
          const { data, error } = await supabase.from("messages").insert({
            conversation_id: selectedConversation,
            sender_id: profile.id,
            content: content.trim(),
          })

          if (error) {
            console.error("Error sending message:", error)
            setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id))
          } else {
            loadMessages(selectedConversation)
          }
        }
      } catch (error) {
        console.error("Error sending message:", error)
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id))
      }
    },
    [selectedConversation, profile?.id, connectionStatus, loadMessages, supabase],
  )

  // Set up realtime subscription - FIXED VERSION
  useEffect(() => {
    if (connectionStatus !== "connected" || !selectedConversation || !profile?.id) return

    const channel = supabase
      .channel(`conversation-${selectedConversation}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        (payload) => {
          const newMessage = payload.new as any
          if (newMessage.sender_id !== profile.id) {
            loadMessages(selectedConversation)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversation, connectionStatus, profile?.id, loadMessages, supabase])

  // Load conversations on mount and handle URL params - FIXED VERSION
  useEffect(() => {
    if (authLoading || !profile) return

    const loadWithTimeout = async () => {
      try {
        await Promise.race([
          loadConversations(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Load timeout")), 5000)),
        ])
        
        // Check for conversation parameter in URL
        const urlParams = new URLSearchParams(window.location.search)
        const conversationParam = urlParams.get('conversation')
        if (conversationParam) {
          setSelectedConversation(conversationParam)
          loadMessages(conversationParam)
          // Clean up URL
          window.history.replaceState({}, '', '/messages')
        }
      } catch (error) {
        console.log("Loading timed out, using sample data")
        setConversations(SAMPLE_CONVERSATIONS)
        setConnectionStatus("sample")
        setLoading(false)
      }
    }

    loadWithTimeout()
  }, [loadConversations, authLoading, profile, loadMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Handle conversation selection
  const handleConversationSelect = useCallback(
    (conversationId: string) => {
      setSelectedConversation(conversationId)
      loadMessages(conversationId)
    },
    [loadMessages],
  )

  // Handle send message
  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      sendMessage(newMessage)
    },
    [newMessage, sendMessage],
  )

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Show loading if auth is still loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading messages...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show auth required message if no user
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-400">Please sign in to access your messages.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
      {!selectedConversation ? (
        // Conversations List
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold tracking-tight text-white">Messages</h1>
              <div className="flex items-center gap-2">
                {connectionStatus === "sample" && (
                  <Badge className="bg-yellow-900/50 text-yellow-300 text-xs">Sample Data</Badge>
                )}
                <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
                  <MoreVertical className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">💬</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No conversations yet</h3>
                <p className="text-gray-500">Start a conversation by contacting someone!</p>
              </div>
            ) : (
              <div className="space-y-1 p-4">
                {filteredConversations.map((conversation) => (
                  <Card
                    key={conversation.id}
                    className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => handleConversationSelect(conversation.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={conversation.other_user_avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gray-700 text-white font-bold">
                              {conversation.other_user_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.is_online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-white truncate">{conversation.other_user_name}</h3>
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              {conversation.last_message_time}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400 truncate">{conversation.last_message}</p>
                            {conversation.unread_count > 0 && (
                              <Badge className="bg-blue-600 text-white text-xs ml-2 flex-shrink-0">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Chat View
        <div className="flex flex-col h-screen">
          {/* Chat Header */}
          <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={conversations.find((c) => c.id === selectedConversation)?.other_user_avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="bg-gray-700 text-white font-bold">
                        {conversations.find((c) => c.id === selectedConversation)?.other_user_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {conversations.find((c) => c.id === selectedConversation)?.is_online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {conversations.find((c) => c.id === selectedConversation)?.other_user_name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {conversations.find((c) => c.id === selectedConversation)?.is_online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.sender_id === profile.id
              return (
                <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? "order-2" : "order-1"}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage ? "bg-blue-600 text-white rounded-br-md" : "bg-gray-800 text-white rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-2">
                      {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-800 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      )}

      <BottomNav activeTab="messages" />
    </div>
  )
}