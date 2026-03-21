'use server'

import { StockMovementType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import type { StorefrontInventoryInput } from './schema'

import { ERROR_CODES, fail, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/session'
import { decimalToNumber } from '@/utils'

const transferStorefrontStock = async (input: StorefrontInventoryInput) => {
  const { userId } = await getServerUser()

  return await prisma.$transaction(async (tx) => {
    const {
      storefrontId,
      productId,
      variantId,
      stockQuantity = 0,
      direction,
      retailPrice,
      netPrice,
    } = input

    if (!direction || stockQuantity <= 0) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

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

    const mainAmount = direction === 'IN' ? -stockQuantity : stockQuantity
    if (isVariant) {
      await tx.productVariant.update({
        where: { id: targetId },
        data: { stockQuantity: { increment: mainAmount } },
      })
    } else {
      await tx.product.update({
        where: { id: targetId },
        data: { stockQuantity: { increment: mainAmount } },
      })
    }

    const storeAmount = direction === 'IN' ? stockQuantity : -stockQuantity
    await tx.storefrontInventory.upsert({
      where: {
        storefrontId_productId_variantId: {
          storefrontId,
          productId,
          variantId: variantId!,
        },
      },
      update: {
        stockQuantity: { increment: storeAmount },
        ...(retailPrice !== undefined && { retailPrice }),
        ...(netPrice !== undefined && { netPrice }),
      },
      create: {
        storefrontId,
        productId,
        variantId: variantId ?? null,
        stockQuantity: storeAmount,
        retailPrice: retailPrice ?? 0,
        netPrice: netPrice ?? 0,
      },
    })

    await tx.stockHistory.create({
      data: {
        productId,
        variantId: variantId ?? null,
        userId: userId!,
        quantity: storeAmount,
        type: StockMovementType.TRANSFER,
        fromStorefrontId: direction === 'OUT' ? storefrontId : null,
        toStorefrontId: direction === 'IN' ? storefrontId : null,
        note: `${direction === 'IN' ? 'โอนเข้า' : 'โอนคืน'} หน้าร้าน`,
      },
    })

    revalidatePath(`/dashboard/storefronts/${storefrontId}`)
    return ok()
  })
}

const saveStorefrontInventory = async (input: StorefrontInventoryInput) => {
  const { userId } = await getServerUser()

  return await prisma.$transaction(async (tx) => {
    const {
      storefrontId,
      productId,
      variantId,
      retailPrice = 0,
      netPrice = 0,
    } = input

    const inventory = await tx.storefrontInventory.update({
      where: {
        storefrontId_productId_variantId: {
          storefrontId,
          productId,
          variantId: variantId ?? '',
        },
      },
      data: {
        retailPrice,
        netPrice,
      },
    })

    await tx.stockHistory.create({
      data: {
        productId,
        variantId: variantId!,
        userId: userId!,
        quantity: 0,
        type: StockMovementType.TRANSFER,
        toStorefrontId: storefrontId,
        note: `อัปเดตราคาหน้าร้านใหม่ (Retail: ${retailPrice}, Net: ${netPrice})`,
      },
    })

    revalidatePath(`/dashboard/storefronts/${storefrontId}`)
    return ok({ id: inventory.id })
  })
}

const getStorefrontInventories = async (storefrontId: string) => {
  const data = await prisma.storefrontInventory.findMany({
    where: { storefrontId },
    include: {
      product: {
        include: {
          images: {
            orderBy: { isPrimary: 'desc' },
          },
        },
      },
      variant: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  return decimalToNumber(data)
}

const getStorefrontInventoryDetail = async (id: string) => {
  const data = await prisma.storefrontInventory.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          images: {
            orderBy: { isPrimary: 'desc' },
          },
        },
      },
      variant: true,
    },
  })

  return decimalToNumber(data)
}

export {
  transferStorefrontStock,
  getStorefrontInventories,
  getStorefrontInventoryDetail,
  saveStorefrontInventory,
}
