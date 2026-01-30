'use server'

import type { Prisma } from '@prisma/client'

import { variantSchema, type VariantInput } from './productVariant.schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { omitEmptyFields, decimalToNumber } from '@/utils'

export const createVariant = async (data: VariantInput) => {
  const validated = variantSchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  try {
    await prisma.productVariant.create({
      data: omitEmptyFields(validated.data) as Prisma.ProductVariantCreateInput,
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const getVariants = async (productId: string) => {
  return decimalToNumber(
    await prisma.productVariant.findMany({
      where: { productId },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stockQuantity: true,
        isActive: true,
        image: true,
      },
      orderBy: { name: 'desc' },
    }),
  )
}

export const getVariant = async (variantId: string) => {
  return decimalToNumber(
    await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        weight: true,
        stockQuantity: true,
        isActive: true,
      },
    }),
  )
}

export const updateVariant = async (data: VariantInput) => {
  const validated = variantSchema.safeParse(data)

  if (!validated?.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const { id, ...payload } = validated.data

  if (!id) {
    return fail(ERROR_CODES.DATA_NOT_FOUND)
  }

  try {
    await prisma.productVariant.update({
      data: payload as Prisma.ProductVariantCreateInput,
      where: { id },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const deleteVariant = async (variantIds: string | string[]) => {
  const ids = Array.isArray(variantIds) ? variantIds : [variantIds]

  if (!ids.length) {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  try {
    await prisma.productVariant.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}
