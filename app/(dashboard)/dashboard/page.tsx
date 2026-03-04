/* eslint-disable react/no-array-index-key */
'use client'

import { Skeleton, Card, CardBody } from '@heroui/react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'

import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useDashboardCharts } from '@/features/dashboard/dashboard.hook'
import { useOrderStats, useRevenueStats } from '@/features/order/order.hook'
import { usePostStats } from '@/features/post/post.hook'
import { useProductStats } from '@/features/product/product.hook'
import { useReviewStats } from '@/features/review/review.hook'
import { useUserStat } from '@/features/user/user.hook'
import localeTh from '@/messages/th/ui/common.json'

interface StatItem {
  name: string
  value: number
  isCurrency?: boolean
}

const STATUS_COLORS: Record<string, string> = {
  PAID: '#17c964',
  PENDING: '#f5a524',
  CANCELLED: '#f31260',
  DELIVERED: '#006fee',
  PROCESSING: '#9353d3',
  REFUNDED: '#71717a',
}

const DashboardPage = () => {
  const statusTranslations = localeTh.global.orderStatus
  const { data: orderStats, isLoading: isOrderLoading } = useOrderStats()
  const { data: revenueStats, isLoading: isRevenueLoading } = useRevenueStats()
  const { data: productStats, isLoading: isProductLoading } = useProductStats()
  const { data: userStats, isLoading: isUserLoading } = useUserStat()
  const { data: postStats, isLoading: isPostLoading } = usePostStats()
  const { data: reviewStats, isLoading: isReviewLoading } = useReviewStats()

  const {
    revenueData,
    statusData,
    salesByCategoryData,
    topProductsData,
    isLoading: isChartLoading,
  } = useDashboardCharts()

  const isLoading =
    isOrderLoading ||
    isRevenueLoading ||
    isProductLoading ||
    isUserLoading ||
    isPostLoading ||
    isReviewLoading

  const isStatArray = (data: unknown): data is StatItem[] => Array.isArray(data)

  const getStatusLabel = (key: string) => {
    return statusTranslations[key as keyof typeof statusTranslations] || key
  }

  return (
    <Container className='flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Dashboard Overview
        </h1>
        <p className='text-default-500'>
          สรุปสถิติและข้อมูลสำคัญของระบบในที่เดียว
        </p>
      </div>

      <section className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
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
          </>
        )}
      </section>

      <section className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <Card className='bg-default-50/50 border-none p-4 shadow-sm lg:col-span-2'>
          <CardBody className='flex flex-col gap-4'>
            <h3 className='text-lg font-bold'>แนวโน้มรายได้ (7 วันล่าสุด)</h3>
            <div className='h-[350px] w-full'>
              {isChartLoading ? (
                <Skeleton className='h-full w-full rounded-xl' />
              ) : (
                <ResponsiveContainer height='100%' width='100%'>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id='colorAmount'
                        x1='0'
                        x2='0'
                        y1='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor='#006fee'
                          stopOpacity={0.3}
                        />
                        <stop
                          offset='95%'
                          stopColor='#006fee'
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke='#e4e4e7'
                      strokeDasharray='3 3'
                      vertical={false}
                    />
                    <XAxis
                      axisLine={false}
                      dataKey='date'
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Area
                      dataKey='ยอดเงิน'
                      fill='url(#colorAmount)'
                      fillOpacity={1}
                      stroke='#006fee'
                      strokeWidth={2}
                      type='monotone'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className='bg-default-50/50 border-none p-4 shadow-sm'>
          <CardBody className='flex flex-col gap-4'>
            <h3 className='text-lg font-bold'>สัดส่วนสถานะออเดอร์</h3>
            <div className='flex h-[350px] w-full items-center justify-center'>
              {isChartLoading ? (
                <Skeleton className='h-[250px] w-[250px] rounded-full' />
              ) : (
                <ResponsiveContainer height='100%' width='100%'>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey='value'
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                    >
                      {statusData.map((entry, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLORS[entry.name] || '#8884d8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      }}
                      formatter={(value, name) => [
                        value,
                        getStatusLabel(name as string),
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className='grid grid-cols-2 gap-2'>
              {statusData.map((item) => (
                <div key={item.name} className='flex items-center gap-2'>
                  <div
                    className='size-2 rounded-full'
                    style={{
                      backgroundColor: STATUS_COLORS[item.name] || '#8884d8',
                    }}
                  />
                  <span className='text-tiny text-default-600 leading-none font-medium'>
                    {getStatusLabel(item.name)}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>

      <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card className='bg-default-50/50 border-none p-4 shadow-sm'>
          <CardBody className='flex flex-col gap-4'>
            <h3 className='text-lg font-bold'>ยอดขายแยกตามหมวดหมู่</h3>
            <div className='h-[300px] w-full'>
              {isChartLoading ? (
                <Skeleton className='h-full w-full rounded-xl' />
              ) : (
                <ResponsiveContainer height='100%' width='100%'>
                  <BarChart data={salesByCategoryData} layout='vertical'>
                    <CartesianGrid
                      horizontal={true}
                      stroke='#e4e4e7'
                      strokeDasharray='3 3'
                      vertical={false}
                    />
                    <XAxis hide type='number' />
                    <YAxis
                      axisLine={false}
                      dataKey='name'
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      type='category'
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none' }}
                      cursor={{ fill: 'transparent' }}
                    />
                    <Bar
                      dataKey='ยอดขาย'
                      fill='#17c964'
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className='bg-default-50/50 border-none p-4 shadow-sm'>
          <CardBody className='flex flex-col gap-4'>
            <h3 className='text-lg font-bold'>
              5 อันดับสินค้าขายดี (จำนวนชิ้น)
            </h3>
            <div className='h-[300px] w-full'>
              {isChartLoading ? (
                <Skeleton className='h-full w-full rounded-xl' />
              ) : (
                <ResponsiveContainer height='100%' width='100%'>
                  <BarChart data={topProductsData}>
                    <CartesianGrid
                      stroke='#e4e4e7'
                      strokeDasharray='3 3'
                      vertical={false}
                    />
                    <XAxis
                      axisLine={false}
                      dataKey='name'
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none' }}
                    />
                    <Bar dataKey='จำนวน' fill='#f5a524' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardBody>
        </Card>
      </section>

      <section className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {!isLoading && (
          <>
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
