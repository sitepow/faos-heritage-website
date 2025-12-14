'use server'

import { OrderStatus } from '@prisma/client'
import Stripe from 'stripe'

import { prisma } from '@/utils/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

interface Params {
  orderId: string
}

const createStripeCheckout = async ({ orderId }: Params) => {
  if (!orderId) throw new Error('ไม่พบ orderId')

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: true,
    },
  })

  if (!order) throw new Error('ไม่พบคำสั่งซื้อ')

  if (order.status !== OrderStatus.PENDING)
    throw new Error('คำสั่งซื้อนี้ไม่สามารถชำระเงินได้')

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'promptpay'],
    customer_email: order.user?.email ?? undefined,

    line_items: order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'thb',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.productName,
        },
      },
    })),

    metadata: {
      orderId: order.id,
    },

    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?orderId=${order.id}`,
  })

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentMethod: 'STRIPE',
    },
  })

  return {
    checkoutUrl: session.url,
  }
}

export { createStripeCheckout }
