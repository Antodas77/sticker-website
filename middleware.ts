import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

/**
 * Server-side edge middleware that protects all /admin routes.
 *
 * Uses @supabase/ssr createServerClient to properly read and refresh
 * the session stored in cookies by the browser client (createBrowserClient).
 *
 * Runs BEFORE any page renders — no client-side JS required.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only guard /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Create a Supabase server client that reads/writes cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write refreshed cookies back to both the request and response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Validate the session (also refreshes the token if expired)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Not authenticated — redirect to login with the original destination
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated — proceed with any refreshed cookies attached
  return response
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
