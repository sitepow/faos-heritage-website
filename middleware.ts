import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

import { AUTH_PATHS, PROTECTED_PATHS } from './utils/const'

const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl

  const isLoggedIn = Boolean(
    request.cookies.get('next-auth.session-token') ||
    request.cookies.get('__Secure-next-auth.session-token'),
  )

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path))

  if (isProtected && !isLoggedIn) {
    const url = new URL('/login', request.url)

    url.searchParams.set('callbackUrl', pathname)

    return NextResponse.redirect(url)
  }

  if (isAuthPage && isLoggedIn) {
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

export { middleware }
