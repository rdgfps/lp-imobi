import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const AUTH_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "__Host-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "__Host-next-auth.session-token",
]

function hasAuthCookie(request: NextRequest) {
  return AUTH_COOKIE_NAMES.some((name) => Boolean(request.cookies.get(name)))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminPath = pathname.startsWith("/admin")
  if (!isAdminPath) {
    return NextResponse.next()
  }

  const isLoginPage = pathname === "/admin/login"
  const isLoggedIn = hasAuthCookie(request)

  if (isLoginPage) {
    return isLoggedIn
      ? NextResponse.redirect(new URL("/admin/dashboard", request.url))
      : NextResponse.next()
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
