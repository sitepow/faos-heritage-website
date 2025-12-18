'use server'

import type { Prisma } from '@prisma/client'

import { variantSchema, type VariantInput } from '../schema/variant'

import { removeEmptyField } from '@/utils/helper'
import { getPrismaError, prisma } from '@/utils/prisma'

const EXECUTE_FIELD = {
  id: true,
  name: true,
  sku: true,
  price: true,
  stockQuantity: true,
  isActive: true,
}

const createVariant = async (data: VariantInput) => {
  try {
    const validatedData = variantSchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    await prisma.productVariant.create({
      data: removeEmptyField(
        validatedData.data,
      ) as Prisma.ProductVariantCreateInput,
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getVariants = async (productId: string) => {
  try {
    return prisma.productVariant.findMany({
      where: { productId },
      select: EXECUTE_FIELD,
      orderBy: { name: 'desc' },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getVariant = async (variantId: string) => {
  try {
    if (!variantId) {
      throw new Error('Please specify the product code you want.')
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: EXECUTE_FIELD,
    })

    if (!variant) {
      throw new Error('No product option information found.')
    }

    return variant
  } catch (error) {
    getPrismaError(error)
  }
}

const updateVariant = async (data: VariantInput) => {
  try {
    const validatedData = variantSchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    const { id, ...payload } = validatedData.data

    if (!id) throw new Error('Product ID not found.')

    await prisma.productVariant.update({
      data: payload as Prisma.ProductVariantCreateInput,
      where: { id },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const deleteVariant = async (variantIds: string | string[]) => {
  try {
    const ids = Array.isArray(variantIds) ? variantIds : [variantIds]

    if (!ids.length) {
      throw new Error('Please specify the product code you want.')
    }

    await prisma.productVariant.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

export { createVariant, deleteVariant, getVariant, getVariants, updateVariant }
