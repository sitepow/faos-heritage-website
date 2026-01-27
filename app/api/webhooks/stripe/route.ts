/* eslint-disable no-console */
import { OrderStatus, PaymentStatus } from '@prisma/client'
import Stripe from 'stripe'

import type { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing Stripe signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    const body = await req.text()

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Stripe webhook signature verification failed', err)
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode !== 'payment' || session.payment_status !== 'paid')
          break

        const orderId = session.metadata?.orderId
        if (!orderId) {
          console.error('Missing orderId in Stripe metadata')
          break
        }

        await prisma.$transaction(async (tx) => {
          const order = await tx.order.findUnique({
            where: { id: orderId },
            select: {
              id: true,
              status: true,
              paymentStatus: true,
            },
          })

          if (!order) {
            console.error('Order not found', orderId)
            return
          }

          if (order.paymentStatus === PaymentStatus.PAID) {
            return
          }

          await tx.order.update({
            where: { id: orderId },
            data: {
              status: OrderStatus.PAID,
              paymentStatus: PaymentStatus.PAID,
              paidAt: new Date(),
            },
          })
        })

        break
      }

      default:
        break
    }
  } catch (err) {
    console.error('Stripe webhook handler error', err)
    return new Response('Webhook handler failed', { status: 500 })
  }

  return Response.json({ received: true })
}
