import { CheckIcon, XIcon } from 'lucide-react'
import React from 'react'

import type { OrderStatus } from '@prisma/client'
import type { ComponentProps, FC } from 'react'

import { ORDER_STEPS } from '@/utils/const'
import { getOrderStatus } from '@/utils/helper'
import { cn } from '@/utils/style'

interface Props extends ComponentProps<'div'> {
  status?: OrderStatus
}

const Stepper: FC<Props> = ({ className, status, ...props }) => {
  const isCancelledFlow = status === 'CANCELLED' || status === 'REFUNDED'

  if (isCancelledFlow) {
    return (
      <div className={cn('mx-auto w-full max-w-3xl', className)} {...props}>
        <div className='flex flex-col items-center justify-center py-4'>
          <div className='flex size-10 items-center justify-center rounded-full bg-divider text-default-500'>
            <XIcon />
          </div>

          <p className='mt-3 text-center text-sm font-medium text-default-500'>
            {getOrderStatus(status)}
          </p>
        </div>
      </div>
    )
  }

  const currentIndex = ORDER_STEPS.findIndex(([key]) => key === status)

  return (
    <div className={cn('mx-auto w-full max-w-3xl', className)} {...props}>
      <div className='flex flex-col items-center justify-between md:flex-row'>
        {ORDER_STEPS.map(([statusKey, label], index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex

          return (
            <React.Fragment key={statusKey}>
              <div className='flex flex-col items-center'>
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full',
                    isCompleted && 'bg-teal-600 text-white',
                    isCurrent && 'bg-teal-600 text-white ring-4 ring-teal-200',
                    !isCompleted && !isCurrent && 'bg-divider text-default-500',
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className='size-7' strokeWidth={3} />
                  ) : (
                    <span className='text-lg font-semibold'>{index + 1}</span>
                  )}
                </div>

                <p
                  className={cn(
                    'mt-3 max-w-[120px] text-center text-sm font-medium',
                    !isCompleted && !isCurrent && 'text-default-500',
                  )}
                >
                  {label}
                </p>
              </div>

              {index < ORDER_STEPS.length - 1 && (
                <div className='relative mx-4 hidden h-1 max-w-[150px] flex-1 md:block'>
                  <div className='absolute inset-0 rounded bg-divider' />
                  <div
                    className={cn(
                      'absolute inset-0 rounded bg-teal-600 transition-all duration-500',
                      index < currentIndex ? 'w-full' : 'w-0',
                    )}
                  />
                </div>
              )}

              {index < ORDER_STEPS.length - 1 && (
                <div className='relative my-4 block h-8 w-1 md:hidden'>
                  <div className='absolute inset-0 rounded bg-divider' />
                  <div
                    className={cn(
                      'absolute inset-0 rounded bg-teal-600 transition-all duration-500',
                      index < currentIndex ? 'h-full' : 'h-0',
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export { Stepper }
