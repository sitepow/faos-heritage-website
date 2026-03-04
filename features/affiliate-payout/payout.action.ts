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
}

const getPendingPayouts = async (startDate?: string, endDate?: string) => {
  const where: Prisma.AffiliateCommissionWhereInput = {
    status: PayoutStatus.PENDING,
  }

  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    }
  }

  const pendingCommissions = await prisma.affiliateCommission.groupBy({
    by: ['affiliateId'],
    where,
    _sum: {
      commissionAmount: true,
    },
  })

  return decimalToNumber(pendingCommissions)
}

const createAffiliatePayout = async (data: PayoutData) => {
  const payout = await prisma.affiliatePayout.create({
    data: {
      affiliateId: data.affiliateId,
      amount: data.amount,
      payoutProofImage: data.payoutProofImage,
      notes: data.notes,
      status: PayoutStatus.COMPLETED,
    },
  })

  const commissionWhere: Prisma.AffiliateCommissionWhereInput = {
    affiliateId: data.affiliateId,
    status: PayoutStatus.PENDING,
  }

  if (data.startDate && data.endDate) {
    commissionWhere.createdAt = {
      gte: new Date(data.startDate),
      lte: new Date(data.endDate),
    }
  }

  await prisma.affiliateCommission.updateMany({
    where: commissionWhere,
    data: { status: PayoutStatus.COMPLETED },
  })

  revalidatePath('/dashboard/affiliates')

  return decimalToNumber(payout)
}

type GetPendingPayoutsResult = Awaited<ReturnType<typeof getPendingPayouts>>
type CreateAffiliatePayoutResult = Awaited<
  ReturnType<typeof createAffiliatePayout>
>

export { createAffiliatePayout, getPendingPayouts }
export type { GetPendingPayoutsResult, CreateAffiliatePayoutResult, PayoutData }
