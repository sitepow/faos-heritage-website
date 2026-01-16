/* eslint-disable @typescript-eslint/no-explicit-any */

import { OrderStatus, PaymentStatus } from '@prisma/client'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const event = await req.json()

    if (event.key === 'charge.complete') {
      const orderId = event?.data?.metadata?.orderId

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.PAID,
            paymentStatus: PaymentStatus.PAID,
            paidAt: new Date(),
          },
        })
      }
    } else if (event.key === 'charge.failed') {
      const orderId = event?.data?.metadata?.orderId

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.CANCELLED,
            paymentStatus: PaymentStatus.FAILED,
          },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    )
  }
}
