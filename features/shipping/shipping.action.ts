'use server'

import { Role, type Prisma } from '@prisma/client'

import {
  shippingCountrySchema,
  type ShippingCountryInput,
} from './shipping.schema'

import {
  BASE_RATE_DEFAULT,
  GRAMS_PER_KILOGRAM,
  KG_DEFAULT,
  PRICE_PER_KG_DEFAULT,
  SHIPPING_COST_DEFAULT,
} from '@/constants'
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

const calculateShippingCost = async ({
  items,
  countryCode,
}: CalculateShippingCostParams): Promise<number> => {
  try {
    if (!items?.length || !countryCode) {
      return SHIPPING_COST_DEFAULT
    }

    const totalWeightGrams = items.reduce(
      (sum, item) => sum + item.quantity * item.weight,
      KG_DEFAULT,
    )

    const rawWeightKg = totalWeightGrams / GRAMS_PER_KILOGRAM
    if (rawWeightKg <= KG_DEFAULT) {
      return KG_DEFAULT
    }

    const billableWeight = Math.ceil(rawWeightKg)

    const country = await prisma.shippingCountry.findUnique({
      where: { countryCode },
    })

    if (!country) {
      return SHIPPING_COST_DEFAULT
    }

    const baseRate = Number(country.baseRate) || BASE_RATE_DEFAULT
    const pricePerKg = Number(country.pricePerKg) || PRICE_PER_KG_DEFAULT
    const shippingCost = baseRate + billableWeight * pricePerKg

    return Math.ceil(shippingCost)
  } catch {
    return SHIPPING_COST_DEFAULT
  }
}

export {
  createShippingCountry,
  getShippingCountries,
  getShippingCountry,
  updateShippingCountry,
  deleteShippingCountry,
  calculateShippingCost,
}

export type {
  GetShippingCountriesResult,
  GetShippingCountryResult,
  CalculateShippingCostParams,
}
