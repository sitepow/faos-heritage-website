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
  withRole([Role.ADMIN, Role.CUSTOMER], async (currentUserId) => {
    const { role: currentUserRole } = await getServerUser()
    const validated = addressSchema.safeParse(data)

    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, isDefault, ...payload } = validated.data

    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const existing = await tx.address.findUnique({
          where: { id },
        })

        if (!existing) {
          throw new Error('NOT_FOUND')
        }

        const isAdmin = currentUserRole === Role.ADMIN

        if (!isAdmin && existing.userId !== currentUserId) {
          throw new Error('NOT_OWNER')
        }

        const targetUserId = existing.userId

        if (isDefault) {
          await tx.address.updateMany({
            where: { userId: targetUserId, NOT: { id }, isDefault: true },
            data: { isDefault: false },
          })
        }

        await tx.address.update({
          where: { id },
          data: {
            ...omitEmptyFields(payload),
            isDefault,
          },
        })

        return ok()
      })
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteAddress = async (addressId: string) =>
  withRole([Role.ADMIN, Role.CUSTOMER], async (currentUserId) => {
    const { role: currentUserRole } = await getServerUser()
    if (!addressId) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const address = await tx.address.findUnique({
          where: { id: addressId },
          select: { isDefault: true, userId: true },
        })

        if (!address) {
          throw new Error('NOT_FOUND')
        }

        const isAdmin = currentUserRole === Role.ADMIN
        if (!isAdmin && address.userId !== currentUserId) {
          throw new Error('NOT_OWNER')
        }

        const targetUserId = address.userId

        await tx.address.delete({ where: { id: addressId } })

        if (address.isDefault) {
          const nextDefault = await tx.address.findFirst({
            where: { userId: targetUserId },
            orderBy: { createdAt: 'desc' },
          })

          if (nextDefault) {
            await tx.address.update({
              where: { id: nextDefault.id },
              data: { isDefault: true },
            })
          }
        }

        return ok()
      })
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

const getAddressesAdmin = async () => {
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
}

const getAddress = async (addressId: string) => {
  const { userId, role } = await getServerUser()

  if (!userId) {
    return null
  }

  if (role === Role.ADMIN) {
    return await prisma.address.findUnique({
      where: { id: addressId },
    })
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

const getAddressStat = async () =>
  withRole([Role.ADMIN], async () => {
    const [total, defaultAddresses, uniqueUsers] = await Promise.all([
      prisma.address.count(),
      prisma.address.count({ where: { isDefault: true } }),
      prisma.address.groupBy({
        by: ['userId'],
        _count: true,
      }),
    ])

    return [
      { name: 'จำนวนที่อยู่ทั้งหมด', value: total },
      { name: 'ที่อยู่หลัก (Default)', value: defaultAddresses },
      { name: 'ลูกค้าที่มีที่อยู่', value: uniqueUsers.length },
    ]
  })

export {
  createAddress,
  updateAddress,
  deleteAddress,
  getAddressesAdmin,
  getAddresses,
  getAddress,
  getDefaultAddress,
  getAddressStat,
}

export type { GetAddressResult }
