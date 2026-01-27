'use client'

import { OrderStatus } from '@prisma/client'
import { useTranslations } from 'next-intl'
import React from 'react'

import type { ComponentProps } from 'react'

import { OrderStep } from './OrderStep'
import { StepConnector } from './StepConnector'
import { getOrderStatusDate, ORDER_STATUS_ICONS } from './stepConfig'

import { useAppStore } from '@/app/store'
import { ORDER_STEPS } from '@/constants/app'
import { cn } from '@/utils/style'

interface OrderStepperProps extends ComponentProps<'div'> {
  status: OrderStatus
  createdAt: Date
  paidAt?: Date | null
  shippedAt?: Date | null
  deliveredAt?: Date | null
}

const OrderStepper = ({
  className,
  status,
  createdAt,
  paidAt,
  shippedAt,
  deliveredAt,
  ...props
}: OrderStepperProps) => {
  const t = useTranslations('OrderStatus')
  const { appLocale } = useAppStore()

  const isCancelled =
    status === OrderStatus.CANCELLED || status === OrderStatus.REFUNDED

  const currentStepIndex = ORDER_STEPS.findIndex(([key]) => key === status)

  if (isCancelled) {
    const Icon = ORDER_STATUS_ICONS[status]

    return (
      <div className={cn('mx-auto w-full max-w-3xl', className)} {...props}>
        <div className='flex flex-col items-center py-4'>
          <div className='bg-divider text-default-500 flex size-10 items-center justify-center rounded-full'>
            <Icon />
          </div>

          <p className='text-default-500 mt-3 text-sm font-medium'>
            {t(status)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('mx-auto w-full max-w-3xl', className)} {...props}>
      <div className='flex flex-col items-center md:flex-row'>
        {ORDER_STEPS.map(([stepStatus], index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex

          const date = getOrderStatusDate(stepStatus, {
            createdAt,
            paidAt,
            shippedAt,
            deliveredAt,
          })

          return (
            <React.Fragment key={stepStatus}>
              <OrderStep
                status={stepStatus}
                label={t(stepStatus)}
                date={date}
                index={index}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                locale={appLocale?.locale}
              />

              {index < ORDER_STEPS.length - 1 && (
                <StepConnector isActive={index < currentStepIndex} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export { OrderStepper }
