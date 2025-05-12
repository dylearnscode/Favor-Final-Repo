"use client"

import { useState } from "react"
import Link from "next/link"
import { FavorLogo } from "./favor-logo"
import { Button } from "@/components/ui/button"
import { User, Search, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSupabase } from "./supabase-provider"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MobileHeader() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [mode, setMode] = useState<"buy" | "sell">("buy")

  // Fetch user data
  useState(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()
        setProfile(profileData)
      }
    }
    fetchUser()
  })

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleModeChange = (value: string) => {
    setMode(value as "buy" | "sell")
    if (value === "buy") {
      router.push("/services?type=offering")
    } else {
      router.push("/services?type=requesting")
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800 pt-safe">
      <div className="container px-4 py-3">
        <div className="flex items-center justify-between">
          <FavorLogo size="sm" />

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user ? (
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || ""} />
                      <AvatarFallback>
                        {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {user ? (
                  <>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{profile?.username || user.email}</p>
                        {profile?.description && <p className="text-xs text-muted-foreground">{profile.description}</p>}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/payment-methods">Payment Methods</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Log in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup">Sign up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-3">
          <Tabs defaultValue={mode} onValueChange={handleModeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 rounded-full h-10">
              <TabsTrigger value="buy" className="rounded-full data-[state=active]:bg-primary">
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="rounded-full data-[state=active]:bg-primary">
                Sell
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  )
}
