import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Favor - Service Exchange</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Welcome to Favor! Your service exchange platform.</p>

          <div className="flex flex-col gap-2">
            <Link href="/test-connection">
              <Button className="w-full">🔧 Test Database Connection</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" className="w-full">
                Sign Up
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
