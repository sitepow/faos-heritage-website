'use server'

import { Prisma, ReviewStatus, Role } from '@prisma/client'
import { unstable_noStore as noStore } from 'next/cache'

import type { ReviewModerationInput } from './schema'

import { reviewModerationSchema } from './schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { getServerUser, withRole } from '@/lib/session'

const getReviews = async (productId: string) => {
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

const getAllReviewsAdmin = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit

  const [items, total] = await prisma.$transaction([
    prisma.review.findMany({
      skip,
      take: limit,
      include: {
        user: { select: { name: true, email: true, image: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count(),
  ])

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

const getReviewStats = async () =>
  withRole([Role.ADMIN], async () => {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.review.count(),
      prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
      prisma.review.count({ where: { status: ReviewStatus.APPROVED } }),
      prisma.review.count({ where: { status: ReviewStatus.REJECTED } }),
    ])

    return [
      { name: 'รีวิวทั้งหมด', value: total },
      { name: 'รอตรวจสอบ', value: pending },
      { name: 'อนุมัติแล้ว', value: approved },
      { name: 'ไม่อนุมัติ', value: rejected },
    ]
  })

const moderateReview = async (data: ReviewModerationInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = reviewModerationSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, ...payload } = validated.data
    try {
      await prisma.review.update({
        where: { id },
        data: payload,
      })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

export {
  getAllReviewsAdmin,
  getReviews,
  createReview,
  moderateReview,
  getReviewStats,
}
