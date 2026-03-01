'use server'

import { Role, type Prisma } from '@prisma/client'

import {
  shippingCountrySchema,
  type ShippingCountryInput,
} from './shipping.schema'

import { SHIPPING_COST_DEFAULT } from '@/constants'
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

    const { weightTiers, ...payload } = validated.data

    const exists = await prisma.shippingCountry.findUnique({
      where: { countryCode: payload.countryCode },
    })

    if (exists) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      await prisma.shippingCountry.create({
        data: {
          ...payload,
          weightTiers: {
            create: weightTiers.map((tier) => ({
              minWeight: tier.minWeight,
              maxWeight: tier.maxWeight,
              rate: tier.rate,
            })),
          },
        } as Prisma.ShippingCountryCreateInput,
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

    const { id, weightTiers, ...payload } = validated.data
    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.shippingWeightTier.deleteMany({
          where: { shippingCountryId: id },
        })

        await tx.shippingCountry.update({
          where: { id },
          data: {
            ...payload,
            weightTiers: {
              create: weightTiers.map((tier) => ({
                minWeight: tier.minWeight,
                maxWeight: tier.maxWeight,
                rate: tier.rate,
              })),
            },
          },
        })
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
    include: { weightTiers: true },
    orderBy: { countryName: 'asc' },
  })

  return decimalToNumber(countries)
}

const getShippingCountry = async (shippingCountryId: string) => {
  const country = await prisma.shippingCountry.findUnique({
    where: { id: shippingCountryId },
    include: { weightTiers: { orderBy: { minWeight: 'asc' } } },
  })

  return decimalToNumber(country)
}

const calculateShippingCost = async ({
  items,
  countryCode,
  totalPrice,
}: CalculateShippingCostParams & { totalPrice: number }): Promise<number> => {
  try {
    const country = await prisma.shippingCountry.findUnique({
      where: { countryCode },
      include: { weightTiers: { orderBy: { minWeight: 'asc' } } },
    })

    if (!country) {
      return SHIPPING_COST_DEFAULT
    }

    if (
      country.freeShippingThreshold &&
      totalPrice >= Number(country.freeShippingThreshold)
    ) {
      return 0
    }

    const totalWeightGrams = items.reduce(
      (sum, item) => sum + item.quantity * item.weight,
      0,
    )
    const weightKg = totalWeightGrams / 1000

    const matchedTier = country.weightTiers.find(
      (tier) =>
        weightKg >= Number(tier.minWeight) &&
        weightKg <= Number(tier.maxWeight),
    )

    if (matchedTier) {
      return Math.ceil(Number(matchedTier.rate))
    }

    const billableWeight = Math.ceil(weightKg)
    const baseRate = Number(country.baseRate)
    const pricePerKg = Number(country.pricePerKg)

    return Math.ceil(baseRate + billableWeight * pricePerKg)
  } catch {
    return SHIPPING_COST_DEFAULT
  }
}

const getShippingStatAdmin = async () =>
  withRole([Role.ADMIN], async () => {
    const [total, active, inactive] = await Promise.all([
      prisma.shippingCountry.count(),
      prisma.shippingCountry.count({ where: { isActive: true } }),
      prisma.shippingCountry.count({ where: { isActive: false } }),
    ])

    return [
      { name: 'ประเทศทั้งหมด', value: total },
      { name: 'เปิดใช้งานการส่ง', value: active },
      { name: 'ปิดใช้งานการส่ง', value: inactive },
    ]
  })

export {
  createShippingCountry,
  getShippingCountries,
  getShippingCountry,
  updateShippingCountry,
  deleteShippingCountry,
  calculateShippingCost,
  getShippingStatAdmin,
}

export type {
  GetShippingCountriesResult,
  GetShippingCountryResult,
  CalculateShippingCostParams,
}
