"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, MessageSquare, User, X, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSupabase } from "./supabase-provider"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { supabase } = useSupabase()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }

    getUser()
  }, [supabase])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Actions for all users
  const commonActions = [{ icon: <Search className="h-5 w-5" />, label: "Search", href: "/search" }]

  // Actions for logged-in users
  const authActions = [
    { icon: <Plus className="h-5 w-5" />, label: "Post", href: "/dashboard/services/new" },
    { icon: <MessageSquare className="h-5 w-5" />, label: "Messages", href: "/dashboard?tab=messages" },
    { icon: <User className="h-5 w-5" />, label: "Profile", href: "/profile" },
  ]

  // Actions for guest users
  const guestActions = [{ icon: <LogIn className="h-5 w-5" />, label: "Sign In", href: "/auth" }]

  // Determine which actions to show
  const actions = loading
    ? commonActions
    : user
      ? [...commonActions, ...authActions]
      : [...commonActions, ...guestActions]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col-reverse gap-3 items-end">
          {actions.map((action, index) => (
            <div
              key={action.href}
              className="flex items-center gap-2 animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="bg-gray-900 text-white py-1 px-3 rounded-full text-sm shadow-lg">{action.label}</span>
              <Link href={action.href}>
                <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90 shadow-lg">
                  {action.icon}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <Button
        size="icon"
        className={`rounded-full h-14 w-14 shadow-lg ${isOpen ? "bg-gray-800" : "bg-primary"} transition-all duration-300`}
        onClick={toggleMenu}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  )
}
