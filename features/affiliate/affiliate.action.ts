'use server'

import { AffiliateStatus, Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import {
  affiliateProfileSchema,
  type AffiliateProfileInput,
} from './affiliate.schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { decimalToNumber, getAuthSession } from '@/utils'

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
      const item = await prisma.affiliateProfile.update({
        where: { id },
        data: { status },
      })

      revalidatePath('/dashboard/affiliates')

      return ok(decimalToNumber(item))
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const registerAffiliate = async (data: AffiliateProfileInput) => {
  const session = await getAuthSession()
  const userId = session?.user?.id

  if (!userId) {
    return fail(ERROR_CODES.UNAUTHORIZED)
  }

  const validated = affiliateProfileSchema.safeParse(data)
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

const getAffiliateProfile = async () => {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    return null
  }

  const profile = await prisma.affiliateProfile.findUnique({
    where: { userId: session.user.id },
  })

  return profile ? decimalToNumber(profile) : null
}

type GetAffiliatesResult = Awaited<ReturnType<typeof getAffiliates>>
type UpdateAffiliateStatusResult = Awaited<
  ReturnType<typeof updateAffiliateStatus>
>

export {
  getAffiliates,
  updateAffiliateStatus,
  registerAffiliate,
  getAffiliateProfile,
}
export type { GetAffiliatesResult, UpdateAffiliateStatusResult }
