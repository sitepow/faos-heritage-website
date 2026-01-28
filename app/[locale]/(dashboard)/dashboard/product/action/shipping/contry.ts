'use server'

import type { ShippingCountryInput } from '../../schema/shipping/contry'
import type { Prisma } from '@prisma/client'

import { shippingCountrySchema } from '../../schema/shipping/contry'

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
