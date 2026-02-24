'use server'

import { Prisma, ReviewStatus } from '@prisma/client' // นำเข้า Prisma สำหรับ Type Guard
import { unstable_noStore as noStore } from 'next/cache'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/session'

const getProductReviews = async (productId: string) => {
  noStore()
  const { userId } = await getServerUser()

  const [reviews, stats, userReview] = await Promise.all([
    prisma.review.findMany({
      where: { productId, status: ReviewStatus.APPROVED },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.aggregate({
      where: { productId, status: ReviewStatus.APPROVED },
      _avg: { rating: true },
      _count: { id: true },
    }),
    userId
      ? prisma.review.findUnique({
          where: {
            productId_userId: { productId, userId },
          },
        })
      : null,
  ])

  return {
    reviews,
    averageRating: stats._avg.rating || 0,
    totalReviews: stats._count.id,
    hasReviewed: !!userReview,
  }
}

const createReview = async (data: {
  productId: string
  rating: number
  comment: string
  title?: string
}) => {
  const { userId } = await getServerUser()
  if (!userId) {
    return fail(ERROR_CODES.UNAUTHORIZED)
  }

  try {
    const review = await prisma.review.create({
      data: {
        ...data,
        userId,
        status: ReviewStatus.APPROVED,
      },
    })

    return ok(review)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return fail(ERROR_CODES.SYSTEM_ERROR)
      }
    }

    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

export { getProductReviews, createReview }
