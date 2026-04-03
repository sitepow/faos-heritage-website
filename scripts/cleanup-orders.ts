/* eslint-disable no-console */
import 'dotenv/config'
import {
  PrismaClient,
  OrderStatus,
  PaymentStatus,
  StockMovementType,
} from '@prisma/client'

import { MINUTE } from '../constants'
import { sendOrderEmail } from '../features/order/action'

const prisma = new PrismaClient()
const ORDER_EXPIRY_MS = 20 * MINUTE

const main = async () => {
  const now = new Date()
  const expiryTime = new Date(now.getTime() - ORDER_EXPIRY_MS)

  const expiredOrders = await prisma.order.findMany({
    where: {
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: { lt: expiryTime },
    },
    include: {
      items: true,
      storefront: true,
    },
  })

  if (expiredOrders.length === 0) {
    return
  }

  for (const order of expiredOrders) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.CANCELLED,
            cancelledAt: new Date(),
            cancelReason: `ยกเลิกอัตโนมัติ: ไม่มีการชำระเงินภายใน 20 นาที`,
          },
        })

        for (const item of order.items) {
          if (order.isPos && order.storefrontId) {
            await tx.storefrontInventory.update({
              where: {
                storefrontId_productId_variantId: {
                  storefrontId: order.storefrontId,
                  productId: item?.productId!,
                  variantId: item?.variantId!,
                },
              },
              data: { stockQuantity: { increment: item.quantity } },
            })
          } else {
            if (item.variantId) {
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stockQuantity: { increment: item.quantity } },
              })
            } else if (item.productId) {
              await tx.product.update({
                where: { id: item.productId },
                data: { stockQuantity: { increment: item.quantity } },
              })
            }
          }

          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              type: StockMovementType.RETURN,
              toStorefrontId: order.storefrontId || null,
              reference: order.id,
              note:
                order.isPos && order.storefrontId
                  ? `คืนสต็อกอัตโนมัติเข้าสาขา [${order.storefront?.name}] จากออเดอร์ POS #${order.id.slice(-8).toUpperCase()}`
                  : `คืนสต็อกอัตโนมัติเข้าคลังหลัก จากออเดอร์ออนไลน์ #${order.id.slice(-8).toUpperCase()}`,
            },
          })
        }
      })

      const emailResult = await sendOrderEmail(order.id)
      if (!emailResult.success) {
        console.warn(`ออเดอร์ ${order.id}: ส่งอีเมลแจ้งเตือนไม่สำเร็จ`)
      }
    } catch (err) {
      console.error(`ออเดอร์ ${order.id}: เกิดข้อผิดพลาดในการประมวลผล`, err)
    }
  }
}

main()
  .catch((e) => {
    console.error('Critical Error in main():', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
