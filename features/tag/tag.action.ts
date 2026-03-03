'use server'

import { Role, type Prisma } from '@prisma/client'
import { unstable_noStore as noStore } from 'next/cache'

import { tagSchema, type TagInput } from './tag.schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { omitEmptyFields } from '@/utils'
import { applyLocalization } from '@/utils/localization'

const createTag = async (data: TagInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = tagSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    try {
      const exists = await prisma.tag.findFirst({
        where: {
          OR: [
            { name: { equals: validated.data.name, mode: 'insensitive' } },
            { slug: { equals: validated.data.slug, mode: 'insensitive' } },
          ],
        },
      })

      if (exists) {
        return fail(ERROR_CODES.BAD_REQUEST)
      }

      await prisma.tag.create({
        data: omitEmptyFields(validated.data) as Prisma.TagUncheckedCreateInput,
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updateTag = async (data: TagInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = tagSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, ...payload } = validated.data
    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    try {
      await prisma.tag.update({
        where: { id },
        data: omitEmptyFields(payload) as Prisma.TagUncheckedUpdateInput,
      })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteTags = async (tagIds: string | string[]) =>
  withRole([Role.ADMIN], async () => {
    const ids = Array.isArray(tagIds) ? tagIds : [tagIds]
    if (!ids.length) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      await prisma.tag.deleteMany({ where: { id: { in: ids } } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getTags = async (locale?: string) => {
  noStore()
  const languageCode = locale?.toUpperCase()

  const tags = await prisma.tag.findMany({
    include: {
      localizations: { where: { languageCode }, take: 1 },
      _count: { select: { posts: true } },
    },
    orderBy: { name: 'asc' },
  })

  return tags.map((tag) => applyLocalization(tag))
}

const getTag = async (tagId: string, locale?: string) => {
  const languageCode = locale?.toUpperCase()

  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
    include: {
      localizations: { where: { languageCode }, take: 1 },
    },
  })

  return applyLocalization(tag)
}

const getTagStat = async () => {
  const [total, used, unused] = await prisma.$transaction([
    prisma.tag.count(),
    prisma.tag.count({ where: { posts: { some: {} } } }),
    prisma.tag.count({ where: { posts: { none: {} } } }),
  ])

  const labels = ['แท็กทั้งหมด', 'แท็กที่ถูกใช้งาน', 'แท็กที่ยังไม่ถูกใช้']
  const stats = [total, used, unused]

  return stats.map((value, idx) => ({ name: labels[idx], value }))
}

export { createTag, updateTag, deleteTags, getTags, getTag, getTagStat }
