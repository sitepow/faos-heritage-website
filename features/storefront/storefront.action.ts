'use server'

import { revalidatePath } from 'next/cache'

import type { StorefrontInput } from './storefront.schema'

import { ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/session'

const getStorefronts = async () => {
  const items = await prisma.storefront.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return ok(items)
}

const getActiveStorefronts = async () => {
  const items = await prisma.storefront.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
  return ok(items)
}

const createStorefront = async (data: StorefrontInput) =>
  withAuth(async () => {
    const item = await prisma.storefront.create({
      data,
    })
    revalidatePath('/dashboard/storefront')
    return ok(item)
  })

const updateStorefront = async (id: string, data: Partial<StorefrontInput>) =>
  withAuth(async () => {
    const item = await prisma.storefront.update({
      where: { id },
      data,
    })
    revalidatePath('/dashboard/storefront')
    return ok(item)
  })

const deleteStorefront = async (id: string) =>
  withAuth(async () => {
    await prisma.storefront.delete({
      where: { id },
    })
    revalidatePath('/dashboard/storefront')
    return ok()
  })

export {
  getStorefronts,
  getActiveStorefronts,
  createStorefront,
  updateStorefront,
  deleteStorefront,
}
