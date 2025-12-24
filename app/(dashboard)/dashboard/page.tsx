'use client'

import { useQueries } from '@tanstack/react-query'

import { StatCard, StatCardSkeleton } from '../components'
import { getOrderStat, getOrderStatCash } from './order/action'
import { getProductStat } from './product/action/product'
import { getUserStat } from './user/action'

interface StatItem {
  name: string
  value: number
}

export default function Dashboard() {
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
