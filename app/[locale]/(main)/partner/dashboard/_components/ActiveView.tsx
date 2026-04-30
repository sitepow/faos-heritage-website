'use client'

import { Card } from '@heroui/react'

import { StatCard } from '@/components/ui/StatCard'

export const ActiveView = () => {
  return (
    <div className='space-y-6'>
      <div className='flex items-end justify-between'>
        <div>
          <h1 className='text-default-900 text-2xl font-bold'>
            Partner Dashboard
          </h1>
          <p className='text-default-500'>
            Manage your store and monitor performance
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <StatCard isCurrency label={'Total Sales'} value={12840} />
        <StatCard label={'Package'} value={48} />
        <StatCard label={'Customers'} value={156} />
      </div>

      <Card className='border-default-200 border-2 border-dashed bg-transparent p-10 shadow-none'>
        <div className='text-default-400 text-center'>
          Product Management Table & Other Features Content
        </div>
      </Card>
    </div>
  )
}
