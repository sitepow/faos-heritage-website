// 'use client'

// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Chip,
// } from '@heroui/react'
// import { OrderStatus } from '@prisma/client'
// import { useLocale } from 'next-intl'

// import { AFFILIATE_CONFIG } from '@/constants'
// import { useAffiliateOrders } from '@/features/order/order.hook'
// import { formatDate } from '@/utils'

// const getStatusColor = (status: OrderStatus) => {
//   switch (status) {
//     case OrderStatus.DELIVERED:
//       return 'success'
//     case OrderStatus.PENDING:
//       return 'warning'
//     case OrderStatus.CANCELLED:
//     case OrderStatus.REFUNDED:
//       return 'danger'
//     default:
//       return 'primary'
//   }
// }

// const AffiliateOrderTable = ({
//   startDate,
//   endDate,
// }: {
//   startDate: string
//   endDate: string
// }) => {
//   const locale = useLocale()

//   const { data: result, isLoading } = useAffiliateOrders({
//     page: 1,
//     limit: 10,
//     startDate,
//     endDate,
//   })

//   const orders = result?.success ? result.data.items : []

//   return (
//     <Table
//       removeWrapper
//       aria-label='Affiliate Orders'
//       classNames={{
//         th: 'bg-transparent text-stone-400 border-b border-white/10 py-4',
//         td: 'py-4 text-stone-300 border-b border-white/5',
//       }}
//     >
//       <TableHeader>
//         <TableColumn>ORDER ID</TableColumn>
//         <TableColumn>DATE</TableColumn>
//         <TableColumn align='end'>AMOUNT</TableColumn>
//         <TableColumn align='center'>RATE</TableColumn>
//         <TableColumn align='end'>EARNINGS</TableColumn>
//         <TableColumn align='center'>STATUS</TableColumn>
//       </TableHeader>
//       <TableBody emptyContent={'No orders found'} isLoading={isLoading}>
//         {orders.map((order) => {
//           const isHighTier =
//             order.commissionRate === AFFILIATE_CONFIG.HIGH_COMMISSION_RATE

//           return (
//             <TableRow key={order.id}>
//               <TableCell className='font-mono text-xs text-stone-500'>
//                 #{order.id.slice(-8).toUpperCase()}
//               </TableCell>

//               <TableCell>{formatDate(order.createdAt, locale)}</TableCell>

//               <TableCell className='text-right font-bold text-white'>
//                 ฿{order.baseTotal.toLocaleString()}
//               </TableCell>

//               <TableCell align='center'>
//                 <Chip
//                   className='bg-white/5 font-semibold text-amber-400'
//                   color={isHighTier ? 'warning' : 'default'}
//                   size='sm'
//                   variant='flat'
//                 >
//                   {order.commissionRate * 100}%
//                 </Chip>
//               </TableCell>

//               <TableCell className='text-right font-bold text-amber-400'>
//                 +฿{order.estimatedEarnings.toLocaleString()}
//               </TableCell>

//               <TableCell align='center'>
//                 <Chip
//                   classNames={{
//                     base: 'border-white/10',
//                   }}
//                   color={getStatusColor(order.status as OrderStatus)}
//                   size='sm'
//                   variant='dot'
//                 >
//                   {order.status}
//                 </Chip>
//               </TableCell>
//             </TableRow>
//           )
//         })}
//       </TableBody>
//     </Table>
//   )
// }

// export { AffiliateOrderTable }
