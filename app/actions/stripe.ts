/* eslint-disable no-console */
'use server'

import { OrderStatus } from '@prisma/client'
import Stripe from 'stripe'

import type { ActionResult } from '@/lib/errors'

import { DEFALUT_APP_PATH, PROFILE_TABS } from '@/constants'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { toStripeMinorUnit } from '@/utils'
import { decimalToNumber } from '@/utils/number'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

interface CreateStripeCheckoutParams {
  orderId: string
}

const PROFILE_ORDER_PATH = `${DEFALUT_APP_PATH}/profile?tab=${PROFILE_TABS.ORDER}`

const buildShippingOptions = (
  shippingCost: number,
  currency: string,
): Stripe.Checkout.SessionCreateParams['shipping_options'] => {
  if (shippingCost <= 0) return undefined

  return [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: toStripeMinorUnit(shippingCost, currency),
          currency,
        },
        display_name: 'Shipping fee',
      },
    },
  ]
}

const buildLineItems = (
  items: {
    price: number
    quantity: number
    productName: string
  }[],
  currency: string,
): Stripe.Checkout.SessionCreateParams.LineItem[] =>
  items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency,
      unit_amount: toStripeMinorUnit(item.price ?? 0, currency),
      product_data: {
        name: item.productName,
      },
    },
  }))

const createStripeCheckout = async ({
  orderId,
}: CreateStripeCheckoutParams): Promise<
  ActionResult<{ checkoutUrl: string }>
> => {
  if (!orderId) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
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
    return fail(ERROR_CODES.ORDER_STATUS_INVALID)
  }

  let session: Stripe.Checkout.Session

  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'promptpay'],
      customer_email: order.user?.email ?? undefined,

      shipping_options: buildShippingOptions(
        order.shippingCost,
        order.currency,
      ),

      line_items: buildLineItems(order.items, order.currency),

      metadata: {
        orderId: order.id,
      },

      success_url: PROFILE_ORDER_PATH,
      cancel_url: PROFILE_ORDER_PATH,
    })
  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error)
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  if (!session.url) {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentMethod: 'STRIPE',
    },
  })

  return ok({ checkoutUrl: session.url })
}

export { createStripeCheckout }
