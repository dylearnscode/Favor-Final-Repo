"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSupabase } from "./supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Plus, Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MyServicesProps {
  userId: string
}

export function MyServices({ userId }: MyServicesProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"offering" | "requesting">("offering")

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error

        setServices(data || [])
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load services",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [supabase, userId, toast])

  const handleDelete = async () => {
    if (!serviceToDelete) return

    try {
      const { error } = await supabase.from("services").delete().eq("id", serviceToDelete)

      if (error) throw error

      setServices(services.filter((service) => service.id !== serviceToDelete))

      toast({
        title: "Success",
        description: "Service deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      })
    } finally {
      setServiceToDelete(null)
    }
  }

  if (loading) {
    return <div>Loading your services...</div>
  }

  const offeringServices = services.filter((service) => service.is_offering)
  const requestingServices = services.filter((service) => !service.is_offering)

  const displayServices = activeTab === "offering" ? offeringServices : requestingServices

  const emptyState = (
    <div className="text-center py-12 bg-secondary rounded-lg">
      <h3 className="text-lg font-medium mb-2">
        {activeTab === "offering" ? "You haven't offered any services yet" : "You haven't requested any services yet"}
      </h3>
      <p className="text-muted-foreground mb-6">
        {activeTab === "offering" ? "Start by offering your first service" : "Start by requesting your first service"}
      </p>
      <Link href={`/dashboard/services/new?type=${activeTab}`}>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {activeTab === "offering" ? "Offer Service" : "Request Service"}
        </Button>
      </Link>
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="offering" onValueChange={(value) => setActiveTab(value as "offering" | "requesting")}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="offering" className="data-[state=active]:bg-primary">
              My Offerings
            </TabsTrigger>
            <TabsTrigger value="requesting" className="data-[state=active]:bg-primary">
              My Requests
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Link href={`/dashboard/services/new?type=${activeTab}`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {activeTab === "offering" ? "Offer Service" : "Request Service"}
          </Button>
        </Link>
      </div>

      {displayServices.length === 0 ? (
        emptyState
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayServices.map((service) => (
            <Card key={service.id} className="bg-secondary border-none overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={service.status === "active" ? "outline" : "secondary"}>{service.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 mb-2">{service.description}</p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="bg-background/50">
                    {service.category}
                  </Badge>
                  <p className="font-bold">${service.price}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border pt-4">
                <Link href={`/services/${service.id}`}>
                  <Button variant="outline">View</Button>
                </Link>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setServiceToDelete(service.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your service listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
