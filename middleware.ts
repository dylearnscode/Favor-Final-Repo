import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Only handle auth routes to prevent loops
  const authRoutes = ["/auth/signin", "/auth/signup"]
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  if (isAuthRoute) {
    const bypassAuth = req.cookies.get("favor_bypass_auth")?.value === "true"
    if (bypassAuth) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/auth/:path*"],
}
