'use server'

import { Role, type Prisma } from '@prisma/client'

import { imageSchema, type ImageInput } from './product-image.schema'

import { deleteFile } from '@/app/actions/file'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { omitEmptyFields } from '@/utils'

const createProductImage = async (data: ImageInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = imageSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const payload = omitEmptyFields(
      validated.data,
    ) as Prisma.ProductImageUncheckedCreateInput

    try {
      await prisma.$transaction(async (tx) => {
        if (payload.isPrimary && payload.productId) {
          await tx.productImage.updateMany({
            where: { productId: payload.productId },
            data: { isPrimary: false },
          })
        }

        await tx.productImage.create({ data: payload })
      })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updateProductImage = async (data: ImageInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = imageSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, ...payload } = validated.data
    if (!id) return fail(ERROR_CODES.DATA_NOT_FOUND)

    try {
      await prisma.$transaction(async (tx) => {
        const currentImage = await tx.productImage.findUnique({
          where: { id },
          select: { productId: true, url: true },
        })

        if (!currentImage) {
          throw new Error('NOT_FOUND')
        }

        if (
          payload.url &&
          currentImage.url &&
          payload.url !== currentImage.url
        ) {
          await deleteFile(currentImage.url)
        }

        if (payload.isPrimary) {
          await tx.productImage.updateMany({
            where: {
              productId: currentImage.productId,
              NOT: { id },
            },
            data: { isPrimary: false },
          })
        }

        await tx.productImage.update({
          where: { id },
          data: payload as Prisma.ProductImageUpdateInput,
        })
      })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteProductImage = async (imageIds: string | string[]) =>
  withRole([Role.ADMIN], async () => {
    const ids = Array.isArray(imageIds) ? imageIds : [imageIds]
    if (!ids.length) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      const images = await prisma.productImage.findMany({
        where: { id: { in: ids } },
        select: { url: true },
      })

      const fileUrls = images.map((img) => img.url).filter(Boolean)
      await Promise.all(fileUrls.map((url) => deleteFile(url!)))

      await prisma.productImage.deleteMany({
        where: { id: { in: ids } },
      })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getProductImages = async (productId: string) => {
  const images = await prisma.productImage.findMany({
    where: { productId },
    select: {
      id: true,
      url: true,
      alt: true,
      isPrimary: true,
    },
    orderBy: { isPrimary: 'desc' },
  })
  return images || []
}

const getProductImage = async (imageId: string) => {
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
    select: {
      id: true,
      url: true,
      alt: true,
      isPrimary: true,
    },
  })
  return image || null
}

export {
  createProductImage,
  getProductImages,
  getProductImage,
  updateProductImage,
  deleteProductImage,
}
