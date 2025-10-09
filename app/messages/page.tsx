"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Search, MoreVertical, Phone, Video } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/lib/mock-data"
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
  other_user: {
    full_name: string
    avatar_url?: string
  }
  last_message: string
  last_message_at: string
  unread_count: number
}

export default function Messages() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [messages, setMessages] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false) // No loading needed
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { user, profile, loading: authLoading } = useAuth()

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const loadMessages = useCallback((conversationId: string) => {
    const mockMessages = MOCK_MESSAGES.filter((msg) => msg.conversation_id === conversationId)
    setMessages(mockMessages)
  }, [])

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !selectedConversation || !profile?.id) return

      const tempMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: selectedConversation,
        sender_id: profile.id,
        content: content.trim(),
        created_at: new Date().toISOString(),
        is_read: true,
      }

      setMessages((prev) => [...prev, tempMessage])
      setNewMessage("")
    },
    [selectedConversation, profile?.id],
  )

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
    conv.other_user.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
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
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conversation.other_user.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gray-700 text-white font-bold">
                            {conversation.other_user.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-white truncate">{conversation.other_user.full_name}</h3>
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              {new Date(conversation.last_message_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
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
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gray-700 text-white font-bold">
                      {conversations.find((c) => c.id === selectedConversation)?.other_user.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-white">
                      {conversations.find((c) => c.id === selectedConversation)?.other_user.full_name}
                    </h3>
                    <p className="text-xs text-gray-400">Online</p>
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
              const isOwnMessage = message.sender_id === profile?.id
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
