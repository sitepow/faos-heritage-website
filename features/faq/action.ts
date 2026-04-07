'use server'

import { Role } from '@prisma/client'
import { unstable_noStore as noStore } from 'next/cache'

import { faqSchema, type FaqInput } from './schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { applyLocalization } from '@/utils/localization'

const getFaqs = async (locale?: string) => {
  noStore()
  const languageCode = locale?.toUpperCase()

  const items = await prisma.faq.findMany({
    include: {
      localizations: {
        where: { languageCode },
        take: 1,
      },
    },
    orderBy: { slug: 'asc' },
  })

  return items.map((item) => applyLocalization(item))
}

const getFaqBySlug = async (slug: string, locale?: string) => {
  const languageCode = locale?.toUpperCase()

  const item = await prisma.faq.findUnique({
    where: { slug },
    include: {
      localizations: { where: { languageCode }, take: 1 },
    },
  })

  return applyLocalization(item)
}

const createFaq = async (data: FaqInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = faqSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    try {
      await prisma.faq.create({ data: validated.data })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updateFaq = async (data: FaqInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = faqSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, ...payload } = validated.data
    if (!id) return fail(ERROR_CODES.DATA_NOT_FOUND)

    try {
      await prisma.faq.update({
        where: { id },
        data: payload,
      })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteFaq = async (id: string) =>
  withRole([Role.ADMIN], async () => {
    try {
      await prisma.faq.delete({ where: { id } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

export type GetFaqsResult = Awaited<ReturnType<typeof getFaqs>>
export { getFaqs, getFaqBySlug, createFaq, updateFaq, deleteFaq }
