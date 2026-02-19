import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

const GET = async (
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) => {
  try {
    const { code } = await params

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const shortLink = await prisma.shortLink.findUnique({
      where: { code },
      select: {
        url: true,
        id: true,
      },
    })

    if (!shortLink) {
      return NextResponse.json(
        { error: 'Short link not found' },
        { status: 404 },
      )
    }

    prisma.shortLink
      .update({
        where: { id: shortLink.id },
        data: { clicks: { increment: 1 } },
      })
      .catch((err) => console.error('Failed to update clicks:', err))

    return NextResponse.json({ url: shortLink.url })
  } catch (error) {
    console.error('API Shorten Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export { GET }
