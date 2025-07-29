import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = ["/profile", "/messages", "/exchange", "/rideshare"]
  const authRoutes = ["/auth/signin", "/auth/signup"]

  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Redirect to signin if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  // Redirect to home if accessing auth routes with session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
}
// Avery
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
