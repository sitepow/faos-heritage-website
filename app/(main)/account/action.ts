'use server'

import type { Prisma } from '@prisma/client'

import { addressSchema, type AddressInput } from './components/address/schema'

import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'
import { removeEmptyField } from '@/utils/object'

export type GetAddressResult = Awaited<ReturnType<typeof getAddress>>

export const createAddress = async (data: AddressInput) => {
  try {
    const validatedData = addressSchema.safeParse(data)

    if (!validatedData?.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    await prisma.address.create({
      data: {
        ...(removeEmptyField(validatedData?.data) as Prisma.AddressCreateInput),
      },
    })

    return done()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

export const getAddress = async (userId: string) => {
  return await prisma.address.findFirst({
    where: { userId: userId },
    select: {
      id: true,
      name: true,
      userId: true,
      phone: true,
      address: true,
      district: true,
      subDistrict: true,
      province: true,
      postalCode: true,
      country: true,
      countryCode: true,
    },
  })
}

export const updateAddress = async (data: AddressInput) => {
  try {
    const validatedData = addressSchema.safeParse(data)

    if (!validatedData.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, ...payload } = validatedData.data

    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    await prisma.address.update({
      data: payload,
      where: { id },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}
