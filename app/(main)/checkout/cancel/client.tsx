'use client'

import { XCircleIcon } from 'lucide-react'

import { useQueryParams } from '@/hooks/useQueryParams'

export const CancelClient = () => {
  const { getQueryParam } = useQueryParams()
  const orderId = getQueryParam('orderId')

  return (
    <section className='flex flex-col items-center justify-center gap-3 text-center'>
      <div className='flex flex-col items-center gap-4'>
        <XCircleIcon className='text-default-500 size-10' />
        <h1 className='text-2xl'>Cancel payment</h1>
      </div>

      <span className='text-default-500 sm:w-4/5 lg:w-1/2'>
        Your payment has not been completed or has been canceled before
        completion. The system has not yet charged you.
        {orderId && (
          <>
            {' '}
            This order has the following reference number{' '}
            <span className='text-primary underline'>{orderId}</span> To place a
            new order, you can go back and start the process immediately. Or use
            this number to contact customer service.
          </>
        )}
      </span>
    </section>
  )
}
