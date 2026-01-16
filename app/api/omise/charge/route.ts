/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { orderId, omiseToken, omiseSource, amount, currency } =
      await req.json()

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Missing orderId' },
        { status: 400 },
      )
    }

    if (!omiseToken && !omiseSource) {
      return NextResponse.json(
        { success: false, message: 'No token or source provided' },
        { status: 400 },
      )
    }

    const amountSatang = Math.round(Number(amount))

    const formData = new URLSearchParams()
    formData.append('amount', String(amountSatang))
    formData.append('currency', currency)
    formData.append('metadata[orderId]', orderId)

    if (omiseToken) {
      formData.append('card', omiseToken)
    }
    if (omiseSource) {
      formData.append('source', omiseSource)
    }

    const resp = await fetch('https://api.omise.co/charges', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(process.env.OMISE_SECRET_KEY + ':').toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const data = await resp.json()

    if (resp.ok) {
      if (data.status === 'pending' && data.authorize_uri) {
        return NextResponse.json({
          success: true,
          data: { authorize_uri: data.authorize_uri },
        })
      }

      if (data.authorize_uri) {
        return NextResponse.json({
          success: true,
          data: { authorize_uri: data.authorize_uri },
        })
      }

      return NextResponse.json({ success: true, data: data })
    } else {
      return NextResponse.json({ success: false, data }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    )
  }
}
