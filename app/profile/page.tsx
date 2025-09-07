"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageCircle, Calendar, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <Button variant="outline" onClick={() => router.push("/auth/signin")} size="sm">
              Change Account
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profile?.full_name || profile?.username || "User"}</h2>
                  <p className="text-gray-600">@{profile?.username || "username"}</p>
                  <p className="text-sm text-gray-500">{profile?.email || user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Recently"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>UCLA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Services Posted</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-2xl font-bold">0.0</span>
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Start by posting a service or booking one!</p>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Edit Profile
              </Button>
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
    </ProtectedRoute>
  )
}
