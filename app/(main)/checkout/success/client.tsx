'use client'

import { CheckCircle2Icon } from 'lucide-react'

import { useQueryParams } from '@/hooks/useQueryParams'

export const SuccessClient = () => {
  const { getQueryParam } = useQueryParams()
  const orderId = getQueryParam('orderId')

  return (
    <section className='flex flex-col items-center justify-center gap-3 text-center'>
      <div className='flex flex-col items-center gap-4'>
        <CheckCircle2Icon className='size-10 text-teal-600' />
        <h1 className='text-2xl'>Payment successful</h1>
      </div>

      <span className='text-default-500 sm:w-4/5 lg:w-1/2'>
        Thank you for your order. Your payment has been verified and confirmed.
        {orderId && (
          <>
            {' '}
            This order has the following reference number{' '}
            <span className='text-primary underline'>{orderId}</span> Please
            keep this order number for later status checks or to contact
            customer service.
          </>
        )}
      </span>
    </section>
  )
}
