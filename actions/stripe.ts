'use server'

import { OrderStatus } from '@prisma/client'
import Stripe from 'stripe'

import type { ActionResult } from '@/lib/errors/types'

import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'
import { decimalToNumber } from '@/utils/number'
import { toStripeAmount } from '@/utils/stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

interface CreateStripeCheckoutParams {
  orderId: string
}

export const createStripeCheckout = async ({
  orderId,
}: CreateStripeCheckoutParams): Promise<
  ActionResult<{ checkoutUrl: string }>
> => {
  if (!orderId) {
    return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
  }

  const order = decimalToNumber(
    await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        currency: true,
        shippingCost: true,
        items: {
          select: {
            price: true,
            quantity: true,
            productName: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    }),
  )

  if (!order) {
    return fail(ERROR_CODES.DATA_NOT_FOUND)
  }

  if (order.status !== OrderStatus.PENDING) {
    return fail(ERROR_CODES.DATA_CANNOT_PROCEED)
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'promptpay'],
    customer_email: order.user?.email ?? undefined,

    shipping_options:
      order.shippingCost > 0
        ? [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: toStripeAmount(order.shippingCost, order.currency),
                  currency: order.currency,
                },
                display_name: 'Shipping fee',
              },
            },
          ]
        : undefined,

    line_items: order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: order.currency,
        unit_amount: toStripeAmount(item?.price ?? 0, order.currency),
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

  if (!session.url) {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done({ checkoutUrl: session.url })
}
