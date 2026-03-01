'use server'

import { Role, type Prisma } from '@prisma/client'

import {
  productLocalizationSchema,
  type ProductLocalizationInput,
} from './product-localization.schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'

const createProductLocalization = async (data: ProductLocalizationInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = productLocalizationSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { productId, languageCode } = validated.data

    try {
      const exists = await prisma.productLocalization.findUnique({
        where: {
          productId_languageCode: { productId, languageCode },
        },
      })

      if (exists) {
        return fail(ERROR_CODES.BAD_REQUEST)
      }

      await prisma.productLocalization.create({
        data: validated.data as Prisma.ProductLocalizationUncheckedCreateInput,
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

    const { id, ...payload } = validated.data
    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    try {
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

const getProductLocaleStat = async (productId: string) =>
  withRole([Role.ADMIN], async () => {
    const [total, languages] = await Promise.all([
      prisma.productLocalization.count({ where: { productId } }),
      prisma.productLocalization.findMany({
        where: { productId },
        select: { languageCode: true },
      }),
    ])

    return [
      {
        name: 'ภาษาที่แปลแล้ว',
        value: total,
      },
      {
        name: 'จำนวนรหัสภาษาทั้งหมด',
        value: languages.length,
      },
      {
        name: 'ความสมบูรณ์เนื้อหา (%)',
        value: total > 0 ? 100 : 0,
      },
    ]
  })

export {
  createProductLocalization,
  getProductLocalizations,
  getProductLocalization,
  updateProductLocalization,
  deleteProductLocalization,
  getProductLocaleStat,
}
