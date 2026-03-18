'use server'

import { Role } from '@prisma/client'

import {
  categoryLocalizationSchema,
  type CategoryLocalizationInput,
} from './schema'

import { SUPPORTED_APP_LOCALES } from '@/constants'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'

const upsertCategoryLocale = async (data: CategoryLocalizationInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = categoryLocalizationSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, categoryId, languageCode, name } = validated.data

    try {
      if (id) {
        await prisma.categoryLocalization.update({
          where: { id },
          data: { name },
        })
      } else {
        await prisma.categoryLocalization.create({
          data: { categoryId, languageCode, name },
        })
      }
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getCategoryLocales = async (categoryId: string) => {
  return await prisma.categoryLocalization.findMany({
    where: { categoryId },
    orderBy: { languageCode: 'asc' },
  })
}

const deleteCategoryLocale = async (id: string) =>
  withRole([Role.ADMIN], async () => {
    try {
      await prisma.categoryLocalization.delete({ where: { id } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getCategoryLocaleStat = async (categoryId: string) => {
  const translatedCount = await prisma.categoryLocalization.count({
    where: { categoryId },
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
  upsertCategoryLocale,
  getCategoryLocales,
  deleteCategoryLocale,
  getCategoryLocaleStat,
}
