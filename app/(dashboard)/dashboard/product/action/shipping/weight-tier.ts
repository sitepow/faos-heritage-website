'use server'

import {
  shippingWeightTierSchema,
  type ShippingWeightTierInput,
} from '../../schema'

import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'

export const createShippingWeightTier = async (
  data: ShippingWeightTierInput,
) => {
  const validated = shippingWeightTierSchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  try {
    await prisma.shippingWeightTier.create({
      data: validated.data,
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}

export const getShippingWeightTiers = async (countryCode: string) => {
  return prisma.shippingWeightTier.findMany({
    where: { countryCode },
    orderBy: { minWeight: 'asc' },
  })
}
