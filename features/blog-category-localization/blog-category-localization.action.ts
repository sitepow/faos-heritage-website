'use server'

import { Role } from '@prisma/client'

import {
  blogCategoryLocalizationSchema,
  type BlogCategoryLocalizationInput,
} from './blog-category-localization.schema'

import { SUPPORTED_APP_LOCALES } from '@/constants'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'

const upsertBlogCategoryLocale = async (data: BlogCategoryLocalizationInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = blogCategoryLocalizationSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, blogCategoryId, languageCode, name } = validated.data

    try {
      if (id) {
        await prisma.blogCategoryLocalization.update({
          where: { id },
          data: { name },
        })
      } else {
        await prisma.blogCategoryLocalization.create({
          data: { blogCategoryId, languageCode, name },
        })
      }
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getBlogCategoryLocale = async (id: string) => {
  if (!id) {
    return null
  }

  return await prisma.blogCategoryLocalization.findUnique({
    where: { id },
  })
}

const getBlogCategoryLocales = async (blogCategoryId: string) => {
  return await prisma.blogCategoryLocalization.findMany({
    where: { blogCategoryId },
    orderBy: { languageCode: 'asc' },
  })
}

const deleteBlogCategoryLocale = async (id: string) =>
  withRole([Role.ADMIN], async () => {
    try {
      await prisma.blogCategoryLocalization.delete({ where: { id } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getBlogCategoryLocaleStat = async (blogCategoryId: string) => {
  const translatedCount = await prisma.blogCategoryLocalization.count({
    where: { blogCategoryId },
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
  upsertBlogCategoryLocale,
  getBlogCategoryLocale,
  getBlogCategoryLocales,
  deleteBlogCategoryLocale,
  getBlogCategoryLocaleStat,
}
