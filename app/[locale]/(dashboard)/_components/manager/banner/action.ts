'use server'

import type { Prisma } from '@prisma/client'

import { imageBannerSchema, type ImageBannerInput } from './schema'

import { deleteFile } from '@/actions/file'
import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'
import { removeEmptyField } from '@/utils/helpers/object'

export const createImageBanner = async (data: ImageBannerInput) => {
  const validated = imageBannerSchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const payload = removeEmptyField(validated.data) as Prisma.BannerCreateInput

  try {
    await prisma.banner.create({
      data: payload,
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}

export const getImageBanners = async () => {
  return prisma.banner.findMany({
    select: {
      id: true,
      url: true,
      alt: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const getImageBanner = async (id: string) => {
  return prisma.banner.findUnique({
    where: { id },
    select: {
      id: true,
      url: true,
      alt: true,
      isActive: true,
    },
  })
}

export const updateImageBanner = async (data: ImageBannerInput) => {
  const validated = imageBannerSchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const { id, ...payload } = validated.data

  if (!id) {
    return fail(ERROR_CODES.DATA_NOT_FOUND)
  }

  try {
    await prisma.$transaction(async (tx) => {
      const banner = await tx.banner.findUnique({
        where: { id },
        select: { url: true },
      })

      if (!banner) {
        throw new Error(ERROR_CODES.DATA_NOT_FOUND)
      }

      if (payload.url && banner.url && payload.url !== banner.url) {
        await deleteFile(banner.url)
      }

      await tx.banner.update({
        where: { id },
        data: payload as Prisma.BannerUpdateInput,
      })
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}

export const deleteImageBanner = async (bannerIds: string | string[]) => {
  const ids = Array.isArray(bannerIds) ? bannerIds : [bannerIds]

  if (!ids.length) {
    return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
  }

  const banners = await prisma.banner.findMany({
    where: {
      id: { in: ids },
    },
    select: {
      url: true,
    },
  })

  await Promise.all(
    banners
      .map((banner) => banner.url)
      .filter(Boolean)
      .map((path) => deleteFile(path)),
  )

  try {
    await prisma.banner.deleteMany({
      where: {
        id: { in: ids },
      },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}
