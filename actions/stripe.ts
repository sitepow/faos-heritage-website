'use server'

import { OrderStatus } from '@prisma/client'
import Stripe from 'stripe'

import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

interface createStripeCheckoutParams {
  orderId: string
}

export const createStripeCheckout = async ({
  orderId,
}: createStripeCheckoutParams) => {
  if (!orderId) throw new Error('ไม่พบ orderId')

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: true,
    },
  })

  if (!order) throw new Error('No order found.')

  if (order.status !== OrderStatus.PENDING)
    throw new Error('This order could not be paid for.')

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
