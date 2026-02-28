'use client'

import { Card } from '@heroui/react'

import { useStatCardValue } from '@/hooks/useStatCardValue'

interface StatCardProps {
  label: string
  value: number
  isCurrency?: boolean
}

const StatCard = ({ label, value, isCurrency }: StatCardProps) => {
  const displayValue = useStatCardValue({ value, isCurrency })

  return (
    <Card className='border-default-100 border' radius='sm' shadow='none'>
      <div className='p-4'>
        <dl className='flex flex-col gap-y-2'>
          <dt className='text-small text-default-500 font-medium'>{label}</dt>
          <dd className='text-default-700 text-2xl font-semibold'>
            {displayValue}
          </dd>
        </dl>
      </div>
    </Card>
  )
}

export { StatCard }
