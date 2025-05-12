import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "./star-rating"
import { Button } from "./ui/button"
import { MessageSquare } from "lucide-react"

interface SellerProfileProps {
  profile: any
}

export function SellerProfile({ profile }: SellerProfileProps) {
  // Add a default rating if not present
  const rating = profile.rating || 5.0

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>About the Provider</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.avatar_url || ""} />
            <AvatarFallback>{profile.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold">{profile.full_name || profile.username}</h3>
            {profile.description && <p className="text-sm text-muted-foreground">{profile.description}</p>}
            <div className="flex items-center mt-1">
              <StarRating rating={rating} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {profile.bio && (
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Bio</h4>
            <p className="text-sm">{profile.bio}</p>
          </div>
        )}

        <Button variant="outline" className="w-full" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" /> Contact
        </Button>
      </CardContent>
    </Card>
  )
}
