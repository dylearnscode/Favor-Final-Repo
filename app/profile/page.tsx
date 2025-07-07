<<<<<<< HEAD
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Your Profile</h1>
      <ProfileForm profile={profile} />
=======
"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Camera, Edit, Plus, MapPin, Calendar, Zap } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { useRouter } from "next/navigation"

interface Service {
  id: string
  title: string
  price: string
  category: string
}

interface FavorRelationship {
  id: string
  user_name: string
  type: "owes_me" | "i_owe"
  description: string
}

export default function Profile() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSliding, setIsSliding] = useState(false)
  const [showAddService, setShowAddService] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    bio: "UCLA Computer Science student. Love helping others with coding and math!",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    location: "Westwood, CA",
    joinDate: "September 2023",
  })

  const [services, setServices] = useState<Service[]>([
    { id: "1", title: "Python Tutoring", price: "$25/hr", category: "Education" },
    { id: "2", title: "Resume Review", price: "$15", category: "Career" },
    { id: "3", title: "Car Wash", price: "$20", category: "Services" },
  ])

  const [favorRelationships] = useState<FavorRelationship[]>([
    { id: "1", user_name: "Sarah K.", type: "owes_me", description: "helped with calculus homework" },
    { id: "2", user_name: "Mike R.", type: "owes_me", description: "gave ride to airport" },
    { id: "3", user_name: "Emma L.", type: "i_owe", description: "borrowed textbook" },
    { id: "4", user_name: "David L.", type: "i_owe", description: "helped with coding project" },
    { id: "5", user_name: "Jessica M.", type: "owes_me", description: "tutored in statistics" },
  ])

  const [newService, setNewService] = useState({
    title: "",
    price: "",
    category: "",
  })

  const handleMessagesClick = () => {
    setIsSliding(true)
    setTimeout(() => {
      router.push("/messages")
    }, 300)
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    // In real app, save to database
  }

  const handleAddService = () => {
    if (newService.title && newService.price && newService.category) {
      const service: Service = {
        id: Date.now().toString(),
        title: newService.title,
        price: newService.price,
        category: newService.category,
      }
      setServices([...services, service])
      setNewService({ title: "", price: "", category: "" })
      setShowAddService(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          avatar: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const owesMe = favorRelationships.filter((rel) => rel.type === "owes_me")
  const iOwe = favorRelationships.filter((rel) => rel.type === "i_owe")

  return (
    <div
      className={`min-h-screen bg-black text-white pb-20 safe-area-inset transition-transform duration-300 ${isSliding ? "translate-x-full" : ""}`}
    >
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 z-10 pt-safe">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-white">Profile</h1>
          <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800" onClick={handleMessagesClick}>
            <div className="relative">
              <div className="w-8 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gray-700 text-white text-xl font-bold">
                    {profileData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white font-bold text-lg"
                    />
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white resize-none"
                      rows={3}
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">{profileData.name}</h2>
                    <p className="text-gray-300 mb-3">{profileData.bio}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {profileData.joinDate}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Save Changes
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-white text-black hover:bg-gray-200 font-bold"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favor Network */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Favor Network</h3>

            {/* People who owe me favors */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">People who owe you favors</h4>
              <div className="flex flex-wrap gap-2">
                {owesMe.map((relationship) => (
                  <div
                    key={relationship.id}
                    className="flex items-center gap-2 bg-green-900/30 border border-green-800 rounded-full px-3 py-1"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-300 font-medium">{relationship.user_name}</span>
                    <span className="text-xs text-green-400">({relationship.description})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* People I owe favors to */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">People you owe favors to</h4>
              <div className="flex flex-wrap gap-2">
                {iOwe.map((relationship) => (
                  <div
                    key={relationship.id}
                    className="flex items-center gap-2 bg-orange-900/30 border border-orange-800 rounded-full px-3 py-1"
                  >
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-sm text-orange-300 font-medium">{relationship.user_name}</span>
                    <span className="text-xs text-orange-400">({relationship.description})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">My Services</h3>
              <Dialog open={showAddService} onOpenChange={setShowAddService}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-black hover:bg-gray-200 font-bold">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add New Service</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Service Title</Label>
                      <Input
                        value={newService.title}
                        onChange={(e) => setNewService((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Math Tutoring"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Price</Label>
                      <Input
                        value={newService.price}
                        onChange={(e) => setNewService((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="e.g., $25/hr"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Category</Label>
                      <Input
                        value={newService.category}
                        onChange={(e) => setNewService((prev) => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Education"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddService} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                        Add Service
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowAddService(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{service.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-blue-900/50 text-blue-300 text-xs">{service.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{service.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav activeTab="profile" />
>>>>>>> c1b4b79 (Complete user authentication flows, UI, and SQL schema for Favor app)
    </div>
  )
}
