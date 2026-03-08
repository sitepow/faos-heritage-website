'use server'

import { StockMovementType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { ERROR_CODES, fail, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/session'

interface StockAdjustmentInput {
  productId: string
  variantId?: string | null
  quantity: number
  type: StockMovementType
  location?: string
  note?: string
  reference?: string
}

const processStockAdjustment = async (input: StockAdjustmentInput) => {
  const { userId } = await getServerUser()

  return await prisma.$transaction(async (tx) => {
    const { productId, variantId, quantity, type, location, note, reference } =
      input

    const isVariant = !!variantId
    const targetId = variantId || productId

    const isIncrement =
      type === StockMovementType.RESTOCK || type === StockMovementType.RETURN
    const amount = isIncrement ? Math.abs(quantity) : -Math.abs(quantity)

    if (amount < 0) {
      const current = isVariant
        ? await tx.productVariant.findUnique({
            where: { id: targetId },
            select: { stockQuantity: true },
          })
        : await tx.product.findUnique({
            where: { id: targetId },
            select: { stockQuantity: true },
          })

      if (!current || current.stockQuantity < Math.abs(amount)) {
        return fail(ERROR_CODES.BAD_REQUEST)
      }
    }

    if (isVariant) {
      await tx.productVariant.update({
        where: { id: targetId },
        data: { stockQuantity: { increment: amount } },
      })
    } else {
      await tx.product.update({
        where: { id: targetId },
        data: { stockQuantity: { increment: amount } },
      })
    }

    await tx.stockHistory.create({
      data: {
        productId: productId,
        variantId: variantId ?? undefined,
        userId: userId ?? null,
        quantity: amount,
        type: type,
        location: location,
        note: note,
        reference: reference,
      },
    })

    revalidatePath('/dashboard/inventory')
    revalidatePath(`/dashboard/inventory/${productId}/stock-history`)

    return ok()
  })
}

export { processStockAdjustment }
