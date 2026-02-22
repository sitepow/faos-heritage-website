// 'use client'

// import { DateRangePicker } from '@heroui/react'
// import { parseDate } from '@internationalized/date'
// import { useTranslations } from 'next-intl'
// import { useState } from 'react'

// import type { RangeValue } from '@heroui/react'
// import type { DateValue } from '@internationalized/date'

// import { AffiliateOrderTable } from './_components/AffiliateOrderTable'

// import { StatCard } from '@/components/ui/StatCard'
// import { useAffiliateStats } from '@/features/order/order.hook'

// const AffiliateDashboardPage = () => {
//   const t = useTranslations('affiliate.dashboard')

//   const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
//     start: parseDate('2026-01-01'),
//     end: parseDate('2026-12-31'),
//   })

//   const { data: result } = useAffiliateStats({
//     startDate: dateRange.start?.toString() || '',
//     endDate: dateRange.end?.toString() || '',
//   })

//   const stats = result?.success
//     ? result.data
//     : { totalRevenue: 0, totalCommission: 0, totalOrders: 0 }

//   return (
//     <div className='min-h-screen p-5 antialiased'>
//       <div className='mx-auto max-w-7xl space-y-8'>
//         <div className='flex flex-col justify-between gap-4 md:flex-row md:items-end'>
//           <div>
//             <h1 className='text-3xl font-bold'>{t('title')}</h1>
//             <p className='text-stone-400'>{t('subtitle')}</p>
//           </div>

//           <div className='w-full md:w-auto'>
//             <DateRangePicker
//               className='max-w-xs'
//               classNames={{
//                 base: 'border-white/10',
//                 inputWrapper: 'bg-white/5 backdrop-blur-md border-white/10',
//                 label: 'text-stone-400',
//               }}
//               label={t('filterLabel')}
//               value={dateRange}
//               variant='bordered'
//               onChange={(value) => value && setDateRange(value)}
//             />
//           </div>
//         </div>

//         <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
//           <StatCard
//             isCurrency
//             label={t('stats.totalRevenue')}
//             value={stats.totalRevenue}
//           />
//           <StatCard
//             isCurrency
//             label={t('stats.totalCommission')}
//             value={stats.totalCommission}
//           />
//           <StatCard label={t('stats.totalOrders')} value={stats.totalOrders} />
//         </div>

//         <div className='rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md'>
//           <div className='mb-6'>
//             <h2 className='text-xl font-bold'>{t('table.title')}</h2>
//           </div>
//           <AffiliateOrderTable
//             endDate={dateRange.end.toString()}
//             startDate={dateRange.start.toString()}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AffiliateDashboardPage

const AffiliateDashboardPage = () => {
  return <div />
}

export default AffiliateDashboardPage
