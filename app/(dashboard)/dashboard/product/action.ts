'use server'

import { PrismaClient } from '@prisma/client'

import type { ProductInput } from './schema/product'
import type { Prisma } from '@prisma/client'

import { productSchema } from './schema/product'

import { removeEmptyField } from '@/utils/helper'

const prisma = new PrismaClient()

const createProduct = async (data: ProductInput) => {
  const validatedData = productSchema.safeParse(data)

  if (!validatedData?.success) {
    throw new Error(
      validatedData?.error?.issues[0]?.message ??
        'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง',
    )
  }

  await prisma.product.create({
    data: removeEmptyField(
      validatedData.data,
    ) as Prisma.ProductUncheckedCreateInput,
  })
}

export { createProduct }
