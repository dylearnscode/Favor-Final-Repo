"use client"
import { useRouter, usePathname } from "next/navigation"
import { Home, Car, MessageCircle, User, ArrowLeftRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab?: string
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const getActiveTab = () => {
    if (activeTab) return activeTab
    if (pathname === "/") return "home"
    if (pathname.startsWith("/rideshare")) return "rideshare"
    if (pathname.startsWith("/exchange")) return "exchange"
    if (pathname.startsWith("/messages")) return "messages"
    if (pathname.startsWith("/profile")) return "profile"
    return "home"
  }

  const currentTab = getActiveTab()

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: Home,
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
      icon: ArrowLeftRight,
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 safe-area-pb">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1",
                  isActive ? "text-white" : "text-gray-500 hover:text-gray-300",
                )}
              >
                <Icon className={cn("w-6 h-6 mb-1", isActive && "text-white")} />
                <span className={cn("text-xs font-medium", isActive && "text-white")}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BottomNav
