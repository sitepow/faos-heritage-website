'use client'

import { Button } from '@heroui/react'
import { useQueries } from '@tanstack/react-query'
import { SettingsIcon } from 'lucide-react'

import { ImageBannerManager } from './banner/manager'
import { useImageBannerStore } from './banner/store'
import { getOrderStat, getOrderStatCash } from './order/action'
import { getProductStat } from './product/action/product'
import { getUserStat } from './user/action'
import { StatCardSkeleton, StatCard } from '../../../../components/ui/StatCard'

interface StatItem {
  name: string
  value: number
}

export default function Dashboard() {
  const { onOpenImageBannertManagerChange } = useImageBannerStore()
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
    <>
      <ImageBannerManager />
      <section className='flex flex-col items-center justify-center gap-4 text-center'>
        <div className='flex w-full justify-center gap-2'>
          <Button
            color='primary'
            startContent={<SettingsIcon />}
            variant='bordered'
            onClick={() => {
              onOpenImageBannertManagerChange()
            }}
          >
            จัดการรูปภาพสไลด์
          </Button>
        </div>

        <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {results.map((result, index) => {
            if (result.isLoading) {
              return <StatCardSkeleton key={`skeleton-${index}`} />
            }

            return result.data?.map((item) => (
              <StatCard key={item.name} {...item} name={item.name} />
            ))
          })}
        </div>
      </section>
    </>
  )
}
