// components/message-button.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner" // Assuming you're using sonner for toasts

interface MessageButtonProps {
  userId: string
  username?: string
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function MessageButton({
  userId,
  username,
  className,
  variant = "outline",
  size = "default",
}: MessageButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user, profile } = useAuth()

  const handleMessageClick = async () => {
    if (!user || !profile) {
      toast.error("Please sign in to send messages")
      return
    }

    if (profile.id === userId) {
      toast.error("You can't message yourself")
      return
    }

    setLoading(true)

    try {
      // Mock conversation creation
      await new Promise((resolve) => setTimeout(resolve, 300))
      const mockConversationId = `conv-${userId}-${Date.now()}`

      router.push(`/messages?conversation=${mockConversationId}`)

      toast.success(`Started conversation with ${username || "user"}`)
    } catch (error) {
      console.error("Error starting conversation:", error)
      toast.error("Failed to start conversation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleMessageClick} disabled={loading}>
      <MessageCircle className="w-4 h-4 mr-2" />
      {loading ? "..." : "Message"}
    </Button>
  )
}

// Usage examples:
// <MessageButton userId="user-id-123" username="John Doe" />
// <MessageButton userId="user-id-123" variant="ghost" size="sm" />
