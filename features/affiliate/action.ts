'use server'

import { AffiliateStatus, PayoutStatus, Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { getAffiliateProfileSchema, type AffiliateProfileInput } from './schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { getServerUser, withRole } from '@/lib/session'
import { decimalToNumber } from '@/utils'

const generateUniqueAffiliateCode = async (): Promise<string> => {
  const prefix = 'FAOS-'
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  let isUnique = false

  while (!isUnique) {
    let suffix = ''
    for (let i = 0; i < 4; i++) {
      suffix += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    code = `${prefix}${suffix}`

    const existing = await prisma.affiliateProfile.findUnique({
      where: { affiliateCode: code },
      select: { id: true },
    })

    if (!existing) {
      isUnique = true
    }
  }

  return code
}

const getAffiliates = async () => {
  const items = await prisma.affiliateProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return decimalToNumber(items)
}

const updateAffiliateStatus = async (id: string, status: AffiliateStatus) =>
  withRole([Role.ADMIN], async () => {
    try {
      const updateData: Parameters<
        typeof prisma.affiliateProfile.update
      >[0]['data'] = {
        status,
      }

      if (status === AffiliateStatus.APPROVED) {
        const currentProfile = await prisma.affiliateProfile.findUnique({
          where: { id },
          select: { affiliateCode: true },
        })

        if (!currentProfile?.affiliateCode) {
          updateData.affiliateCode = await generateUniqueAffiliateCode()
        }
      }

      const item = await prisma.affiliateProfile.update({
        where: { id },
        data: updateData,
      })

      revalidatePath('/dashboard/affiliates')

      return ok(decimalToNumber(item))
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const registerAffiliate = async (data: AffiliateProfileInput) => {
  const { userId } = await getServerUser()

  if (!userId) {
    return fail(ERROR_CODES.UNAUTHORIZED)
  }

  const t = (key: string) => key
  const schema = getAffiliateProfileSchema(t)

  const validated = schema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  try {
    const profile = await prisma.affiliateProfile.upsert({
      where: { userId },
      update: {
        ...validated.data,
        status: AffiliateStatus.PENDING,
      },
      create: {
        ...validated.data,
        userId,
      },
    })

    revalidatePath('/dashboard/affiliates')
    return ok(decimalToNumber(profile))
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

const getAffiliateById = async (id: string) => {
  const item = await prisma.affiliateProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  if (!item) {
    return null
  }

  return decimalToNumber(item)
}

const getAffiliateProfile = async () => {
  const { userId } = await getServerUser()

  if (!userId) {
    return null
  }

  const profile = await prisma.affiliateProfile.findUnique({
    where: { userId },
  })

  if (!profile) {
    return null
  }

  return decimalToNumber(profile)
}

const getAffiliateDashboardData = async () => {
  const { userId } = await getServerUser()

  if (!userId) {
    return {
      totalEarnings: 0,
      pendingAmount: 0,
      totalOrders: 0,
      recentCommissions: [],
    }
  }

  const profile = await prisma.affiliateProfile.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (!profile) {
    return {
      totalEarnings: 0,
      pendingAmount: 0,
      totalOrders: 0,
      recentCommissions: [],
    }
  }

  const [commissions, stats, pendingStats] = await Promise.all([
    prisma.affiliateCommission.findMany({
      where: { affiliateId: profile.id },
      include: {
        order: {
          include: {
            items: {
              select: {
                productName: true,
                variantName: true,
                quantity: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.affiliateCommission.aggregate({
      where: { affiliateId: profile.id },
      _sum: {
        commissionAmount: true,
      },
      _count: {
        id: true,
      },
    }),
    prisma.affiliateCommission.aggregate({
      where: {
        affiliateId: profile.id,
        status: PayoutStatus.PENDING,
      },
      _sum: {
        commissionAmount: true,
      },
    }),
  ])

  return {
    totalEarnings: Number(stats._sum.commissionAmount || 0),
    pendingAmount: Number(pendingStats._sum.commissionAmount || 0),
    totalOrders: stats._count.id,
    recentCommissions: decimalToNumber(commissions),
  }
}

type GetAffiliatesResult = Awaited<ReturnType<typeof getAffiliates>>
type UpdateAffiliateStatusResult = Awaited<
  ReturnType<typeof updateAffiliateStatus>
>
export type AffiliateDashboardData = Awaited<
  ReturnType<typeof getAffiliateDashboardData>
>

export {
  getAffiliates,
  updateAffiliateStatus,
  registerAffiliate,
  getAffiliateProfile,
  getAffiliateDashboardData,
  getAffiliateById,
}
export type { GetAffiliatesResult, UpdateAffiliateStatusResult }
