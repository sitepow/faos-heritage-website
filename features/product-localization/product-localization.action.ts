/* eslint-disable no-unused-vars */
'use server'

import { Role, type Prisma } from '@prisma/client'

import {
  productLocalizationSchema,
  type ProductLocalizationInput,
} from './product-localization.schema'

import { SUPPORTED_APP_LOCALES } from '@/constants'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { omitEmptyFields } from '@/utils'

const createProductLocalization = async (data: ProductLocalizationInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = productLocalizationSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { productId, languageCode, name, ...rest } = validated.data

    try {
      const exists = await prisma.productLocalization.findUnique({
        where: {
          productId_languageCode: { productId, languageCode },
        },
      })

      if (exists) {
        return fail(ERROR_CODES.BAD_REQUEST)
      }

      const payload = omitEmptyFields({
        ...rest,
        name,
        keywords: rest.keywords || [],
      })

      await prisma.productLocalization.create({
        data: {
          ...payload,
          productId,
          languageCode,
        } as Prisma.ProductLocalizationUncheckedCreateInput,
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updateProductLocalization = async (data: ProductLocalizationInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = productLocalizationSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, productId, languageCode, name, ...rest } = validated.data
    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    try {
      const payload = omitEmptyFields({
        ...rest,
        name,
        keywords: rest.keywords || [],
      })

      await prisma.productLocalization.update({
        where: { id },
        data: payload as Prisma.ProductLocalizationUpdateInput,
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteProductLocalization = async (id: string) =>
  withRole([Role.ADMIN], async () => {
    if (!id) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      await prisma.productLocalization.delete({
        where: { id },
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getProductLocalizations = async (productId: string) => {
  const localizations = await prisma.productLocalization.findMany({
    where: { productId },
    orderBy: { languageCode: 'asc' },
  })
  return localizations || []
}

const getProductLocalization = async (id: string) => {
  const localization = await prisma.productLocalization.findUnique({
    where: { id },
  })

  return localization || null
}

const getProductLocaleStat = async (productId: string) => {
  const translatedCount = await prisma.productLocalization.count({
    where: { productId },
  })

  const totalSystemLanguages = SUPPORTED_APP_LOCALES.length
  const pendingCount = Math.max(0, totalSystemLanguages - translatedCount)

  const labels = ['ภาษาที่แปลแล้ว', 'รอการแปล', 'รวมเป้าหมาย']
  const values = [translatedCount, pendingCount, totalSystemLanguages]

  return labels.map((label, idx) => ({
    name: label,
    value: values[idx],
  }))
}

export {
  createProductLocalization,
  getProductLocalizations,
  getProductLocalization,
  updateProductLocalization,
  deleteProductLocalization,
  getProductLocaleStat,
}
