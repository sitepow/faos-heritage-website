/* eslint-disable react/no-array-index-key */
'use client'

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
} from '@heroui/react'
import { CheckIcon } from 'lucide-react'

import type { ReactNode } from 'react'

import { cn, formatCurrency } from '@/utils'

export interface FeatureItem {
  text: ReactNode
  icon?: ReactNode
}

export interface PricingCardProps {
  title: string
  features: FeatureItem[]
  buttonText: string
  isPopular?: boolean
  displayPrice: number
  description?: string
  onClick?: () => void
}

export function PricingCard({
  title,
  features,
  buttonText,
  isPopular,
  displayPrice,
  description,
  onClick,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        'h-full border-2 border-transparent p-2 transition-all',
        isPopular && 'border-primary/50',
      )}
      shadow='sm'
    >
      <CardHeader className='flex flex-col items-center pt-6 pb-0 text-center'>
        <h2 className='text-xl leading-tight font-bold'>{title}</h2>
        {description && (
          <p className='text-default-500 text-small mt-2 line-clamp-2'>
            {description}
          </p>
        )}
      </CardHeader>

      <Divider className='my-4 w-3/4 self-center' />

      <CardBody className='flex flex-col items-center py-0'>
        <div className='flex flex-col items-center gap-1'>
          <div className='flex items-baseline gap-1'>
            <span className='text-4xl font-bold'>
              {formatCurrency(displayPrice)}
            </span>
            <span className='text-small font-bold'>/ ปี</span>
          </div>
        </div>

        <Divider className='my-6 w-3/4 self-center' />

        <ul className='mb-4 flex w-full flex-col gap-3 px-2'>
          {features.map((feature, index) => (
            <li key={index} className='text-small flex items-center gap-3'>
              <span className='text-primary mt-0.5 flex-shrink-0'>
                {feature.icon ?? <CheckIcon size={18} />}
              </span>
              <span className='text-default-600'>{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardBody>

      <CardFooter>
        <Button
          fullWidth
          className={cn('text-medium font-bold', isPopular && 'text-secondary')}
          color={isPopular ? 'primary' : 'default'}
          radius='full'
          size='lg'
          variant={isPopular ? 'solid' : 'bordered'}
          onPress={onClick}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
