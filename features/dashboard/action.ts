'use server'

import { OrderStatus } from '@prisma/client'

import { prisma } from '@/lib/prisma'

const getLast7Days = () => {
  return new Array(7)
    .fill(0)
    .map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    })
    .reverse()
}

const getAffiliatePerformanceData = async () => {
  const last7Days = getLast7Days()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: {
      status: OrderStatus.DELIVERED,
      createdAt: { gte: sevenDaysAgo },
    },
    select: {
      baseTotal: true,
      createdAt: true,
      referrerCode: true,
    },
  })

  return last7Days.map((date) => {
    const dayOrders = orders.filter(
      (o) => o.createdAt.toISOString().split('T')[0] === date,
    )

    const affiliateSales = dayOrders
      .filter((o) => !!o.referrerCode)
      .reduce((sum, o) => sum + Number(o.baseTotal), 0)

    const directSales = dayOrders
      .filter((o) => !o.referrerCode)
      .reduce((sum, o) => sum + Number(o.baseTotal), 0)

    return {
      date,
      ยอดขายทั่วไป: directSales,
      'ยอดขาย Aff': affiliateSales,
    }
  })
}

const getRevenueChartData = async () => {
  const last7Days = getLast7Days()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: {
      status: OrderStatus.DELIVERED,
      createdAt: { gte: sevenDaysAgo },
    },
    select: {
      baseTotal: true,
      createdAt: true,
    },
  })

  return last7Days.map((date) => {
    const dailyTotal = orders
      .filter((o) => o.createdAt.toISOString().split('T')[0] === date)
      .reduce((sum, o) => sum + Number(o.baseTotal), 0)

    return {
      date,
      ยอดเงิน: dailyTotal,
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

const getAffiliateStats = async () => {
  const [affiliateCount, commissionStats] = await Promise.all([
    prisma.affiliateProfile.count(),
    prisma.affiliateCommission.groupBy({
      by: ['status'],
      _sum: {
        commissionAmount: true,
      },
    }),
  ])

  const pending =
    commissionStats.find((s) => s.status === 'PENDING')?._sum
      .commissionAmount || 0
  const completed =
    commissionStats.find((s) => s.status === 'COMPLETED')?._sum
      .commissionAmount || 0
  const paid =
    commissionStats.find((s) => s.status === 'PAID')?._sum.commissionAmount || 0

  return [
    { name: 'พาร์ทเนอร์ทั้งหมด', value: affiliateCount },
    { name: 'ยอดรอคอนเฟิร์ม (Aff)', value: Number(pending), isCurrency: true },
    { name: 'ยอดรอถอน (Aff)', value: Number(completed), isCurrency: true },
    { name: 'จ่ายแล้ว (Aff)', value: Number(paid), isCurrency: true },
  ]
}

const getInventoryValueData = async () => {
  const [products, storefrontInventories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: {
        price: true,
        stockQuantity: true,
        variants: {
          where: { isActive: true },
          select: {
            price: true,
            stockQuantity: true,
          },
        },
      },
    }),
    prisma.storefrontInventory.findMany({
      select: {
        stockQuantity: true,
        netPrice: true,
      },
    }),
  ])

  const mainStockValue = products.reduce((acc, product) => {
    if (product.variants.length > 0) {
      const variantValue = product.variants.reduce((vAcc, variant) => {
        return vAcc + Number(variant.price) * variant.stockQuantity
      }, 0)
      return acc + variantValue
    }
    return acc + Number(product.price) * product.stockQuantity
  }, 0)

  const storefrontStockValue = storefrontInventories.reduce((acc, item) => {
    return acc + Number(item.netPrice) * item.stockQuantity
  }, 0)

  return [
    {
      name: 'มูลค่าสต็อกหลัก (Global)',
      value: mainStockValue,
      isCurrency: true,
    },
    {
      name: 'มูลค่าสต็อกสาขา (Storefront)',
      value: storefrontStockValue,
      isCurrency: true,
    },
  ]
}

export {
  getAffiliatePerformanceData,
  getRevenueChartData,
  getOrderStatusData,
  getSalesByCategoryData,
  getTopProductsData,
  getAffiliateStats,
  getInventoryValueData,
}
