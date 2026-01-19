'use server'

import type { Prisma } from '@prisma/client'

import { imageSchema, type ImageInput } from '../schema/image'

import { deleteFile } from '@/actions/file'
import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'
import { removeEmptyField } from '@/utils/helpers/object'

export const createImage = async (data: ImageInput) => {
  const validated = imageSchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const payload = removeEmptyField(
    validated.data,
  ) as Prisma.ProductImageCreateInput

  try {
    await prisma.$transaction(async (tx) => {
      if (payload.isPrimary && data.productId) {
        await tx.productImage.updateMany({
          where: {
            productId: data.productId,
          },
          data: {
            isPrimary: false,
          },
        })
      }

      await tx.productImage.create({
        data: payload,
      })
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}

export const getImages = async (productId: string) => {
  const images = await prisma.productImage.findMany({
    where: { productId },
    select: {
      id: true,
      url: true,
      alt: true,
      isPrimary: true,
    },
    orderBy: { url: 'desc' },
  })

  if (!images) {
    return
  }

  return images
}

export const getImage = async (imageId: string) => {
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
    select: {
      id: true,
      url: true,
      alt: true,
      isPrimary: true,
    },
  })

  if (!image) {
    return
  }

  return image
}

export const updateImage = async (data: ImageInput) => {
  const validated = imageSchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const { id, ...payload } = validated.data

  if (!id) {
    return fail(ERROR_CODES.DATA_NOT_FOUND)
  }

  try {
    await prisma.$transaction(async (tx) => {
      const image = await tx.productImage.findUnique({
        where: { id },
        select: {
          productId: true,
          url: true,
        },
      })

      if (!image) {
        throw new Error(ERROR_CODES.DATA_NOT_FOUND)
      }

      if (payload.url && image.url && payload.url !== image.url) {
        await deleteFile(image.url)
      }

      if (payload.isPrimary) {
        await tx.productImage.updateMany({
          where: {
            productId: image.productId,
            NOT: { id },
          },
          data: {
            isPrimary: false,
          },
        })
      }

      await tx.productImage.update({
        where: { id },
        data: payload as Prisma.ProductImageUpdateInput,
      })
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}

export const deleteImage = async (imageIds: string | string[]) => {
  const ids = Array.isArray(imageIds) ? imageIds : [imageIds]

  if (!ids.length) {
    return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
  }

  const images = await prisma.productImage.findMany({
    where: {
      id: { in: ids },
    },
    select: {
      url: true,
    },
  })

  await Promise.all(
    images
      .map((image) => image.url)
      .filter(Boolean)
      .map((imagePath) => deleteFile(imagePath!)),
  )

  try {
    await prisma.productImage.deleteMany({
      where: {
        id: { in: ids },
      },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}
