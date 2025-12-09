'use server'

import { OrderStatus } from '@prisma/client'

import { getOrderStatus } from '@/utils/helper'
import { prisma, getPrismaError } from '@/utils/prisma'

export type GetOrdersResult = Awaited<ReturnType<typeof getOrders>>
export type getOrdersWithoutPaginationResult = Awaited<
  ReturnType<typeof getOrdersWithoutPagination>
>

const getOrdersWithoutPagination = async (limit: number) => {
  try {
    return await prisma.order.findMany({
      take: limit,
      select: {
        id: true,
        status: true,
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
    })
  } catch (error) {
    getPrismaError(error)

    return []
  }
}

const getOrders = async (page: number = 1, limit: number = 10) => {
  try {
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
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
      prisma.product.count(),
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
  }
}

const getDashboard = async () => {
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
    const [orderDelivered, orderPending, orderCancelled, totalOrders] =
      await Promise.all([
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
        prisma.order.count(),
      ])

    return [
      { name: 'คำสั่งซื้อทั้งหมด', value: totalOrders },
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

export { getOrders, getDashboard, getOrderSum, getOrdersWithoutPagination }
