'use server'

import { ApplicationStatus, Role } from '@prisma/client'
import { Prisma } from '@prisma/client'

import type { PlanType } from '@prisma/client'

import {
  partnerApplicationSchema,
  type PartnerApplicationInput,
} from './schema'

import { PLANS } from '@/constants/plan'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { getServerUser, withRole } from '@/lib/session'

export const createPartnerApplication = async (
  data: PartnerApplicationInput,
) => {
  const { userId } = await getServerUser()
  if (!userId) {
    return fail(ERROR_CODES.UNAUTHORIZED)
  }

  const validated = partnerApplicationSchema.safeParse(data)
  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  try {
    await prisma.partnerApplication.create({
      data: {
        ...validated.data,
        userId,
        status: ApplicationStatus.PENDING,
      },
    })
    return ok()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

export const updateApplicationStatus = async (
  id: string,
  status: ApplicationStatus,
  adminNote?: string,
) =>
  withRole([Role.ADMIN], async () => {
    try {
      await prisma.partnerApplication.update({
        where: { id },
        data: { status, adminNote },
      })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

export const getPartnerApplicationsAdmin = async (page = 1, limit = 20) =>
  withRole([Role.ADMIN], async () => {
    const skip = (page - 1) * limit
    const [items, total] = await prisma.$transaction([
      prisma.partnerApplication.findMany({
        skip,
        take: limit,
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.partnerApplication.count(),
    ])

    return {
      items,
      total,
      totalPages: Math.ceil(total / limit),
    }
  })

export const getCurrentSubscription = async () => {
  const { userId } = await getServerUser()
  if (!userId) return fail(ERROR_CODES.UNAUTHORIZED)

  try {
    const subscription = await prisma.partnerSubscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gte: new Date() },
      },
      include: {
        storefront: {
          select: { name: true, type: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return ok(subscription)
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

export const upgradeSubscription = async (data: {
  storefrontId: string
  planType: PlanType
  durationDays: number
}) => {
  const planConfig = PLANS.find((plan) => plan.type === data.planType)

  if (!planConfig) {
    return fail(ERROR_CODES.BAD_REQUEST)
  }

  const endDate = new Date()
  endDate.setDate(endDate.getDate() + data.durationDays)

  try {
    await prisma.partnerSubscription.upsert({
      where: { storefrontId: data.storefrontId },
      update: {
        plan: data.planType,
        endDate,
        isActive: true,
        maxSku: planConfig.logic.maxSku,
        commissionRate: new Prisma.Decimal(planConfig.logic.commissionRate),
      },
      create: {
        userId: (await getServerUser()).userId!,
        storefrontId: data.storefrontId,
        plan: data.planType,
        endDate,
        isActive: true,
        maxSku: planConfig.logic.maxSku,
        commissionRate: new Prisma.Decimal(planConfig.logic.commissionRate),
      },
    })
    return ok()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

export const getMyApplication = async () => {
  const { userId } = await getServerUser()

  return await prisma.partnerApplication.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}
