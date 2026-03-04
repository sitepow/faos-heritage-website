'use server'

import { OrderStatus } from '@prisma/client'

import { prisma } from '@/lib/prisma'

const getRevenueChartData = async () => {
  const last7Days = new Array(7)
    .fill(0)
    .map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    })
    .reverse()

  const revenue = await prisma.order.groupBy({
    by: ['createdAt'],
    where: {
      status: OrderStatus.DELIVERED,
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    _sum: { baseTotal: true },
  })

  return last7Days.map((date) => {
    const found = revenue.find(
      (r) => r.createdAt.toISOString().split('T')[0] === date,
    )
    return {
      date,
      ยอดเงิน: Number(found?._sum.baseTotal || 0),
    }
  })
}

const getOrderStatusData = async () => {
  const stats = await prisma.order.groupBy({
    by: ['status'],
    _count: { id: true },
  })

  return stats.map((s) => {
    return {
      name: s.status,
      value: s._count.id,
    }
  })
}

const getSalesByCategoryData = async () => {
  const orders = await prisma.order.findMany({
    where: {
      status: OrderStatus.DELIVERED,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  })

  const categoryTotals: Record<string, number> = {}

  orders.forEach((order) => {
    const itemCount = order.items.length
    const shippingPerItem = Number(order.baseShipping) / itemCount

    order.items.forEach((item) => {
      const categoryName = item.product?.category?.name || 'ทั่วไป'
      const itemTotalWithShipping = Number(item.baseSubtotal) + shippingPerItem

      categoryTotals[categoryName] =
        (categoryTotals[categoryName] || 0) + itemTotalWithShipping
    })
  })

  return Object.entries(categoryTotals)
    .map(([name, total]) => {
      return {
        name,
        ยอดขาย: total,
      }
    })
    .sort((a, b) => {
      return b.ยอดขาย - a.ยอดขาย
    })
}

const getTopProductsData = async () => {
  const topProducts = await prisma.orderItem.groupBy({
    by: ['productName'],
    where: {
      order: {
        status: OrderStatus.DELIVERED,
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 5,
  })

  return topProducts.map((p) => {
    return {
      name: p.productName,
      จำนวน: p._sum.quantity || 0,
    }
  })
}

export {
  getRevenueChartData,
  getOrderStatusData,
  getSalesByCategoryData,
  getTopProductsData,
}
