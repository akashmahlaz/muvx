import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "@/lib/auth-server"

// Routes that require authentication AND an active organization
const protectedRoutes = [
  "/dashboard",
  "/loads",
  "/trips",
  "/invoices",
  "/fleet",
  "/drivers",
  "/reports",
  "/payroll",
  "/accounts-payable",
  "/expense-review",
  "/carrier-pay",
  "/settings",
]

// Routes that require authentication but NOT an organization (onboarding/redirect)
const authOnlyRoutes = ["/onboarding", "/select-org", "/auth-redirect"]

// Public routes (redirect authenticated users with orgs away)
const publicRoutes = ["/login", "/signup", "/signup/verify"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(`[PROXY] ${request.method} ${pathname}`)

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  const isAuthOnlyRoute = authOnlyRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  // Get session
  const session = await getSession()
  const isAuthenticated = !!session
  const hasOrg = !!session?.session?.activeOrganizationId

  console.log(
    `[PROXY] Path: ${pathname} | Auth: ${isAuthenticated} | HasOrg: ${hasOrg}`
  )

  // Case 1: Unauthenticated user trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    console.log(`[PROXY] Redirecting unauthenticated user to /login`)
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Case 2: Authenticated user without org trying to access protected routes
  if (isProtectedRoute && isAuthenticated && !hasOrg) {
    console.log(`[PROXY] Auth user without org, redirecting to /onboarding`)
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  // Case 3: Authenticated user with org trying to access auth-only routes
  if (isAuthOnlyRoute && isAuthenticated && hasOrg) {
    console.log(`[PROXY] Auth user with org, redirecting to /dashboard`)
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Case 4: Authenticated user with org trying to access public routes
  if (isPublicRoute && isAuthenticated && hasOrg) {
    console.log(`[PROXY] Auth user with org, redirecting to /dashboard`)
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (api/auth, api/*)
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
  ],
}
