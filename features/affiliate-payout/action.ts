'use server'

import { PayoutStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { decimalToNumber } from '@/utils'

interface PayoutData {
  affiliateId: string
  amount: number
  payoutProofImage?: string
  notes?: string
  startDate?: string
  endDate?: string
  selectedIds?: string[]
}

const getAffiliateCommissions = async (affiliateId: string) => {
  const items = await prisma.affiliateCommission.findMany({
    where: { affiliateId },
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
      affiliate: {
        select: {
          bankName: true,
          bankAccountNo: true,
          bankAccountName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return decimalToNumber(items)
}

const getPendingPayouts = async (
  params: {
    affiliateId?: string
    startDate?: string
    endDate?: string
  } = {},
) => {
  const { affiliateId, startDate, endDate } = params
  const where: Prisma.AffiliateCommissionWhereInput = {}

  if (affiliateId) {
    where.affiliateId = affiliateId
  }

  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    }
  }

  const commissionsSummary = await prisma.affiliateCommission.groupBy({
    by: ['affiliateId', 'status'],
    where,
    _sum: {
      commissionAmount: true,
    },
  })

  return decimalToNumber(commissionsSummary)
}

const createAffiliatePayout = async (data: PayoutData) => {
  return prisma.$transaction(async (tx) => {
    const payout = await tx.affiliatePayout.create({
      data: {
        affiliateId: data.affiliateId,
        amount: data.amount,
        payoutProofImage: data.payoutProofImage,
        notes: data.notes,
        status: PayoutStatus.PAID,
      },
    })

    const commissionWhere: Prisma.AffiliateCommissionWhereInput = {
      affiliateId: data.affiliateId,
      status: PayoutStatus.COMPLETED,
    }

    if (data.selectedIds && data.selectedIds.length > 0) {
      commissionWhere.id = { in: data.selectedIds }
    } else if (data.startDate && data.endDate) {
      commissionWhere.createdAt = {
        gte: new Date(data.startDate),
        lte: new Date(data.endDate),
      }
    }

    await tx.affiliateCommission.updateMany({
      where: commissionWhere,
      data: {
        status: PayoutStatus.PAID,
        payoutId: payout.id,
      },
    })

    revalidatePath('/dashboard/affiliates')
    revalidatePath(`/dashboard/affiliates/${data.affiliateId}`)

    return decimalToNumber(payout)
  })
}
const getWithdrawableAmountByDate = async (
  affiliateId: string,
  startDate?: string,
  endDate?: string,
  selectedIds?: string[],
) => {
  const where: Prisma.AffiliateCommissionWhereInput = {
    affiliateId,
    status: PayoutStatus.COMPLETED,
  }

  if (selectedIds && selectedIds.length > 0) {
    where.id = { in: selectedIds }
  } else if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    }
  } else {
    return 0
  }

  const result = await prisma.affiliateCommission.aggregate({
    where,
    _sum: {
      commissionAmount: true,
    },
  })

  return Number(result._sum.commissionAmount || 0)
}

const getAffiliatePayouts = async (affiliateId: string) => {
  const items = await prisma.affiliatePayout.findMany({
    where: { affiliateId },
    include: {
      commissions: {
        select: {
          id: true,
          orderId: true,
          commissionAmount: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return decimalToNumber(items)
}

type GetPendingPayoutsResult = Awaited<ReturnType<typeof getPendingPayouts>>
type CreateAffiliatePayoutResult = Awaited<
  ReturnType<typeof createAffiliatePayout>
>
type GetAffiliateCommissionsResult = Awaited<
  ReturnType<typeof getAffiliateCommissions>
>
type GetAffiliatePayoutsResult = Awaited<ReturnType<typeof getAffiliatePayouts>>

export {
  getAffiliateCommissions,
  createAffiliatePayout,
  getPendingPayouts,
  getWithdrawableAmountByDate,
  getAffiliatePayouts,
}
export type {
  GetPendingPayoutsResult,
  CreateAffiliatePayoutResult,
  GetAffiliateCommissionsResult,
  PayoutData,
  GetAffiliatePayoutsResult,
}
