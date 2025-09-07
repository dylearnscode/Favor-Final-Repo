"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MessageCircle, Calendar, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, signOut } = useAuth()

  const handleChangeAccount = async () => {
    await signOut()
    router.push("/auth/signin")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <Button
              variant="outline"
              onClick={handleChangeAccount}
              className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
            >
              Change Account
            </Button>
          </div>

          {/* Profile Header */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.full_name || profile?.username || "User"}
                  </h2>
                  <p className="text-gray-600">@{profile?.username || "username"}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <div className="flex gap-4 text-center">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-blue-600">4.8</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-green-600">23</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-purple-600">$1,240</div>
                  <div className="text-sm text-gray-500">Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Concert Ticket Sold</p>
                    <p className="text-sm text-gray-500">Taylor Swift - The Eras Tour</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+$150</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Resume Review Completed</p>
                    <p className="text-sm text-gray-500">Pre-med student consultation</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">+$25</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Food Truck Service</p>
                    <p className="text-sm text-gray-500">Waited in line for Korean BBQ</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">+$8</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Listings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Active Listings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">Dorm Mini Fridge</h4>
                    <Badge variant="secondary">Dorm Items</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Barely used, perfect for small spaces</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs">No rating</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">$75</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-3 w-3 mr-1" />2 msgs
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">MCAT Prep Tutoring</h4>
                    <Badge variant="secondary">Preprofessional Help</Badge>
                  </div>
                  <p className="text-sm text-gray-600">520+ scorer offering personalized sessions</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs">No rating</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">$40/hr</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-3 w-3 mr-1" />5 msgs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
