'use client'

import { OrderStatus, DeliveryType } from '@prisma/client'
import { useTranslations } from 'next-intl'
import React, { useMemo } from 'react'

import type { ComponentProps } from 'react'

import { OrderStep } from './OrderStep'
import { StepConnector } from './StepConnector'
import { getOrderStatusDate, ORDER_STATUS_ICONS } from './stepConfig'

import { SHIPPING_STEPS, PICKUP_STEPS } from '@/constants'
import { cn } from '@/utils/style'

interface Props extends ComponentProps<'div'> {
  status: OrderStatus
  deliveryType: DeliveryType
  createdAt: Date
  paidAt?: Date | null
  shippedAt?: Date | null
  deliveredAt?: Date | null
  updatedAt?: Date | null
  pickupDate?: Date | null
}

const OrderStepper = ({
  className,
  status,
  deliveryType,
  createdAt,
  paidAt,
  shippedAt,
  deliveredAt,
  updatedAt,
  pickupDate,
  ...props
}: Props) => {
  const t = useTranslations('global.orderStatus')

  const isCancelled =
    status === OrderStatus.CANCELLED || status === OrderStatus.REFUNDED

  const steps = useMemo(() => {
    return deliveryType === DeliveryType.PICKUP ? PICKUP_STEPS : SHIPPING_STEPS
  }, [deliveryType])

  const currentStepIndex = steps.findIndex((key) => {
    return key === status
  })

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
        {steps.map((stepStatus, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex

          const date = getOrderStatusDate(stepStatus, {
            createdAt,
            paidAt,
            shippedAt,
            deliveredAt,
            updatedAt,
            pickupDate,
          })

          return (
            <React.Fragment key={stepStatus}>
              <OrderStep
                date={date}
                index={index}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                label={t(stepStatus)}
                status={stepStatus}
              />

              {index < steps.length - 1 && (
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
