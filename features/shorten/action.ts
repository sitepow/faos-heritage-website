'use server'

import { nanoid } from 'nanoid'

import { prisma } from '@/lib/prisma'

const createShortLinkAction = async (longUrl: string) => {
  try {
    const existing = await prisma.shortLink.findFirst({
      where: { url: longUrl },
    })

    if (existing) {
      return {
        success: true,
        shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/s/${existing.code}`,
      }
    }

    const shortCode = nanoid(6)

    const newShortLink = await prisma.shortLink.create({
      data: {
        code: shortCode,
        url: longUrl,
      },
    })

    return {
      success: true,
      shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/s/${newShortLink.code}`,
    }
  } catch {
    return { success: false, error: 'Failed to create link' }
  }
}

export { createShortLinkAction }
