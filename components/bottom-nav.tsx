"use client"

import { BookOpen, Car, MessageCircle, User, ShoppingBag } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab?: string
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    {
      id: "academic",
      label: "Academic",
      icon: BookOpen,
      path: "/academic",
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
      path: "/exchange",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      path: "/messages",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const getActiveTab = () => {
    if (activeTab) return activeTab

    // Determine active tab from pathname
    if (pathname.startsWith("/academic")) return "academic"
    if (pathname.startsWith("/rideshare")) return "rideshare"
    if (pathname.startsWith("/exchange")) return "exchange"
    if (pathname.startsWith("/messages")) return "messages"
    if (pathname.startsWith("/profile")) return "profile"

    return "academic"
  }

  const currentActiveTab = getActiveTab()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 safe-area-inset-bottom z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentActiveTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1",
                isActive ? "bg-white text-black" : "text-gray-400 hover:text-white hover:bg-gray-800",
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNav
