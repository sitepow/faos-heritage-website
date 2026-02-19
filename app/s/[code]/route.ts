import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) => {
  const { code } = await params

  try {
    const shortLink = await prisma.shortLink.findUnique({
      where: { code },
    })

    if (shortLink?.url) {
      return NextResponse.redirect(new URL(shortLink.url, request.url), 308)
    }
  } catch (error) {
    console.error('Redirect Error:', error)
  }

  return NextResponse.redirect(new URL('/', request.url))
}
