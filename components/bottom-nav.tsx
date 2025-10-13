"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Car, MessageCircle, ShoppingBag, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { getUnreadMessageCount } from "@/lib/messaging-utils"

interface BottomNavProps {
  activeTab?: "academic" | "rideshare" | "exchange" | "messages" | "profile"
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  // Determine active tab from pathname if not provided
  const currentTab =
    activeTab ||
    (() => {
      if (pathname === "/" || pathname.startsWith("/academic")) return "academic"
      if (pathname.startsWith("/rideshare")) return "rideshare"
      if (pathname.startsWith("/exchange")) return "exchange"
      if (pathname.startsWith("/messages")) return "messages"
      if (pathname.startsWith("/profile")) return "profile"
      return "academic"
    })()

  // Load unread message count
  useEffect(() => {
    if (profile?.id) {
      getUnreadMessageCount(profile.id).then(setUnreadCount)
    }
  }, [profile?.id])

  const navItems = [
    {
      id: "academic",
      label: "Academic",
      icon: BookOpen,
      path: "/",
    },
    {
      id: "rideshare",
      label: "Rideshare",
      icon: Car,
      path: "/rideshare",
    },
    {
      id: "exchange",
      label: "Exchange",
      icon: ShoppingBag,
      path: "/exchange/entry",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      path: "/messages",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentTab === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex-1 flex flex-col items-center gap-1 h-auto py-2 px-1 relative ${
                isActive ? "text-white bg-gray-800" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              onClick={() => router.push(item.path)}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNav
