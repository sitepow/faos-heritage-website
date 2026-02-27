'use server'

import { Role, type Prisma } from '@prisma/client'

import { addressSchema, type AddressInput } from './address.schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { getServerUser, withRole } from '@/lib/session'
import { omitEmptyFields } from '@/utils'

type GetAddressResult = Awaited<ReturnType<typeof getAddress>>

const createAddress = async (data: AddressInput) =>
  withRole([Role.ADMIN, Role.CUSTOMER], async (userId) => {
    const validated = addressSchema.safeParse(data)

    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const payload = {
      ...omitEmptyFields(validated.data),
      userId,
    } as Prisma.AddressUncheckedCreateInput

    try {
      await prisma.$transaction(async (tx) => {
        if (payload.isDefault) {
          await tx.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
          })
        }

        await tx.address.create({ data: payload })
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updateAddress = async (data: AddressInput) =>
  withRole([Role.ADMIN, Role.CUSTOMER], async (userId) => {
    const validated = addressSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, isDefault, ...payload } = validated.data
    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    try {
      await prisma.$transaction(async (tx) => {
        const existing = await tx.address.findUnique({
          where: { id, userId },
        })

        if (!existing) {
          throw new Error('NOT_OWNER')
        }

        if (isDefault) {
          await tx.address.updateMany({
            where: { userId, NOT: { id }, isDefault: true },
            data: { isDefault: false },
          })
        }

        await tx.address.update({
          where: { id },
          data: { ...payload, isDefault },
        })
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteAddress = async (addressId: string) =>
  withRole([Role.ADMIN, Role.CUSTOMER], async (userId) => {
    if (!addressId) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      await prisma.$transaction(async (tx) => {
        const address = await tx.address.findUnique({
          where: { id: addressId, userId },
          select: { isDefault: true },
        })

        if (!address) {
          throw new Error('NOT_FOUND')
        }

        await tx.address.delete({ where: { id: addressId } })

        if (address.isDefault) {
          const nextDefault = await tx.address.findFirst({
            where: { userId },
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

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getAddresses = async (userIdProp?: string) => {
  const { userId } = await getServerUser()
  const activeUserId = userIdProp || userId

  if (!activeUserId) {
    return []
  }

  return await prisma.address.findMany({
    where: { userId: activeUserId },
    orderBy: { isDefault: 'desc' },
  })
}

const getAddressesAdmin = async () =>
  withRole([Role.ADMIN], async () => {
    try {
      const items = await prisma.address.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      return items
    } catch {
      return []
    }
  })

const getAddress = async (addressId: string) => {
  const { userId } = await getServerUser()

  if (!userId) {
    return null
  }

  return await prisma.address.findFirst({
    where: { id: addressId, userId },
  })
}

const getDefaultAddress = async (userIdProp?: string) => {
  const { userId } = await getServerUser()
  const activeUserId = userIdProp || userId

  if (!activeUserId) {
    return null
  }

  return await prisma.address.findFirst({
    where: { userId: activeUserId, isDefault: true },
  })
}

export {
  createAddress,
  updateAddress,
  deleteAddress,
  getAddressesAdmin,
  getAddresses,
  getAddress,
  getDefaultAddress,
}

export type { GetAddressResult }
