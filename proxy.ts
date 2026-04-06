import { Role } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
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

const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''

  const isBot =
    /facebookexternalhit|Facebot|Twitterbot|Pinterest|Googlebot|bingbot|DuckDuckBot/i.test(
      userAgent,
    )

  const isExcluded =
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/s/') ||
    pathname.startsWith('/uploads/')

  if (isExcluded) {
    return NextResponse.next()
  }

  const pathParts = pathname.split('/')
  const localeInPath = pathParts[1]
  const hasValidLocale = routing.locales.includes(localeInPath)

  if (isBot && !hasValidLocale) {
    return intlMiddleware(request)
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const roles = (token?.roles as Role[]) || []
  const loggedIn = !!token

  if (pathname.startsWith('/dashboard')) {
    if (!loggedIn) {
      const cookieLocale =
        request.cookies.get('NEXT_LOCALE')?.value || routing.defaultLocale
      const loginUrl = new URL(`/${cookieLocale}/login`, request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const isAdmin = roles.includes(Role.ADMIN)
    const isStockViewer = roles.includes(Role.STOCK_VIEWER)
    const isStockEditor = roles.includes(Role.STOCK_EDITOR)
    const isStockManager = isStockViewer || isStockEditor
    const isPOS = roles.includes(Role.POS)

    if (isPOS && !isAdmin && !isStockManager) {
      const allowedPaths = ['/dashboard/orders', '/dashboard/contracts']
      const isAccessingAllowed = allowedPaths.some((path) => {
        return pathname.startsWith(path)
      })

      if (!isAccessingAllowed) {
        return NextResponse.redirect(new URL('/dashboard/orders', request.url))
      }
    }

    if (isStockManager && !isAdmin) {
      const allowedPaths = ['/dashboard/inventory', '/dashboard/orders']
      const isAccessingAllowed = allowedPaths.some((path: string) => {
        return pathname.startsWith(path)
      })

      if (!isAccessingAllowed) {
        return NextResponse.redirect(
          new URL('/dashboard/inventory', request.url),
        )
      }
    }

    if (!isAdmin && !isStockManager && !isPOS) {
      const cookieLocale =
        request.cookies.get('NEXT_LOCALE')?.value || routing.defaultLocale
      return NextResponse.redirect(new URL(`/${cookieLocale}`, request.url))
    }

    return NextResponse.next()
  }

  const normalizedPath = stripLocaleFromPath(pathname)

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

  const isProtectedRoute = ROUTES.PROTECTED.some((path: string) => {
    return normalizedPath.startsWith(path)
  })
  const isAuthRoute = ROUTES.AUTH.some((path: string) => {
    return normalizedPath.startsWith(path)
  })

  if (isProtectedRoute && !loggedIn) {
    const loginUrl = new URL(`/${localeInPath}/login`, request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && loggedIn) {
    return NextResponse.redirect(new URL(`/${localeInPath}`, request.url))
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!api|trpc|s/|uploads/|_next|_vercel|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
}

export default middleware
