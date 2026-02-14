import { NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import type { NextRequest } from 'next/server'

import { ROUTES } from './constants'

import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const stripLocaleFromPath = (pathname: string): string => {
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)
  const pathWithoutLocale = pathname.replace(localePattern, '')
  return pathWithoutLocale || '/'
}

const isAuthenticated = (request: NextRequest): boolean => {
  return Boolean(
    request.cookies.get('next-auth.session-token') ||
    request.cookies.get('__Secure-next-auth.session-token'),
  )
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathParts = pathname.split('/')
  const localeInPath = pathParts[1]
  const hasValidLocale = routing.locales.includes(localeInPath)

  if (!hasValidLocale) {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
    const finalLocale =
      cookieLocale && routing.locales.includes(cookieLocale)
        ? cookieLocale
        : routing.defaultLocale

    const response = NextResponse.redirect(
      new URL(
        `/${finalLocale}${pathname === '/' ? '' : pathname}`,
        request.url,
      ),
    )
    response.headers.set('x-middleware-cache', 'no-cache')
    return response
  }

  const currentLocale = localeInPath
  const normalizedPath = stripLocaleFromPath(pathname)
  const loggedIn = isAuthenticated(request)

  const isProtectedRoute = ROUTES.PROTECTED.some((path) =>
    normalizedPath.startsWith(path),
  )
  const isAuthRoute = ROUTES.AUTH.some((path) =>
    normalizedPath.startsWith(path),
  )

  if (isProtectedRoute && !loggedIn) {
    const loginUrl = new URL(`/${currentLocale}/login`, request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && loggedIn) {
    return NextResponse.redirect(new URL(`/${currentLocale}`, request.url))
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|favicon.ico|.*\\..*).*)'],
}
