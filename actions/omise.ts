'use server'

import { OrderStatus } from '@prisma/client'
import Omise from 'omise'

import type { ActionResult } from '@/lib/errors/types'

import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY!,
  publicKey: process.env.OMISE_PUBLIC_KEY!,
})

interface CreateOmiseCheckoutParams {
  orderId: string
}

export const createOmiseCheckout = async ({
  orderId,
}: CreateOmiseCheckoutParams): Promise<
  ActionResult<{ checkoutUrl: string }>
> => {
  if (!orderId) {
    return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: true,
    },
  })

  if (!order) {
    return fail(ERROR_CODES.DATA_NOT_FOUND)
  }

  if (order.status !== OrderStatus.PENDING) {
    return fail(ERROR_CODES.DATA_CANNOT_PROCEED)
  }

  const amount = Math.round(
    order.items.reduce((total, item) => total + item.price * item.quantity, 0) *
      100,
  )

  const charge = await omise.charges.create({
    amount,
    currency: 'THB',

    return_uri: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${order.id}`,
    metadata: {
      orderId: order.id,
      userId: order.userId,
    },
  })

  if (!charge.authorize_uri) {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentMethod: 'OMISE',
    },
  })

  return done({
    checkoutUrl: charge.authorize_uri,
  })
}
