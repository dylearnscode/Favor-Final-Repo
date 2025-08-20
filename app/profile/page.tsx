"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { signOut, updateUserProfile } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, LogOut, Edit, Save, X, Star, MessageCircle, Car, BookOpen, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { BottomNav } from "@/components/bottom-nav"

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    username: "",
    fullName: "",
    email: "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    if (profile) {
      setEditData({
        username: profile.username || "",
        fullName: profile.full_name || "",
        email: profile.email || "",
      })
    }
  }, [profile])

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      })
      router.push("/auth/signin")
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setSigningOut(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setError("")

    try {
      await updateUserProfile(user.id, editData)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setEditData({
        username: profile.username || "",
        fullName: profile.full_name || "",
        email: profile.email || "",
      })
    }
    setIsEditing(false)
    setError("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-400 mb-4">Please sign in to view your profile.</p>
            <Button onClick={() => router.push("/auth/signin")} className="bg-white text-black hover:bg-gray-200">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 safe-area-inset">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Profile</h1>
              <p className="text-sm text-gray-400 font-medium">Manage your account</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="w-6 h-6" /> : <Edit className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Info */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-gray-700 text-white text-2xl font-bold">
                  {profile.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-white">{profile.username}</h2>
                  <Badge className="bg-blue-900/50 text-blue-300">Verified</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8 rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>23 reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={editData.username}
                    onChange={(e) => setEditData((prev) => ({ ...prev, username: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={editData.fullName}
                    onChange={(e) => setEditData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-200">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-400 text-sm">Full Name</Label>
                  <p className="text-white">{profile.full_name || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Email</Label>
                  <p className="text-white">{profile.email}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Member Since</Label>
                  <p className="text-white">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Car className="w-6 h-6 text-blue-300" />
                </div>
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-xs text-gray-400">Rides</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-green-300" />
                </div>
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-xs text-gray-400">Materials</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ShoppingBag className="w-6 h-6 text-purple-300" />
                </div>
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-xs text-gray-400">Trades</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 text-white hover:bg-gray-800 bg-transparent"
              onClick={() => router.push("/messages")}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              View Messages
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 text-white hover:bg-gray-800 bg-transparent"
              onClick={() => router.push("/rideshare/post")}
            >
              <Car className="w-4 h-4 mr-2" />
              Create Ride
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 text-white hover:bg-gray-800 bg-transparent"
              onClick={() => router.push("/academic/post")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Share Material
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 text-white hover:bg-gray-800 bg-transparent"
            >
              Privacy Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 text-white hover:bg-gray-800 bg-transparent"
            >
              Notification Preferences
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 text-red-400 hover:bg-red-900/20 bg-transparent"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav activeTab="profile" />
    </div>
  )
}
