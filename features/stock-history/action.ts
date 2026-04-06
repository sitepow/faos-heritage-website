'use server'

import { Role } from '@prisma/client'
import { unstable_noStore as noStore } from 'next/cache'

import { ERROR_CODES, fail, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { decimalToNumber } from '@/utils'

const getStockHistoryByProductId = async (
  productId: string,
  page = 1,
  limit = 20,
) => {
  return await withRole(
    [Role.ADMIN, Role.STOCK_EDITOR, Role.STOCK_VIEWER],
    async () => {
      noStore()
      const skip = (page - 1) * limit

      try {
        const productVariants = await prisma.productVariant.findMany({
          where: {
            productId,
          },
          select: {
            id: true,
          },
        })

        const variantIds = productVariants.map((v) => {
          return v.id
        })

        const whereCondition = {
          OR: [
            {
              productId,
            },
            {
              variantId: {
                in: variantIds,
              },
            },
          ],
        }

        const [items, total] = await prisma.$transaction([
          prisma.stockHistory.findMany({
            where: whereCondition,
            skip,
            take: limit,
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              product: {
                select: {
                  name: true,
                  unit: true,
                },
              },
              variant: {
                select: {
                  name: true,
                  product: {
                    select: {
                      unit: true,
                    },
                  },
                },
              },
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          }),
          prisma.stockHistory.count({
            where: whereCondition,
          }),
        ])

        return ok({
          items: decimalToNumber(items),
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        })
      } catch {
        return fail(ERROR_CODES.SYSTEM_ERROR)
      }
    },
  )
}

type GetStockHistoryResult = Awaited<
  ReturnType<typeof getStockHistoryByProductId>
>

export type StockHistoryListItem = Extract<
  GetStockHistoryResult,
  {
    success: true
  }
>['data']['items'][number]

export { getStockHistoryByProductId }
