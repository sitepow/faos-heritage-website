/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { Button } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { CreditCardIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useOmise } from '@/hooks/useOmise'

interface OmisePaymentButtonProps {
  orderId: string
  amount: number
  currency?: string
  buttonText?: string
  onPaymentSuccess?: () => void
  onPaymentError?: (err: any) => void
}

export const OmisePaymentButton = ({
  orderId,
  amount,
  currency = 'THB',
  buttonText = 'Pay now',
  onPaymentSuccess,
  onPaymentError,
}: OmisePaymentButtonProps) => {
  const router = useRouter()
  const { isLoaded, openPaymentForm } = useOmise()

  const { mutate: mutatePayment, isPending } = useMutation({
    mutationFn: async (data: { omiseToken?: string; omiseSource?: string }) => {
      const response = await fetch('/api/omise/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          omiseToken: data.omiseToken,
          omiseSource: data.omiseSource,
          amount: Math.round(amount * 100),
          currency,
        }),
      })

      if (!response.ok) {
        throw new Error('Payment failed')
      }

      return response.json()
    },
    onSuccess: (result) => {
      if (result.success && result.data.authorize_uri) {
        window.location.href = result.data.authorize_uri
      } else if (result.success) {
        onPaymentSuccess?.()
        router.refresh()
      }
    },
    onError: (err) => {
      onPaymentError?.(err)
    },
  })

  const handleClick = () => {
    openPaymentForm({
      amount: Math.round(amount * 100),
      currency,
      defaultPaymentMethod: 'credit_card',
      otherPaymentMethods: 'promptpay',
      onCreateTokenSuccess: (nonce: string) => {
        mutatePayment({
          omiseToken: nonce.startsWith('tokn_') ? nonce : undefined,
          omiseSource: !nonce.startsWith('tokn_') ? nonce : undefined,
        })
      },
    })
  }

  return (
    <Button
      color='primary'
      className='text-secondary'
      isLoading={isPending}
      isDisabled={!isLoaded || isPending}
      startContent={!isPending && <CreditCardIcon />}
      onClick={handleClick}
    >
      {buttonText}
    </Button>
  )
}
