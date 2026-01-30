'use server'

import type { Prisma } from '@prisma/client'

import {
  productLocalizationSchema,
  type ProductLocalizationInput,
} from './productLocale.schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'

export const createProductLocalization = async (
  data: ProductLocalizationInput,
) => {
  const validated = productLocalizationSchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const { productId, languageCode } = validated.data

  const exists = await prisma.productLocalization.findUnique({
    where: {
      productId_languageCode: {
        productId,
        languageCode,
      },
    },
  })

  if (exists) {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  try {
    await prisma.productLocalization.create({
      data: validated.data as Prisma.ProductLocalizationUncheckedCreateInput,
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const getProductLocalizations = async (productId: string) => {
  return await prisma.productLocalization.findMany({
    where: { productId },
    orderBy: { languageCode: 'asc' },
  })
}

export const getProductLocalization = async (id: string) => {
  return await prisma.productLocalization.findUnique({
    where: { id },
  })
}

export const updateProductLocalization = async (
  data: ProductLocalizationInput,
) => {
  const validated = productLocalizationSchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const { id, ...payload } = validated.data

  if (!id) {
    return fail(ERROR_CODES.DATA_NOT_FOUND)
  }

  try {
    await prisma.productLocalization.update({
      where: { id },
      data: payload,
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const deleteProductLocalization = async (id: string) => {
  if (!id) {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  try {
    await prisma.productLocalization.delete({
      where: { id },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}
