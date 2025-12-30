'use server'

import { OrderStatus } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { getOrderStatus } from '@/utils/features/order/helpers'
import { decimalToNumber } from '@/utils/number'

export type GetOrdersResult = Awaited<ReturnType<typeof getOrders>>
export type GetOrderResult = GetOrdersResult['items'][number]

export const getOrders = async (
  page: number = 1,
  limit: number = 10,
  userId?: string,
) => {
  const skip = (page - 1) * limit

  const where = {
    ...(userId && { userId }),
  }

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      where,
      select: {
        id: true,
        status: true,
        trackingWebsite: true,
        trackingNumber: true,
        createdAt: true,
        deliveredAt: true,
        shippedAt: true,
        paidAt: true,
        total: true,
        currency: true,
        exchangeLocale: true,
        exchangeRateSource: true,
        user: {
          select: {
            name: true,
          },
        },
        address: {
          select: {
            countryCode: true,
          },
        },
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
                images: {
                  select: { url: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count(),
  ])

  return {
    items: decimalToNumber(items),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export const getOrderStat = async () => {
  const [totalOrders, pending, success] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: { status: OrderStatus.PENDING },
    }),
    prisma.order.count({
      where: { status: OrderStatus.DELIVERED },
    }),
  ])

  return [
    { name: 'All orders', value: totalOrders },
    { name: `Order (${getOrderStatus('PENDING')})`, value: pending },
    { name: `Order (${getOrderStatus('DELIVERED')})`, value: success },
  ]
}

export const getOrderStatCash = async () => {
  const [orderDelivered, orderPending, orderCancelled] = await Promise.all([
    prisma.order.aggregate({
      where: { status: OrderStatus.DELIVERED },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { status: OrderStatus.PENDING },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { status: OrderStatus.CANCELLED },
      _sum: { total: true },
    }),
  ])

  return [
    {
      name: `Total payment (${getOrderStatus('DELIVERED')})`,
      value: orderDelivered._sum.total ?? 0,
      isCurrency: true,
    },
    {
      name: `Total payment (${getOrderStatus('CANCELLED')})`,
      value: orderCancelled._sum.total ?? 0,
      isCurrency: true,
    },
    {
      name: `Total payment (${getOrderStatus('PENDING')})`,
      value: orderPending._sum.total ?? 0,
      isCurrency: true,
    },
  ]
}
