"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FavorSearchBar } from "@/components/design-system/favor-search-bar"
import { MessageCircle } from "lucide-react"

interface Conversation {
  id: string
  participant: {
    name: string
    avatar?: string
  }
  lastMessage: {
    content: string
    timestamp: string
    isRead: boolean
  }
  unreadCount: number
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Mock data
    setConversations([
      {
        id: "1",
        participant: {
          name: "Sarah Chen",
          avatar: "/placeholder-user.jpg",
        },
        lastMessage: {
          content: "Hi! Is the CS 101 study guide still available?",
          timestamp: "2024-01-15T14:30:00Z",
          isRead: false,
        },
        unreadCount: 2,
      },
      {
        id: "2",
        participant: {
          name: "Mike Johnson",
          avatar: "/placeholder-user.jpg",
        },
        lastMessage: {
          content: "Thanks for sharing the ride! See you at 3 PM.",
          timestamp: "2024-01-15T12:15:00Z",
          isRead: true,
        },
        unreadCount: 0,
      },
      {
        id: "3",
        participant: {
          name: "Emma Davis",
          avatar: "/placeholder-user.jpg",
        },
        lastMessage: {
          content: "Is the MacBook still for sale?",
          timestamp: "2024-01-14T16:45:00Z",
          isRead: false,
        },
        unreadCount: 1,
      },
      {
        id: "4",
        participant: {
          name: "Alex Kim",
          avatar: "/placeholder-user.jpg",
        },
        lastMessage: {
          content: "Great! I'll bring the textbook tomorrow.",
          timestamp: "2024-01-14T10:20:00Z",
          isRead: true,
        },
        unreadCount: 0,
      },
    ])
  }, [])

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-safe px-4 py-6 border-b border-border/40">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>

        <FavorSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search conversations..." />
      </div>

      {/* Conversations */}
      <div className="px-4 py-6">
        {filteredConversations.length > 0 ? (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <Card key={conversation.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.participant.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{getInitials(conversation.participant.name)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium truncate">{conversation.participant.name}</h3>
                        <div className="flex items-center gap-2">
                          {conversation.unreadCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                            >
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                      </div>

                      <p
                        className={`text-sm truncate ${
                          conversation.lastMessage.isRead ? "text-muted-foreground" : "text-foreground font-medium"
                        }`}
                      >
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground">{searchQuery ? "No conversations found" : "No messages yet"}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start a conversation by messaging someone from their post"}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
