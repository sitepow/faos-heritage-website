import { NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import type { NextRequest } from 'next/server'

import { ROUTES } from './constants'

import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const stripLocaleFromPath = (pathname: string): string => {
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)

  return pathname.replace(localePattern, '') || '/'
}

const isAuthenticated = (request: NextRequest): boolean => {
  return Boolean(
    request.cookies.get('next-auth.session-token') ||
    request.cookies.get('__Secure-next-auth.session-token'),
  )
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const normalizedPath = stripLocaleFromPath(pathname)
  const loggedIn = isAuthenticated(request)

  const isProtectedRoute = ROUTES.PROTECTED.some((path) =>
    normalizedPath.startsWith(path),
  )

  const isAuthRoute = ROUTES.AUTH.some((path) =>
    normalizedPath.startsWith(path),
  )

  if (isProtectedRoute && !loggedIn) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('callbackUrl', pathname)

    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && loggedIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|favicon.ico|.*\\..*).*)'],
}
