import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the token from localStorage or cookie
  const token = request.cookies.get("token")?.value

  // Check if the user is trying to access a protected route
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/teams') ||
    request.nextUrl.pathname.startsWith('/projects') ||
    request.nextUrl.pathname.startsWith('/chats')

  // If accessing a protected route and not authenticated, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If accessing login page and already authenticated, redirect to teams
  if (request.nextUrl.pathname.startsWith('/auth/login') && token) {
    return NextResponse.redirect(new URL("/teams", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Protected routes
    '/teams/:path*',
    '/projects/:path*',
    '/chats/:path*',
    // Auth routes
    '/auth/login',
  ],
}