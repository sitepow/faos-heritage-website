'use server'

import { Role } from '@prisma/client'

import type { PostLocalizationInput } from './post-localization.schema'
import type { Prisma } from '@prisma/client'

import { postLocalizationSchema } from './post-localization.schema'

import { SUPPORTED_APP_LOCALES } from '@/constants'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { omitEmptyFields } from '@/utils'

const upsertPostLocale = async (data: PostLocalizationInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = postLocalizationSchema.safeParse(data)

    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, postId, languageCode, ...rest } = validated.data

    try {
      const payload = omitEmptyFields({
        ...rest,
        keywords: rest.keywords || [],
      })

      if (id) {
        await prisma.postLocalization.update({
          where: { id },
          data: payload,
        })
      } else {
        await prisma.postLocalization.create({
          data: {
            ...payload,
            postId,
            languageCode,
          } as Prisma.PostLocalizationUncheckedCreateInput,
        })
      }
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getPostLocale = async (id: string) => {
  if (!id) {
    return null
  }

  return await prisma.postLocalization.findUnique({ where: { id } })
}

const getPostLocales = async (postId: string) => {
  return await prisma.postLocalization.findMany({
    where: { postId },
    orderBy: { languageCode: 'asc' },
  })
}

const deletePostLocale = async (id: string) =>
  withRole([Role.ADMIN], async () => {
    try {
      await prisma.postLocalization.delete({ where: { id } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getPostLocaleStat = async (postId: string) => {
  const translatedCount = await prisma.postLocalization.count({
    where: { postId },
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
  upsertPostLocale,
  getPostLocale,
  getPostLocales,
  deletePostLocale,
  getPostLocaleStat,
}
