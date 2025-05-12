import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"

interface MessageListProps {
  messages: any[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No messages yet. Start the conversation!</div>
  }

  return (
    <div className="space-y-4 mb-6">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === currentUserId

        return (
          <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-2 max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.profiles.avatar_url || ""} />
                <AvatarFallback>{message.profiles.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(message.created_at)}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
