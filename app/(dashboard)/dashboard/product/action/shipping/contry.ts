'use server'

import type { ShippingCountryInput } from '../../schema'
import type { Prisma } from '@prisma/client'

import { shippingCountrySchema } from '../../schema'

import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'

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
    return fail(ERROR_CODES.DATA_ALREADY_EXISTS)
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

  return done()
}

export const getShippingCountries = async () => {
  return prisma.shippingCountry.findMany({
    where: { isActive: true },
    orderBy: { countryName: 'asc' },
  })
}

export const getShippingCountry = async (countryCode: string) => {
  if (!countryCode) {
    return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
  }

  const country = await prisma.shippingCountry.findUnique({
    where: { countryCode },
  })

  if (!country) {
    return fail(ERROR_CODES.DATA_NOT_FOUND)
  }

  return country
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

  return done()
}
