import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function middleware(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
    const isProtectedPage = ["/", "/rideshare", "/exchange", "/messages", "/profile"].includes(request.nextUrl.pathname)

    // If user is not authenticated and trying to access protected routes
    if (!session && isProtectedPage) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    // If user is authenticated and trying to access auth pages
    if (session && isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}
