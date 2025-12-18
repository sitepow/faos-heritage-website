'use client'

import { useQueries } from '@tanstack/react-query'

import { getOrderStat, getOrderStatCash } from '../actions/order'
import { getProductStat } from '../actions/product'
import { getUserStat } from '../actions/user'

import {
  StatCard,
  StatCardSkeleton,
} from '@/app/(dashboard)/_components/card/stat'

interface StatItem {
  name: string
  value: number
}

const Index = () => {
  const statsConfig = [
    {
      queryKey: ['dashboard', 'orders', 'stat', 'cash'],
      queryFn: getOrderStatCash,
    },
    { queryKey: ['dashboard', 'orders', 'stat'], queryFn: getOrderStat },
    { queryKey: ['dashboard', 'products', 'stat'], queryFn: getProductStat },
    { queryKey: ['dashboard', 'users', 'stat'], queryFn: getUserStat },
  ]

  const results = useQueries({
    queries: statsConfig.map((conf) => ({
      queryKey: conf.queryKey,
      queryFn: conf.queryFn as () => Promise<StatItem[]>,
    })),
  })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {results.map((result, index) => {
          if (result.isLoading) {
            return <StatCardSkeleton key={`skeleton-${index}`} />
          }

          return result.data?.map((item) => (
            <StatCard key={item.name} {...item} />
          ))
        })}
      </div>
    </section>
  )
}

export default Index
