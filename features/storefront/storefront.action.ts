'use server'

import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { storefrontSchema, type StorefrontInput } from './storefront.schema'

import { ERROR_CODES, fail, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { decimalToNumber } from '@/utils/number'

export type GetStorefrontsResult = Awaited<ReturnType<typeof getStorefronts>>
export type GetActiveStorefrontsResult = Awaited<
  ReturnType<typeof getActiveStorefronts>
>
export type GetStorefrontStatResult = Awaited<
  ReturnType<typeof getStorefrontStatAdmin>
>

const createStorefront = async (data: StorefrontInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = storefrontSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    try {
      const storefront = await prisma.storefront.create({
        data: validated.data,
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
      await prisma.storefront.update({
        where: { id },
        data,
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
  const storefronts = await prisma.storefront.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return decimalToNumber(storefronts)
}

const getActiveStorefronts = async () => {
  const storefronts = await prisma.storefront.findMany({
    where: { isActive: true },
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
  createStorefront,
  updateStorefront,
  deleteStorefront,
  getStorefronts,
  getActiveStorefronts,
  getStorefrontStatAdmin,
}
