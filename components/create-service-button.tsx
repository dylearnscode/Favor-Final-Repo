"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface CreateServiceButtonProps {
  type: "offering" | "requesting"
}

export function CreateServiceButton({ type }: CreateServiceButtonProps) {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push(`/dashboard/services/new?type=${type}`)}
      className="flex items-center gap-2"
      size="lg"
    >
      <Plus className="h-5 w-5" />
      <span>Post {type === "offering" ? "Service" : "Request"}</span>
    </Button>
  )
}
