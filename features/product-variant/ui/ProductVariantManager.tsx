// 'use client'

// import {
//   useDisclosure,
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   Spinner,
//   Card,
//   CardBody,
//   Dropdown,
//   DropdownTrigger,
//   Button,
//   DropdownMenu,
//   DropdownItem,
//   ModalFooter,
//   Chip,
//   Avatar,
// } from '@heroui/react'
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import {
//   EditIcon,
//   EllipsisVerticalIcon,
//   PlusIcon,
//   TrashIcon,
// } from 'lucide-react'
// import { useTranslations } from 'next-intl'

// import { deleteVariant, getVariants } from '../../action/variant'
// import { useProductStore } from '../../store'
// import { VariantForm } from '../form/variant'

// import { useAppStore } from '@/app/store'
// import { ConfirmModal } from '@/components/ui/ConfirmModal'
// import { EXCHANGE_RATE_TTL } from '@/constants/app'
// import { NO_IMAGE } from '@/constants/seo'
// import { getThbExchangeRates } from '@/utils/currency/exchange'
// import { formatCurrency, formatNumber } from '@/utils/number'
// import { cn } from '@/utils/style'

// export const VariantManager = () => {
//   const t = useTranslations('Dashboard.VariantManager')
//   const { country, hasHydrated } = useAppStore()

//   const { data: exchangeRates } = useQuery({
//     queryKey: ['exchange-rates', 'THB'],
//     queryFn: getThbExchangeRates,
//     staleTime: EXCHANGE_RATE_TTL,
//     gcTime: EXCHANGE_RATE_TTL * 2,
//     enabled: hasHydrated,
//     refetchOnWindowFocus: false,
//     retry: 1,
//   })

//   const CURRENCY_OPTIONS = {
//     currency: country?.currency,
//     locale: country?.locale,
//     rates: exchangeRates,
//   }

//   const queryClient = useQueryClient()
//   const {
//     productId,
//     variantId,
//     isVariantManagerOpen,
//     onOpenVariantChange,
//     onOpenVariantManagerChange,
//     setState,
//   } = useProductStore()

//   const QUERY_KEY = {
//     PRODUCT: ['dashboard', 'products', 'pagination'],
//     VARIANTS: ['dashboard', 'variants', 'modal', productId],
//   }

//   const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
//     useDisclosure()

//   const { data: variants, isLoading: isLoadingVariants } = useQuery({
//     queryKey: QUERY_KEY.VARIANTS,
//     queryFn: () => getVariants(productId!),
//     enabled: !!productId && isVariantManagerOpen,
//   })

//   const onRefetch = async () => {
//     await Promise.all([
//       queryClient.invalidateQueries({
//         queryKey: QUERY_KEY.VARIANTS,
//       }),
//       queryClient.invalidateQueries({
//         queryKey: QUERY_KEY.PRODUCT,
//       }),
//     ])
//   }

//   const { mutate: mutateDeteleVariant, isPending: isPendingDeteleVariant } =
//     useMutation({
//       mutationFn: deleteVariant,
//       onSuccess: () => {
//         onRefetch()
//         onOpenDeleteChange()
//         setState({ variantId: null })
//       },
//     })

//   const onClose = async () => {
//     setState({ productId: null, variantId: null })
//     onOpenVariantManagerChange()
//   }

//   return (
//     <>
//       <ConfirmModal
//         isOpen={isDeleteOpen}
//         isPending={isPendingDeteleVariant}
//         onConfirm={() => {
//           mutateDeteleVariant(variantId!)
//         }}
//         onOpenChange={onOpenDeleteChange}
//       />
//       <VariantForm />

//       <Modal
//         hideCloseButton
//         isDismissable={false}
//         isOpen={isVariantManagerOpen}
//         size='xl'
//         onOpenChange={onOpenVariantManagerChange}
//       >
//         <ModalContent>
//           <ModalHeader>{t('title')}</ModalHeader>

//           {isLoadingVariants && (
//             <ModalBody>
//               <Spinner label={t('loading')} />
//             </ModalBody>
//           )}

//           {!isLoadingVariants && variants?.length === 0 && (
//             <ModalBody>
//               <p className='text-default-500 text-center'>{t('noData')}</p>
//             </ModalBody>
//           )}

//           {variants?.length !== 0 && (
//             <ModalBody>
//               <div className='grid grid-cols-1 gap-3'>
//                 {variants?.map((variant) => (
//                   <Card
//                     key={variant.id}
//                     className={cn(
//                       'border-l-4',
//                       variant.isActive && 'border-primary',
//                     )}
//                   >
//                     <CardBody className='flex-row items-center justify-between'>
//                       <div className='line-clamp-1 flex flex-col'>
//                         <div className='flex flex-wrap items-center gap-2'>
//                           <Avatar src={variant?.image ?? NO_IMAGE} />
//                           <span className='line-clamp-2'>{variant.name}</span>
//                         </div>

//                         <div className='mt-2.5 flex gap-2 text-sm'>
//                           {!!variant.sku && (
//                             <Chip variant='bordered'>
//                               <span className='text-default-500'>
//                                 {t('sku')}: {variant.sku}
//                               </span>
//                             </Chip>
//                           )}

//                           <Chip variant='bordered'>
//                             <span
//                               className={cn(
//                                 'text-default-500',
//                                 !variant.price && 'text-red-500',
//                               )}
//                             >
//                               {variant.price
//                                 ? `${t('price')}: ${formatCurrency(variant?.price ?? 0, CURRENCY_OPTIONS)}`
//                                 : t('priceNotSpecified')}
//                             </span>
//                           </Chip>

//                           <Chip variant='bordered'>
//                             <span
//                               className={cn(
//                                 'text-default-500',
//                                 !variant.stockQuantity && 'text-red-500',
//                               )}
//                             >
//                               {variant.stockQuantity
//                                 ? `${t('stock')}: ${formatNumber(variant.stockQuantity)}`
//                                 : t('stockNotSpecified')}
//                             </span>
//                           </Chip>
//                         </div>
//                       </div>

//                       <Dropdown placement='bottom-end'>
//                         <DropdownTrigger>
//                           <Button isIconOnly size='sm' variant='light'>
//                             <EllipsisVerticalIcon className='text-default-500 size-5' />
//                           </Button>
//                         </DropdownTrigger>
//                         <DropdownMenu
//                           aria-label='Manage variants'
//                           className='min-w-[180px]'
//                         >
//                           <DropdownItem
//                             key='edit'
//                             startContent={<EditIcon className='size-4' />}
//                             onClick={() => {
//                               setState({ variantId: variant.id })
//                               onOpenVariantManagerChange()
//                               onOpenVariantChange()
//                             }}
//                           >
//                             {t('editInfo')}
//                           </DropdownItem>
//                           <DropdownItem
//                             key='delete'
//                             className='text-danger'
//                             color='danger'
//                             startContent={<TrashIcon className='size-4' />}
//                             onClick={() => {
//                               setState({ variantId: variant.id })
//                               onOpenDeleteChange()
//                             }}
//                           >
//                             {t('removeOption')}
//                           </DropdownItem>
//                         </DropdownMenu>
//                       </Dropdown>
//                     </CardBody>
//                   </Card>
//                 ))}
//               </div>
//             </ModalBody>
//           )}

//           <ModalFooter>
//             <Button variant='faded' onPress={onClose}>
//               {t('cancel')}
//             </Button>
//             <Button
//               className='text-secondary'
//               color='primary'
//               startContent={<PlusIcon />}
//               onPress={() => {
//                 onOpenVariantChange()
//                 onOpenVariantManagerChange()
//               }}
//             >
//               {t('addOption')}
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   )
// }
