"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSupabase } from "./supabase-provider"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Menu, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FavorLogo } from "./favor-logo"
import { StarRating } from "./star-rating"

export default function Header() {
  const pathname = usePathname()
  const { supabase } = useSupabase()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        setProfile(data)
      }

      setLoading(false)
    }

    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  // Hide header on certain mobile pages where we use the mobile nav
  const hideOnMobile = ["/", "/search", "/dashboard", "/profile"]
  const shouldHideOnMobile = hideOnMobile.includes(pathname) || pathname.startsWith("/services")

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Browse", href: "/services?type=offering" },
    { name: "Request", href: "/services?type=requesting" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-gray-800" : "bg-transparent"
      } ${shouldHideOnMobile ? "md:flex hidden" : "flex"}`}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <FavorLogo />

          <nav className="hidden md:flex items-center gap-6 ml-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <>
                  <Button variant="ghost" size="icon" className="rounded-full md:flex hidden" asChild>
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
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || ""} />
                          <AvatarFallback>
                            {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{profile?.username || user.email}</p>
                          {profile?.description && (
                            <p className="text-xs text-muted-foreground">{profile.description}</p>
                          )}
                          {profile?.rating && (
                            <div className="flex items-center">
                              <StarRating rating={profile.rating} />
                            </div>
                          )}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Log in</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Sign up</Button>
                  </Link>
                </>
              )}
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-8">
                <FavorLogo size="lg" />
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {user && (
                    <>
                      <Link href="/dashboard" className="text-sm font-medium">
                        Dashboard
                      </Link>
                      <Link href="/profile" className="text-sm font-medium">
                        Profile
                      </Link>
                      <Button variant="ghost" className="justify-start p-0" onClick={handleSignOut}>
                        Log out
                      </Button>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
