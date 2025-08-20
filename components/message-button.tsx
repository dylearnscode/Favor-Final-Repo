"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { startConversationWithUser } from "@/lib/messaging-utils"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

  const handleMessageClick = async () => {
    if (!user || !profile) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to send messages",
        variant: "destructive",
      })
      return
    }

    if (profile.id === userId) {
      toast({
        title: "Invalid Action",
        description: "You can't message yourself",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const conversationId = await startConversationWithUser(userId)

      // Navigate to messages page with the conversation selected
      router.push(`/messages?conversation=${conversationId}`)

      toast({
        title: "Success",
        description: `Started conversation with ${username || "user"}`,
      })
    } catch (error) {
      console.error("Error starting conversation:", error)
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      })
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
