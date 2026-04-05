'use server'

import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { storefrontSchema, type StorefrontInput } from './schema'

import { ERROR_CODES, fail, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { getServerUser, withRole } from '@/lib/session'
import { decimalToNumber } from '@/utils/number'

export type GetStorefrontsResult = Awaited<ReturnType<typeof getStorefronts>>
export type GetActiveStorefrontsResult = Awaited<
  ReturnType<typeof getActiveStorefronts>
>
export type GetStorefrontStatResult = Awaited<
  ReturnType<typeof getStorefrontStatAdmin>
>

const getStorefrontInventory = async (storefrontId: string) => {
  if (!storefrontId) {
    return []
  }

  const inventory = await prisma.storefrontInventory.findMany({
    where: { storefrontId },
    include: {
      product: {
        select: {
          name: true,
          images: true,
        },
      },
      variant: {
        select: {
          name: true,
          price: true,
        },
      },
    },
  })

  return decimalToNumber(inventory)
}

const getMainStorefronts = async () => {
  const storefronts = await prisma.storefront.findMany({
    where: {
      isActive: true,
      isMain: true,
    },
    orderBy: { name: 'asc' },
  })

  return decimalToNumber(storefronts)
}

const createStorefront = async (data: StorefrontInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = storefrontSchema.safeParse(data)

    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    try {
      const { managerIds, ...rest } = validated.data

      const storefront = await prisma.storefront.create({
        data: {
          ...rest,
          managers: {
            connect: managerIds?.map((id) => ({ id })) || [],
          },
        },
      })
      revalidatePath('/dashboard/storefront')
      return ok(storefront.id)
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updateStorefront = async (id: string, data: Partial<StorefrontInput>) =>
  withRole([Role.ADMIN], async () => {
    try {
      const { managerIds = [], ...rest } = data

      await prisma.storefront.update({
        where: { id },
        data: {
          ...rest,
          managers: {
            set: managerIds.map((userId: string) => ({ id: userId })),
          },
        },
      })
      revalidatePath('/dashboard/storefront')
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteStorefront = async (id: string) =>
  withRole([Role.ADMIN], async () => {
    try {
      await prisma.storefront.delete({
        where: { id },
      })
      revalidatePath('/dashboard/storefront')
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getStorefronts = async () => {
  const [storefronts, stockStats] = await Promise.all([
    prisma.storefront.findMany({
      include: {
        managers: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.storefrontInventory.groupBy({
      by: ['storefrontId'],
      _sum: {
        stockQuantity: true,
      },
    }),
  ])

  const stockMap = new Map(
    stockStats.map((stat) => {
      return [stat.storefrontId, stat._sum.stockQuantity || 0]
    }),
  )

  const result = storefronts.map((s) => {
    return {
      ...s,
      totalStock: stockMap.get(s.id) || 0,
    }
  })

  return decimalToNumber(result)
}

const getActiveStorefronts = async ({
  ignoreAdmin = false,
}: {
  ignoreAdmin?: boolean
} = {}) => {
  const { userId, roles } = await getServerUser()

  const isAdmin = roles.includes(Role.ADMIN)

  const storefronts = await prisma.storefront.findMany({
    where: {
      isActive: true,
      isMain: false,
      ...(!ignoreAdmin &&
        !isAdmin && {
          managers: {
            some: { id: userId },
          },
        }),
    },
    orderBy: { name: 'asc' },
  })

  return decimalToNumber(storefronts)
}

const getStorefrontStatAdmin = async () => {
  const [total, active, inactive] = await Promise.all([
    prisma.storefront.count(),
    prisma.storefront.count({ where: { isActive: true } }),
    prisma.storefront.count({ where: { isActive: false } }),
  ])

  return ok([
    { name: 'สาขาทั้งหมด', value: total },
    { name: 'เปิดให้บริการ', value: active },
    { name: 'ปิดปรับปรุง', value: inactive },
  ])
}

export {
  getStorefrontInventory,
  getMainStorefronts,
  createStorefront,
  updateStorefront,
  deleteStorefront,
  getStorefronts,
  getActiveStorefronts,
  getStorefrontStatAdmin,
}
