'use server'

import { Role } from '@prisma/client'

import { STOCK_MOVEMENT_LABELS } from './stock-history.constant'

import { PRODUCT_UNIT_TH_LABELS } from '@/features/product/product.constant'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { formatDate } from '@/utils'

const exportStockHistoryAction = async (productIds?: string[]) => {
  return await withRole([Role.ADMIN, Role.STOCK_MANAGER], async () => {
    try {
      const history = await prisma.stockHistory.findMany({
        where:
          productIds && productIds.length > 0
            ? { productId: { in: productIds } }
            : {},
        include: {
          product: { select: { name: true, unit: true } },
          variant: { select: { name: true } },
          user: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      })

      if (history.length === 0) {
        return {
          success: true,
          data: [],
          meta: {
            dateRange: 'ไม่พบข้อมูล',
            summary: { totalIn: 0, totalOut: 0, netChange: 0 },
          },
        }
      }

      const latestDate = history[0].createdAt
      const oldestDate = history[history.length - 1].createdAt
      const dateRangeHeader = `${formatDate(oldestDate, 'th', 'date')} ถึง ${formatDate(latestDate, 'th', 'date')}`

      const totalIn = history
        .filter((item) => {
          return item.quantity > 0
        })
        .reduce((acc, item) => {
          return acc + item.quantity
        }, 0)

      const totalOut = history
        .filter((item) => {
          return item.quantity < 0
        })
        .reduce((acc, item) => {
          return acc + Math.abs(item.quantity)
        }, 0)

      const reportData = history.map((item) => {
        const unitLabel = item.product?.unit
          ? PRODUCT_UNIT_TH_LABELS[item.product.unit]
          : '-'

        return {
          'วันที่-เวลา': formatDate(item.createdAt),
          ชื่อสินค้า: item.product?.name || '-',
          ตัวเลือกสินค้า: item.variant?.name || '-',
          ประเภท: STOCK_MOVEMENT_LABELS[item.type],
          จำนวน: item.quantity,
          หน่วย: unitLabel,
          'สถานที่/แผนก': item.location || '-',
          หมายเหตุ: item.note || '-',
          อ้างอิง: item.reference || '-',
          ผู้ดำเนินการ: item.user?.name || 'ระบบ',
        }
      })

      return {
        success: true,
        data: reportData,
        meta: {
          dateRange: dateRangeHeader,
          summary: {
            totalIn,
            totalOut,
            netChange: totalIn - totalOut,
          },
        },
      }
    } catch {
      return {
        success: false,
        error: 'ไม่สามารถดึงข้อมูลรายงานได้',
      }
    }
  })
}

export { exportStockHistoryAction }
