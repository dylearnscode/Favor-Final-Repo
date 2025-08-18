import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Only protect auth routes - redirect authenticated users away from auth pages
  const authRoutes = ["/auth/signin", "/auth/signup"]
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // If user is on auth route and has bypass flag, redirect to home
  if (isAuthRoute) {
    const bypassAuth = req.cookies.get("favor_bypass_auth")?.value === "true"
    if (bypassAuth) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
