'use server'

import { OrderStatus } from '@prisma/client'

import { getOrderStatus } from '@/utils/helper'
import { prisma, getPrismaError } from '@/utils/prisma'

export type GetOrdersResult = Awaited<ReturnType<typeof getOrders>>
export type GetOrderResult = GetOrdersResult['items'][number]

const getOrders = async (
  page: number = 1,
  limit: number = 10,
  userId?: string,
) => {
  try {
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
          total: true,
          user: {
            select: {
              name: true,
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
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    getPrismaError(error)

    return { items: [], total: 0, page, limit, totalPages: 0 }
  }
}

const getOrderDashboard = async () => {
  try {
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
      { name: 'คำสั่งซื้อทั้งหมด', value: totalOrders },
      { name: `คำสั่งซื้อ (${getOrderStatus('PENDING')})`, value: pending },
      { name: `คำสั่งซื้อ (${getOrderStatus('DELIVERED')})`, value: success },
    ]
  } catch (error) {
    getPrismaError(error)
  }
}

const getOrderSum = async () => {
  try {
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
        name: `ยอดชำระทั้งหมด (${getOrderStatus('DELIVERED')})`,
        value: orderDelivered._sum.total ?? 0,
        isCurrency: true,
      },
      {
        name: `ยอดชำระทั้งหมด (${getOrderStatus('CANCELLED')})`,
        value: orderCancelled._sum.total ?? 0,
        isCurrency: true,
      },
      {
        name: `ยอดชำระทั้งหมด (${getOrderStatus('PENDING')})`,
        value: orderPending._sum.total ?? 0,
        isCurrency: true,
      },
    ]
  } catch (error) {
    getPrismaError(error)
  }
}

export { getOrders, getOrderDashboard, getOrderSum }
