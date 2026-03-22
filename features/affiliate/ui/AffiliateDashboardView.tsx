/* eslint-disable react/no-array-index-key */
'use client'

import { Skeleton, Card, CardBody, Alert } from '@heroui/react'
import { InfoIcon, LinkIcon, TimerIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { AffiliateCommissionTable } from '@/app/[locale]/(main)/affiliate/_components/AffiliateCommissionTable'
import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useAffiliateDashboard } from '@/features/affiliate/hook'

const AffiliateDashboardView = () => {
  const t = useTranslations('affiliate_dashboard')
  const { data, chartData, isLoading } = useAffiliateDashboard()

  return (
    <Container className='flex flex-col gap-8'>
      <Alert
        description={
          <div className='flex flex-col gap-3 pt-2'>
            <p className='text-sm'>{t('alert.description')}</p>
            <ul className='flex flex-col gap-2'>
              <li className='text-tiny flex items-start gap-2'>
                <LinkIcon className='mt-0.5 shrink-0' size={14} />
                <span>
                  <strong>{t('alert.steps.link.title')}:</strong>{' '}
                  {t('alert.steps.link.text1')}
                  <span className='mx-1 underline'>
                    "{t('alert.steps.link.highlight')}"
                  </span>{' '}
                  {t('alert.steps.link.text2')}
                </span>
              </li>
              <li className='text-tiny flex items-start gap-2'>
                <TimerIcon className='mt-0.5 shrink-0' size={14} />
                <span>
                  <strong>{t('alert.steps.cookie.title')}:</strong>{' '}
                  {t('alert.steps.cookie.text1')}
                  <span className='mx-1 underline'>
                    {t('alert.steps.cookie.highlight1')}
                  </span>{' '}
                  {t('alert.steps.cookie.text2')}
                  <span className='mx-1 underline'>
                    {t('alert.steps.cookie.highlight2')}
                  </span>{' '}
                  {t('alert.steps.cookie.text3')}
                </span>
              </li>
              <li className='text-tiny flex items-start gap-2'>
                <InfoIcon className='mt-0.5 shrink-0' size={14} />
                <span>
                  <strong>{t('alert.steps.tip.title')}:</strong>{' '}
                  {t('alert.steps.tip.text')}
                </span>
              </li>
            </ul>
          </div>
        }
        title={t('alert.title')}
      />

      <section className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => {
            return (
              <Skeleton
                key={i}
                className='border-default-100 h-[105px] rounded-xl border'
              />
            )
          })
        ) : (
          <>
            <StatCard
              isCurrency
              label={t('stats.totalEarnings')}
              value={data?.totalEarnings || 0}
            />
            <StatCard
              isCurrency
              label={t('stats.pendingAmount')}
              value={data?.pendingAmount || 0}
            />
            <StatCard
              label={t('stats.totalOrders')}
              value={data?.totalOrders || 0}
            />
          </>
        )}
      </section>

      <section className='grid grid-cols-1 gap-6'>
        <Card className='bg-default-50/50 border-none p-4 shadow-sm'>
          <CardBody className='flex flex-col gap-4'>
            <h3 className='text-lg font-bold'>{t('chart.title')}</h3>
            <div className='h-[350px] w-full'>
              {isLoading ? (
                <Skeleton className='h-full w-full rounded-xl' />
              ) : (
                <ResponsiveContainer height='100%' width='100%'>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id='colorComm'
                        x1='0'
                        x2='0'
                        y1='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor='#17c964'
                          stopOpacity={0.3}
                        />
                        <stop
                          offset='95%'
                          stopColor='#17c964'
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
                      dataKey='commission'
                      fill='url(#colorComm)'
                      fillOpacity={1}
                      stroke='#17c964'
                      strokeWidth={2}
                      type='monotone'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardBody>
        </Card>
      </section>

      <section className='flex flex-col gap-4'>
        <h2 className='text-xl font-bold'>{t('table.title')}</h2>
        <AffiliateCommissionTable
          commissions={data?.recentCommissions || []}
          isLoading={isLoading}
        />
      </section>
    </Container>
  )
}

export { AffiliateDashboardView }
