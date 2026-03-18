'use server'

import { StockMovementType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import type { StorefrontInventoryInput } from './schema'

import { ERROR_CODES, fail, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/session'

const transferStorefrontStock = async (input: StorefrontInventoryInput) => {
  const { userId } = await getServerUser()

  return await prisma.$transaction(async (tx) => {
    const {
      storefrontId,
      productId,
      variantId,
      stockQuantity,
      direction,
      retailPrice,
      netPrice,
    } = input
    const isVariant = !!variantId
    const targetId = variantId || productId

    if (direction === 'IN') {
      const mainStock = isVariant
        ? await tx.productVariant.findUnique({
            where: { id: targetId },
            select: { stockQuantity: true },
          })
        : await tx.product.findUnique({
            where: { id: targetId },
            select: { stockQuantity: true },
          })

      if (!mainStock || mainStock.stockQuantity < stockQuantity)
        return fail(ERROR_CODES.BAD_REQUEST)

      if (isVariant) {
        await tx.productVariant.update({
          where: { id: targetId },
          data: { stockQuantity: { decrement: stockQuantity } },
        })
      } else {
        await tx.product.update({
          where: { id: targetId },
          data: { stockQuantity: { decrement: stockQuantity } },
        })
      }
    } else {
      const storeStock = await tx.storefrontInventory.findUnique({
        where: {
          storefrontId_productId_variantId: {
            storefrontId,
            productId,
            variantId: variantId!,
          },
        },
      })

      if (!storeStock || storeStock.stockQuantity < stockQuantity)
        return fail(ERROR_CODES.BAD_REQUEST)
    }

    const amount = direction === 'IN' ? stockQuantity : -stockQuantity
    await tx.storefrontInventory.upsert({
      where: {
        storefrontId_productId_variantId: {
          storefrontId,
          productId,
          variantId: variantId!,
        },
      },
      update: {
        stockQuantity: { increment: amount },
        retailPrice,
        netPrice,
      },
      create: {
        storefrontId,
        productId,
        variantId: variantId ?? null,
        stockQuantity: amount,
        retailPrice,
        netPrice,
      },
    })

    if (direction === 'OUT') {
      if (isVariant) {
        await tx.productVariant.update({
          where: { id: targetId },
          data: { stockQuantity: { increment: stockQuantity } },
        })
      } else {
        await tx.product.update({
          where: { id: targetId },
          data: { stockQuantity: { increment: stockQuantity } },
        })
      }
    }

    await tx.stockHistory.create({
      data: {
        productId,
        variantId: variantId!,
        userId: userId!,
        quantity: amount,
        type: StockMovementType.TRANSFER,
        fromStorefrontId: direction === 'OUT' ? storefrontId : null,
        toStorefrontId: direction === 'IN' ? storefrontId : null,
        note: `${direction === 'IN' ? 'โอนเข้า' : 'โอนคืน'} หน้าร้าน (Net: ${netPrice})`,
      },
    })

    revalidatePath(`/dashboard/storefronts/${storefrontId}`)
    return ok()
  })
}

const getStorefrontInventories = async (storefrontId: string) => {
  return await prisma.storefrontInventory.findMany({
    where: { storefrontId },
    include: {
      product: true,
      variant: true,
    },
    orderBy: { updatedAt: 'desc' },
  })
}

const getStorefrontInventoryDetail = async (id: string) => {
  return await prisma.storefrontInventory.findUnique({
    where: { id },
    include: {
      product: true,
      variant: true,
    },
  })
}

const saveStorefrontInventory = async (input: StorefrontInventoryInput) => {
  const { userId } = await getServerUser()

  return await prisma.$transaction(async (tx) => {
    const {
      storefrontId,
      productId,
      variantId,
      stockQuantity,
      retailPrice,
      netPrice,
    } = input

    const inventory = await tx.storefrontInventory.upsert({
      where: {
        storefrontId_productId_variantId: {
          storefrontId,
          productId,
          variantId: variantId!,
        },
      },
      update: {
        stockQuantity,
        retailPrice,
        netPrice,
      },
      create: {
        storefrontId,
        productId,
        variantId: variantId!,
        stockQuantity,
        retailPrice,
        netPrice,
      },
    })

    await tx.stockHistory.create({
      data: {
        productId,
        variantId: variantId!,
        userId: userId!,
        quantity: stockQuantity,
        type: StockMovementType.TRANSFER,
        toStorefrontId: storefrontId,
        note: `อัปเดตสต็อกหน้าร้าน (Net: ${netPrice})`,
      },
    })

    revalidatePath('/dashboard/storefronts')
    return ok({ id: inventory.id })
  })
}

export {
  transferStorefrontStock,
  getStorefrontInventories,
  getStorefrontInventoryDetail,
  saveStorefrontInventory,
}
