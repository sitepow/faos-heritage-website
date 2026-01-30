// 'use client'

// import { AvatarGroup, Avatar, Button, Alert } from '@heroui/react'
// import { OrderStatus } from '@prisma/client'
// import { useMutation } from '@tanstack/react-query'
// import { ArrowRight, ArrowUpRightIcon, DownloadIcon, XIcon } from 'lucide-react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'

// import type { GetOrderResult } from '@/app/[locale]/(dashboard)/dashboard/order/action'

// import { useOrderStore } from '@/app/[locale]/(dashboard)/dashboard/order/store'
// import { createStripeCheckout } from '@/app/actions/stripe'
// import { Stepper } from '@/components/ui/OrderStepper/OrderStepper'
// // import { OmisePayment } from '@/components/features/omise/payment'
// import { NO_IMAGE } from '@/constants/seo'
// import { formatDate } from '@/utils/date'
// import { formatCurrency, formatNumber } from '@/utils/number'

// interface OrderItemProps {
//   order: GetOrderResult
//   hideButton?: boolean
// }

// const DISABLE_RECEIPT_STATUSES: OrderStatus[] = [
//   OrderStatus.CANCELLED,
//   OrderStatus.PAID,
//   OrderStatus.PROCESSING,
//   OrderStatus.REFUNDED,
// ]

// export const OrderItem = ({ order, hideButton }: OrderItemProps) => {
//   const t = useTranslations('Account.Orders')
//   const st = useTranslations('OrderStatus')

//   const CURRENCY_OPTIONS = {
//     currency: order?.currency,
//     locale: order?.exchangeLocale!,
//   }

//   const router = useRouter()
//   const { onOpenViewChange, onOpenOrderCancelChange, setState } =
//     useOrderStore()

//   const { mutate: mutateCheckout, isPending: isPendingCheckout } = useMutation({
//     mutationFn: () => createStripeCheckout({ orderId: order?.id! }),
//     onSuccess: (result) => {
//       if (result.success) {
//         router.push(result.data.checkoutUrl)
//       }
//     },
//   })

//   const productImages = order.items?.map(
//     (item) => item.product?.images?.[0]?.url ?? NO_IMAGE,
//   )

//   const isDisableReceipt = DISABLE_RECEIPT_STATUSES.includes(order.status)

//   return (
//     <div className='flex flex-col gap-4'>
//       {order?.status === OrderStatus.PENDING && (
//         <Alert
//           color='warning'
//           description={t('paymentAlert')}
//           variant='faded'
//         />
//       )}

//       <div className='border-divider flex flex-wrap items-center justify-between gap-3 border-b p-2.5'>
//         <div className='flex flex-wrap gap-3 sm:col-span-2'>
//           <AvatarGroup isBordered max={4}>
//             {productImages.map((src) => (
//               <Avatar key={src} size='sm' src={src} />
//             ))}
//           </AvatarGroup>

//           <div className='flex flex-col'>
//             <span>
//               {t('orderNumber')} {order?.id} (
//               {formatNumber(order?.items?.length)} {t('items')}){' '}
//               {formatCurrency(order?.total, CURRENCY_OPTIONS)}
//             </span>

//             <span className='text-default-500'>
//               {t('orderDate')} {formatDate(order.createdAt)} ({st(order.status)}
//               ){' '}
//               {order.trackingNumber && (
//                 <Link
//                   className='underline'
//                   href={order.trackingWebsite ?? ''}
//                   target='_blank'
//                 >
//                   {t('trackingNumber')} <span>{order.trackingNumber}</span>
//                 </Link>
//               )}
//             </span>
//           </div>
//         </div>

//         {!hideButton && (
//           <div className='flex flex-wrap items-center gap-2 sm:justify-end'>
//             <Button
//               color='primary'
//               startContent={<ArrowUpRightIcon className='shrink-0' />}
//               variant='bordered'
//               onClick={() => {
//                 setState({ orderId: order?.id })
//                 onOpenViewChange()
//               }}
//             >
//               {t('buttons.details')}
//             </Button>
//             {order?.status === OrderStatus.PENDING && (
//               <Button
//                 color='primary'
//                 startContent={<XIcon className='shrink-0' />}
//                 variant='bordered'
//                 onClick={() => {
//                   setState({ orderId: order?.id })
//                   onOpenOrderCancelChange()
//                 }}
//               >
//                 {t('buttons.cancel')}
//               </Button>
//             )}
//             {order?.status === OrderStatus.PENDING && (
//               <Button
//                 color='primary'
//                 endContent={
//                   !isPendingCheckout && <ArrowRight className='shrink-0' />
//                 }
//                 isDisabled={isPendingCheckout}
//                 isLoading={isPendingCheckout}
//                 variant='bordered'
//                 onClick={() => {
//                   mutateCheckout()
//                 }}
//               >
//                 {t('buttons.payNow')}
//               </Button>
//             )}
//             {order?.status !== OrderStatus.PENDING && (
//               <Button
//                 color='primary'
//                 isDisabled={isDisableReceipt}
//                 startContent={<DownloadIcon className='shrink-0' />}
//                 variant='bordered'
//               >
//                 {t('buttons.downloadReceipt')}
//               </Button>
//             )}
//           </div>
//         )}
//       </div>

//       <Stepper
//         className='p-5'
//         createdAt={order?.createdAt!}
//         deliveredAt={order?.deliveredAt!}
//         paidAt={order?.paidAt!}
//         shippedAt={order?.shippedAt!}
//         status={order.status}
//       />
//     </div>
//   )
// }
