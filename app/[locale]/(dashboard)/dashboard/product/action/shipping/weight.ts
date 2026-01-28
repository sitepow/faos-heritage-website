'use server'

import type { ShippingWeightTierInput } from '../../schema/shipping/weight'

import { shippingWeightTierSchema } from '../../schema/shipping/weight'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
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

  return ok()
}

export const getShippingWeightTiers = async (countryCode: string) => {
  return prisma.shippingWeightTier.findMany({
    where: { countryCode },
    orderBy: { minWeight: 'asc' },
  })
}
