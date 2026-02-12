'use server'

import { Role, type Prisma } from '@prisma/client'

import { variantSchema, type VariantInput } from './productVariant.schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { omitEmptyFields, decimalToNumber } from '@/utils'

const createVariant = async (data: VariantInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = variantSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    try {
      await prisma.productVariant.create({
        data: omitEmptyFields(
          validated.data,
        ) as Prisma.ProductVariantUncheckedCreateInput,
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updateVariant = async (data: VariantInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = variantSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, ...payload } = validated.data
    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    try {
      await prisma.productVariant.update({
        where: { id },
        data: payload as Prisma.ProductVariantUncheckedUpdateInput,
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteVariant = async (variantIds: string | string[]) =>
  withRole([Role.ADMIN], async () => {
    const ids = Array.isArray(variantIds) ? variantIds : [variantIds]
    if (!ids.length) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      await prisma.productVariant.deleteMany({
        where: { id: { in: ids } },
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getVariants = async (productId: string) => {
  const variants = await prisma.productVariant.findMany({
    where: { productId },
    select: {
      id: true,
      name: true,
      price: true,
      stockQuantity: true,
      isActive: true,
      image: true,
    },
    orderBy: { name: 'asc' },
  })

  return decimalToNumber(variants)
}

const getVariant = async (variantId: string) => {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    select: {
      id: true,
      name: true,
      price: true,
      weight: true,
      stockQuantity: true,
      isActive: true,
    },
  })

  return decimalToNumber(variant)
}

export { createVariant, getVariants, getVariant, updateVariant, deleteVariant }
