'use server'

import { Role } from '@prisma/client'

import { tagLocalizationSchema, type TagLocalizationInput } from './schema'

import { SUPPORTED_APP_LOCALES } from '@/constants'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'

const upsertTagLocale = async (data: TagLocalizationInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = tagLocalizationSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, tagId, languageCode, name } = validated.data

    try {
      if (id) {
        await prisma.tagLocalization.update({
          where: { id },
          data: { name },
        })
      } else {
        await prisma.tagLocalization.create({
          data: { tagId, languageCode, name },
        })
      }
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getTagLocale = async (id: string) => {
  if (!id) {
    return null
  }

  try {
    return await prisma.tagLocalization.findUnique({
      where: { id },
    })
  } catch {
    return null
  }
}

const getTagLocales = async (tagId: string) => {
  const items = await prisma.tagLocalization.findMany({
    where: { tagId },
    orderBy: { languageCode: 'asc' },
  })
  return items
}

const deleteTagLocale = async (id: string) =>
  withRole([Role.ADMIN], async () => {
    try {
      await prisma.tagLocalization.delete({ where: { id } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getTagLocaleStat = async (tagId: string) => {
  const translatedCount = await prisma.tagLocalization.count({
    where: { tagId },
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
  upsertTagLocale,
  getTagLocale,
  getTagLocales,
  deleteTagLocale,
  getTagLocaleStat,
}
