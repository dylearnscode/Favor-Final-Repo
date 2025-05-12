"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Search, PlusCircle, MessageSquare, User } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Search", href: "/search", icon: <Search className="h-5 w-5" /> },
    { name: "Post", href: "/create-post", icon: <PlusCircle className="h-5 w-5" /> },
    { name: "Messages", href: "/dashboard?tab=messages", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Profile", href: "/profile", icon: <User className="h-5 w-5" /> },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? "text-primary" : "text-gray-400"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
