/* eslint-disable react/no-array-index-key */
'use client'

import { Skeleton } from '@heroui/react'

import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useOrderStats, useRevenueStats } from '@/features/order/order.hook'
import { usePostStats } from '@/features/post/post.hook'
import { useProductStats } from '@/features/product/product.hook'
import { useReviewStats } from '@/features/review/review.hook'
import { useUserStat } from '@/features/user/user.hook'

interface StatItem {
  name: string
  value: number
  isCurrency?: boolean
}

const DashboardPage = () => {
  const { data: orderStats, isLoading: isOrderLoading } = useOrderStats()
  const { data: revenueStats, isLoading: isRevenueLoading } = useRevenueStats()
  const { data: productStats, isLoading: isProductLoading } = useProductStats()
  const { data: userStats, isLoading: isUserLoading } = useUserStat()
  const { data: postStats, isLoading: isPostLoading } = usePostStats()
  const { data: reviewStats, isLoading: isReviewLoading } = useReviewStats()

  const isLoading =
    isOrderLoading ||
    isRevenueLoading ||
    isProductLoading ||
    isUserLoading ||
    isPostLoading ||
    isReviewLoading

  const isStatArray = (data: unknown): data is StatItem[] => Array.isArray(data)

  return (
    <Container className='flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Dashboard Overview
        </h1>
        <p className='text-default-500'>
          สรุปสถิติและข้อมูลสำคัญของระบบในที่เดียว
          (รวมข้อมูลบทความและรีวิวล่าสุด)
        </p>
      </div>

      <section className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className='border-default-100 h-[120px] rounded-xl border'
            />
          ))
        ) : (
          <>
            {isStatArray(revenueStats) &&
              revenueStats.map((stat) => (
                <StatCard
                  key={stat.name}
                  isCurrency={stat.isCurrency}
                  label={stat.name}
                  value={stat.value}
                />
              ))}

            {isStatArray(orderStats) &&
              orderStats.map((stat) => (
                <StatCard
                  key={stat.name}
                  label={stat.name}
                  value={stat.value}
                />
              ))}

            {isStatArray(postStats) &&
              postStats.map((stat) => (
                <StatCard
                  key={stat.name}
                  label={stat.name}
                  value={stat.value}
                />
              ))}

            {isStatArray(reviewStats) &&
              reviewStats.map((stat) => (
                <StatCard
                  key={stat.name}
                  label={stat.name}
                  value={stat.value}
                />
              ))}

            {isStatArray(productStats) &&
              productStats.map((stat) => (
                <StatCard
                  key={stat.name}
                  label={stat.name}
                  value={stat.value}
                />
              ))}

            {isStatArray(userStats) &&
              userStats.map((stat) => (
                <StatCard
                  key={stat.name}
                  label={stat.name}
                  value={stat.value}
                />
              ))}
          </>
        )}
      </section>
    </Container>
  )
}

export default DashboardPage
