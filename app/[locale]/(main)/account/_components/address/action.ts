'use server'

import type { Prisma } from '@prisma/client'

import { addressSchema, type AddressInput } from './schema'

import { ERROR_CODES } from '@/lib/errors/error-codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'
import { removeEmptyField } from '@/utils/object'

export type GetAddressResult = Awaited<ReturnType<typeof getAddress>>

export const createAddress = async (data: AddressInput) => {
  try {
    const validatedData = addressSchema.safeParse(data)

    if (!validatedData.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const payload = removeEmptyField(
      validatedData.data,
    ) as Prisma.AddressUncheckedCreateInput

    await prisma.$transaction(async (tx) => {
      if (payload.isDefault) {
        await tx.address.updateMany({
          where: {
            userId: payload.userId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        })
      }

      await tx.address.create({
        data: payload,
      })
    })

    return done()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

export const getAddressCheckout = async (userId: string) => {
  return await prisma.address.findFirst({
    where: { userId, isDefault: true },
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
      isDefault: true,
    },
  })
}

export const getAddress = async (addressId: string) => {
  return await prisma.address.findFirst({
    where: { id: addressId },
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
      isDefault: true,
    },
  })
}

export const getAddresses = async (userId: string) => {
  return await prisma.address.findMany({
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
      isDefault: true,
    },
  })
}

export const updateAddress = async (data: AddressInput) => {
  try {
    const validatedData = addressSchema.safeParse(data)

    if (!validatedData.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, userId, isDefault, ...payload } = validatedData.data

    if (!id || !userId) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    await prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.address.updateMany({
          where: {
            userId,
            NOT: { id },
          },
          data: {
            isDefault: false,
          },
        })
      }

      await tx.address.update({
        where: { id },
        data: {
          ...payload,
          isDefault,
        },
      })
    })

    return done()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

export const deleteAddress = async (addressId: string | null) => {
  try {
    if (!addressId) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    await prisma.$transaction(async (tx) => {
      const address = await tx.address.findUnique({
        where: { id: addressId },
        select: {
          id: true,
          userId: true,
          isDefault: true,
        },
      })

      if (!address) {
        throw new Error('Address not found')
      }

      await tx.address.delete({
        where: { id: addressId },
      })

      if (address.isDefault) {
        const nextDefault = await tx.address.findFirst({
          where: { userId: address.userId },
          orderBy: { createdAt: 'desc' },
        })

        if (nextDefault) {
          await tx.address.update({
            where: { id: nextDefault.id },
            data: { isDefault: true },
          })
        }
      }
    })

    return done()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}
