"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { signOut, updateUserProfile } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Calendar, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        full_name: profile.full_name || "",
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
      await updateUserProfile(user.id, formData)
      setEditing(false)
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
      setFormData({
        username: profile.username || "",
        full_name: profile.full_name || "",
      })
    }
    setEditing(false)
    setError("")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    router.push("/auth/signin")
    return null
  }

  const userInitials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : profile?.username?.[0]?.toUpperCase() || "U"

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="text-lg font-semibold">{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{profile?.full_name || profile?.username || "User"}</h1>
                <p className="text-gray-600">@{profile?.username || "username"}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} disabled={signingOut}>
              {signingOut ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
              Sign Out
            </Button>
          </CardHeader>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your basic account details and information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Joined:</span>
              <span className="font-medium">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Recently"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your profile information and preferences</CardDescription>
              </div>
              {!editing && (
                <Button onClick={() => setEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                disabled={!editing}
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.full_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                disabled={!editing}
                placeholder="Enter full name"
              />
            </div>

            {editing && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Your activity and engagement on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Favors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Messages</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
