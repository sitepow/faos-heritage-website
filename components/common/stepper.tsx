import { OrderStatus } from '@prisma/client'
import {
  CreditCardIcon,
  XIcon,
  PackageOpenIcon,
  PackageIcon,
  PackageCheckIcon,
} from 'lucide-react'
import React from 'react'

import type { ComponentProps } from 'react'

import { formatDate } from '@/utils/date'
import { ORDER_STEPS, getOrderStatus } from '@/utils/features'
import { cn } from '@/utils/style'

interface StepperProps extends ComponentProps<'div'> {
  status: OrderStatus
  createdAt: Date
  paidAt: Date
  shippedAt: Date
  deliveredAt: Date
}

export const Stepper = ({
  className,
  status,
  createdAt,
  paidAt,
  shippedAt,
  deliveredAt,
  ...props
}: StepperProps) => {
  const isCancelled = status === 'CANCELLED' || status === 'REFUNDED'
  const currentIndex = ORDER_STEPS.findIndex(([key]) => key === status)

  const STEP_ICONS: Record<OrderStatus, React.ElementType> = {
    PENDING: PackageOpenIcon,
    PAID: CreditCardIcon,
    PROCESSING: PackageIcon,
    DELIVERED: PackageCheckIcon,
    CANCELLED: XIcon,
    REFUNDED: XIcon,
  }

  const statusDates: Record<string, Date | null> = {
    [OrderStatus.PENDING]: createdAt,
    [OrderStatus.PAID]: paidAt,
    [OrderStatus.PROCESSING]: shippedAt,
    [OrderStatus.DELIVERED]: deliveredAt,
  }

  if (isCancelled) {
    return (
      <div className={cn('mx-auto w-full max-w-3xl', className)} {...props}>
        <div className='flex flex-col items-center justify-center py-4'>
          <div className='bg-divider text-default-500 flex size-10 items-center justify-center rounded-full'>
            <XIcon />
          </div>

          <p className='text-default-500 mt-3 text-center text-sm font-medium'>
            {getOrderStatus(status)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('mx-auto w-full max-w-3xl', className)} {...props}>
      <div className='flex flex-col items-center justify-between md:flex-row'>
        {ORDER_STEPS.map(([statusKey, label], index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const date = statusDates[statusKey]

          const Icon = STEP_ICONS[statusKey as OrderStatus]

          return (
            <React.Fragment key={statusKey}>
              <div className='flex flex-col items-center'>
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full',
                    isCompleted && 'bg-primary text-secondary',
                    isCurrent &&
                      'bg-primary ring-primary/50 text-secondary ring-4',
                    !isCompleted && !isCurrent && 'bg-divider text-default-500',
                  )}
                >
                  {isCompleted || isCurrent ? (
                    <Icon />
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
                  {label} {formatDate(date!)}
                </p>
              </div>

              {index < ORDER_STEPS.length - 1 && (
                <div className='relative mx-4 hidden h-1 max-w-[150px] flex-1 md:block'>
                  <div className='bg-divider absolute inset-0 rounded' />
                  <div
                    className={cn(
                      'bg-primary absolute inset-0 rounded transition-all duration-500',
                      index < currentIndex ? 'w-full' : 'w-0',
                    )}
                  />
                </div>
              )}

              {index < ORDER_STEPS.length - 1 && (
                <div className='relative my-4 block h-8 w-1 md:hidden'>
                  <div className='bg-divider absolute inset-0 rounded' />
                  <div
                    className={cn(
                      'bg-primary absolute inset-0 rounded transition-all duration-500',
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
