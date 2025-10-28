import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value

  const isLoggedIn = !!sessionToken

  const protectedPaths = ['/dashboard', '/cart']
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  )

  const authPaths = ['/login', '/register']
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path))

  if (isProtectedPath && !isLoggedIn) {
    const url = new URL('/login', request.url)

    url.searchParams.set('callbackUrl', pathname)

    return NextResponse.redirect(url)
  }

  if (isAuthPath && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
