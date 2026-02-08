'use server'

import { Role, type Prisma } from '@prisma/client'

import {
  shippingCountrySchema,
  shippingWeightTierSchema,
  type ShippingCountryInput,
  type ShippingWeightTierInput,
} from './shipping.schema'

import { ERROR_CODES, fail, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { decimalToNumber } from '@/utils/number'

type GetShippingCountriesResult = Awaited<
  ReturnType<typeof getShippingCountries>
>
type GetShippingCountryResult = Awaited<ReturnType<typeof getShippingCountry>>

type CalculateShippingCostParams = {
  items: {
    quantity: number
    weight: number
  }[]
  countryCode: string
}

const createShippingCountry = async (data: ShippingCountryInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = shippingCountrySchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const exists = await prisma.shippingCountry.findUnique({
      where: { countryCode: validated.data.countryCode },
    })

    if (exists) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      await prisma.shippingCountry.create({
        data: validated.data as Prisma.ShippingCountryUncheckedCreateInput,
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updateShippingCountry = async (data: ShippingCountryInput) =>
  withRole([Role.ADMIN], async () => {
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

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteShippingCountry = async (shippingCountryId: string) =>
  withRole([Role.ADMIN], async () => {
    if (!shippingCountryId) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      await prisma.shippingCountry.delete({
        where: { id: shippingCountryId },
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const createShippingWeightTier = async (data: ShippingWeightTierInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = shippingWeightTierSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    try {
      await prisma.shippingWeightTier.create({
        data: validated.data,
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getShippingCountries = async () => {
  const countries = await prisma.shippingCountry.findMany({
    where: { isActive: true },
    orderBy: { countryName: 'asc' },
  })

  return decimalToNumber(countries)
}

const getShippingCountry = async (shippingCountryId: string) => {
  const country = await prisma.shippingCountry.findUnique({
    where: { id: shippingCountryId },
  })

  return decimalToNumber(country)
}

const getShippingWeightTiers = async (countryCode: string) => {
  const tiers = await prisma.shippingWeightTier.findMany({
    where: { countryCode },
    orderBy: { minWeight: 'asc' },
  })

  return decimalToNumber(tiers)
}

const calculateShippingCost = async ({
  items,
  countryCode,
}: CalculateShippingCostParams): Promise<number> => {
  try {
    if (!items?.length || !countryCode) {
      return 0
    }

    const totalWeightGrams = items.reduce(
      (sum, item) => sum + item.quantity * item.weight,
      0,
    )

    const rawWeightKg = totalWeightGrams / 1000
    if (rawWeightKg <= 0) {
      return 0
    }

    const billableWeight = Math.ceil(rawWeightKg)

    const [country, tier] = await Promise.all([
      prisma.shippingCountry.findUnique({ where: { countryCode } }),
      prisma.shippingWeightTier.findFirst({
        where: {
          countryCode,
          minWeight: { lte: billableWeight },
          maxWeight: { gte: billableWeight },
        },
        orderBy: { minWeight: 'desc' },
      }),
    ])

    if (!country) {
      return 0
    }

    const baseRate = Number(country.baseRate) || 0
    const pricePerKg = tier
      ? Number(tier.pricePerKg)
      : Number(country.pricePerKg) || 0

    const shippingCost = baseRate + billableWeight * pricePerKg

    return Math.ceil(shippingCost)
  } catch {
    return 0
  }
}

export {
  createShippingCountry,
  getShippingCountries,
  getShippingCountry,
  updateShippingCountry,
  deleteShippingCountry,
  calculateShippingCost,
  createShippingWeightTier,
  getShippingWeightTiers,
}

export type {
  GetShippingCountriesResult,
  GetShippingCountryResult,
  CalculateShippingCostParams,
}
