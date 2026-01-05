import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import type { NextRequest } from 'next/server'

import { routing } from '@/i18n/routing'
import { AUTH_PATHS, PROTECTED_PATHS } from '@/utils/constants'

const intlMiddleware = createMiddleware(routing)

function stripLocale(pathname: string) {
  const regex = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)
  return pathname.replace(regex, '') || '/'
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const normalizedPath = stripLocale(pathname)

  const isLoggedIn = Boolean(
    request.cookies.get('next-auth.session-token') ||
    request.cookies.get('__Secure-next-auth.session-token'),
  )

  const isProtected = PROTECTED_PATHS.some((path) =>
    normalizedPath.startsWith(path),
  )

  const isAuthPage = AUTH_PATHS.some((path) => normalizedPath.startsWith(path))

  if (isProtected && !isLoggedIn) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|favicon.ico|.*\\..*).*)'],
}
