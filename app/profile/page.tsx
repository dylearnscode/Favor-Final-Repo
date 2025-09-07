"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { BottomNav } from "@/components/bottom-nav"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "")
      setUsername(profile.username || "")
    }
  }, [profile])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    // TODO: Implement profile update API
    setEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">Please sign in to view your profile</p>
              <Button onClick={() => router.push("/auth/signin")}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Profile</h1>
          <Button variant="outline" size="sm" onClick={() => router.push("/auth/signin")}>
            Change Account
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-lg">
                  {profile?.full_name?.[0] || profile?.username?.[0] || user.email?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{profile?.full_name || "No name set"}</h2>
                <p className="text-gray-600">@{profile?.username || "No username"}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <Separator />

            {editing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <p className="text-sm text-gray-600 mt-1">{profile?.full_name || "Not set"}</p>
                </div>
                <div>
                  <Label>Username</Label>
                  <p className="text-sm text-gray-600 mt-1">{profile?.username || "Not set"}</p>
                </div>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">Services Posted</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">Transactions</p>
              </div>
              <div>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Settings
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Help & Support
            </Button>
            <Button variant="destructive" className="w-full justify-start" onClick={handleSignOut}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
