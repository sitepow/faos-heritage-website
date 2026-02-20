/* eslint-disable no-console */
import 'dotenv/config'
import {
  PrismaClient,
  OrderStatus,
  PaymentStatus,
  StockMovementType,
} from '@prisma/client'

import { MINUTE } from '../constants'
import { sendOrderEmail } from '../features/order/order.action'

const prisma = new PrismaClient()
const ORDER_EXPIRY_MS = 20 * MINUTE

const main = async () => {
  const now = new Date()
  const expiryTime = new Date(now.getTime() - ORDER_EXPIRY_MS)

  console.log(
    `[${now.toLocaleString()}] Checking orders created before ${expiryTime.toLocaleString()}...`,
  )

  const expiredOrders = await prisma.order.findMany({
    where: {
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: { lt: expiryTime },
    },
    include: {
      items: true,
    },
  })

  if (expiredOrders.length === 0) {
    console.log('No expired orders found.')
    return
  }

  console.log(`Found ${expiredOrders.length} expired orders. Processing...`)

  for (const order of expiredOrders) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.CANCELLED,
            cancelledAt: new Date(),
            cancelReason: `Auto-cancelled: Unpaid for more than 20 minutes`,
          },
        })

        for (const item of order.items) {
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

          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              type: StockMovementType.RETURN,
              reference: `Auto-refund stock from cancelled order: ${order.id}`,
            },
          })
        }
      })

      console.log(`Order ${order.id}: Cancelled and stock restored.`)

      const emailResult = await sendOrderEmail(order.id)

      if (emailResult.success) {
        console.log(`Order ${order.id}: Cancellation email sent.`)
      } else {
        console.warn(`Order ${order.id}: Failed to send email.`)
      }
    } catch (err) {
      console.error(`Order ${order.id}: Failed to process.`, err)
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
