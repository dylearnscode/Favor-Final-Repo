"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, BookOpen, MessageCircle, ArrowLeftRight, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab?: string
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      id: "academic",
      label: "Academic",
      icon: BookOpen,
      href: "/academic",
    },
    {
      id: "exchange",
      label: "Exchange",
      icon: ArrowLeftRight,
      href: "/exchange/entry",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      href: "/messages",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/profile",
    },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id || pathname === item.href

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors",
                isActive ? "text-white" : "text-gray-500 hover:text-gray-300",
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
