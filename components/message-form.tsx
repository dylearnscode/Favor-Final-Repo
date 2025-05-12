"use client"

import type React from "react"

import { useState } from "react"
import { useSupabase } from "./supabase-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MessageFormProps {
  transactionId: string
}

export function MessageForm({ transactionId }: MessageFormProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to send messages")
      }

      const { error } = await supabase.from("messages").insert({
        transaction_id: transactionId,
        sender_id: user.id,
        content: message.trim(),
      })

      if (error) throw error

      setMessage("")

      // Refresh the page to show the new message
      // In a real app, you might want to use real-time subscriptions instead
      window.location.reload()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2">
        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none"
        />
        <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
