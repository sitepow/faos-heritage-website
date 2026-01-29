'use server'

import type {
  ShippingCountryInput,
  ShippingWeightTierInput,
} from './shipping.schema'
import type { Prisma } from '@prisma/client'

import {
  shippingCountrySchema,
  shippingWeightTierSchema,
} from './shipping.schema'

import { ERROR_CODES, fail, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { decimalToNumber } from '@/utils/number'

export type GetShippingCountriesResult = Awaited<
  ReturnType<typeof getShippingCountries>
>
export type GetShippingCountryResult = Awaited<
  ReturnType<typeof getShippingCountry>
>

export const createShippingCountry = async (data: ShippingCountryInput) => {
  const validated = shippingCountrySchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const exists = await prisma.shippingCountry.findUnique({
    where: { countryCode: validated.data.countryCode },
  })

  if (exists) {
    return fail(ERROR_CODES.USER_ALREADY_EXISTS)
  }

  try {
    await prisma.shippingCountry.create({
      data: {
        ...validated.data,
        baseRate: validated.data.baseRate,
        pricePerKg: validated.data.pricePerKg,
      } as Prisma.ShippingCountryCreateInput,
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const getShippingCountries = async () => {
  return decimalToNumber(
    await prisma.shippingCountry.findMany({
      select: {
        id: true,
        countryCode: true,
        countryName: true,
        baseRate: true,
        pricePerKg: true,
        isActive: true,
      },
      where: { isActive: true },
      orderBy: { countryName: 'asc' },
    }),
  )
}

export const getShippingCountry = async (shippingCountryId: string) => {
  return decimalToNumber(
    await prisma.shippingCountry.findUnique({
      where: { id: shippingCountryId },
    }),
  )
}

export const updateShippingCountry = async (data: ShippingCountryInput) => {
  const validated = shippingCountrySchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const { id, ...payload } = validated.data

  if (!id) {
    return fail(ERROR_CODES.DATA_NOT_FOUND)
  }

  try {
    await prisma.shippingCountry.update({
      where: { id },
      data: payload,
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const deleteShippingCountry = async (shippingCountryId: string) => {
  if (!shippingCountryId) {
    return fail(ERROR_CODES.FIELD_REQUIRED)
  }

  try {
    await prisma.shippingCountry.delete({
      where: { id: shippingCountryId },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

type CalculateShippingCostParams = {
  items: {
    quantity: number
    weight: number
  }[]
  countryCode: string
}

export const calculateShippingCost = async ({
  items,
  countryCode,
}: CalculateShippingCostParams): Promise<number> => {
  try {
    if (!items?.length || !countryCode) {
      return 0
    }

    const rawWeightKg =
      items.reduce((sum, item) => sum + item.quantity * item.weight, 0) / 1000

    if (rawWeightKg <= 0) {
      return 0
    }

    const billableWeight = Math.ceil(rawWeightKg)

    const country = await prisma.shippingCountry.findUnique({
      where: { countryCode },
    })

    if (!country) {
      return 0
    }

    const tier = await prisma.shippingWeightTier.findFirst({
      where: {
        countryCode,
        minWeight: { lte: billableWeight },
        maxWeight: { gte: billableWeight },
      },
      orderBy: {
        minWeight: 'desc',
      },
    })

    const baseRate = Number(country.baseRate)
    const defaultPricePerKg = Number(country.pricePerKg)

    if (Number.isNaN(baseRate) || Number.isNaN(defaultPricePerKg)) {
      return 0
    }

    const pricePerKg =
      tier && !Number.isNaN(Number(tier.pricePerKg))
        ? Number(tier.pricePerKg)
        : defaultPricePerKg

    const shippingCost = baseRate + billableWeight * pricePerKg

    return Math.ceil(shippingCost)
  } catch {
    return 0
  }
}

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
