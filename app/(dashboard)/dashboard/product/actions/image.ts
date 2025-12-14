'use server'

import type { Prisma } from '@prisma/client'

import { deleteFile } from './file'
import { imageSchema, type ImageInput } from '../schema/image'

import { removeEmptyField } from '@/utils/helper'
import { getPrismaError, prisma } from '@/utils/prisma'

const EXECUTE_FIELD = {
  id: true,
  url: true,
  alt: true,
  isPrimary: true,
}

const createImage = async (data: ImageInput) => {
  try {
    const validatedData = imageSchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    await prisma.productImage.create({
      data: removeEmptyField(
        validatedData.data,
      ) as Prisma.ProductImageCreateInput,
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getImages = async (productId: string) => {
  try {
    return prisma.productImage.findMany({
      where: { productId },
      select: EXECUTE_FIELD,
      orderBy: { url: 'desc' },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getImage = async (variantId: string) => {
  try {
    if (!variantId) {
      throw new Error('Please specify the product image code you want.')
    }

    const variant = await prisma.productImage.findUnique({
      where: { id: variantId },
      select: EXECUTE_FIELD,
    })

    if (!variant) {
      throw new Error('No product images found.')
    }

    return variant
  } catch (error) {
    getPrismaError(error)
  }
}

const updateImage = async (data: ImageInput) => {
  try {
    const validatedData = imageSchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    const { id, ...payload } = validatedData.data

    if (!id) throw new Error('No product images found.')

    await prisma.productImage.update({
      data: payload as Prisma.ProductImageCreateInput,
      where: { id },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const deleteImage = async (imageIds: string | string[]) => {
  try {
    const ids = Array.isArray(imageIds) ? imageIds : [imageIds]

    if (!ids.length) {
      throw new Error('Please specify the image code of the product you want.')
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

    await prisma.$transaction([
      prisma.productImage.deleteMany({
        where: {
          id: { in: ids },
        },
      }),
    ])
  } catch (error) {
    getPrismaError(error)
  }
}

export { createImage, deleteImage, getImage, getImages, updateImage }
