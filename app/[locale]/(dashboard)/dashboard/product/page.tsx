// 'use client'

// import {
//   useDisclosure,
//   Table,
//   Button,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   Spinner,
//   TableRow,
//   TableCell,
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownItem,
//   Chip,
//   AvatarGroup,
//   Avatar,
//   Pagination,
// } from '@heroui/react'
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import {
//   EditIcon,
//   EllipsisVerticalIcon,
//   FileIcon,
//   ImageIcon,
//   LanguagesIcon,
//   LayoutIcon,
//   PlusIcon,
//   SettingsIcon,
//   TrashIcon,
//   XIcon,
// } from 'lucide-react'
// import { useLocale, useTranslations } from 'next-intl'
// import { useState } from 'react'

// import { useProductStore } from './store'
// import { CategoryManager } from '../../../../../features/category/ui/CategoryManager'
// import { ProductForm } from '../../../../../features/product/ui/ProductForm'
// import { ImageManager } from '../../../../../features/product-image/ui/ProductImageManager'
// import { ProductLocalizationManager } from '../../../../../features/product-locale/ui/ProductLocaleManager'
// import { VariantManager } from '../../../../../features/product-variant/ui/ProductVariantManager'
// import { ShippingCountryManager } from '../../../../../features/shipping/ui/ShippingManager'

// import { useAppStore } from '@/app/store'
// import { ConfirmModal } from '@/components/ui/ConfirmModal'
// import { StatCard, StatCardSkeleton } from '@/components/ui/StatCard'
// import { EXCHANGE_RATE_TTL, ITEM_PER_PAGE } from '@/constants/app'
// import {
//   deleteProduct,
//   getProductStat,
//   getProducts,
// } from '@/features/product/product.action'
// import { getThbExchangeRates } from '@/utils/currency/exchange'
// import {
//   formatCurrency,
//   formatCurrencyRange,
//   formatNumber,
//   formatNumberRange,
// } from '@/utils/number'
// import { getRangeDisplayValue } from '@/utils/range'

// export default function Product() {
//   const locale = useLocale()
//   const t = useTranslations('Dashboard.ProductManager')
//   const tc = useTranslations('Common')
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
//     setState,
//     onOpenCategoryManagerChange,
//     onOpenProductChange,
//     onOpenImageManagerChange,
//     onOpenVariantManagerChange,
//     onOpenShippingCountryManagerChange,
//     onOpenProductLocalizationManagerChange,
//   } = useProductStore()

//   const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]))
//   const selectedProductIds = Array.from(selectedKeys)
//   const [page, setPage] = useState(1)

//   const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
//     useDisclosure()

//   const QUERY_KEY = {
//     DASHBOARD: ['dashboard', 'products', 'card'],
//     PRODUCTS: ['dashboard', 'products', 'pagination', page, locale],
//   }

//   const { data: products, isLoading: isLoadingProducts } = useQuery({
//     queryKey: QUERY_KEY.PRODUCTS,
//     queryFn: () => getProducts(page, ITEM_PER_PAGE, locale),
//   })

//   const { data: dashboard, isLoading: isLoadingDashboard } = useQuery({
//     queryKey: QUERY_KEY.DASHBOARD,
//     queryFn: () => getProductStat(),
//   })

//   const onRefetch = async () => {
//     await Promise.all([
//       queryClient.invalidateQueries({ queryKey: QUERY_KEY.DASHBOARD }),
//       queryClient.invalidateQueries({ queryKey: QUERY_KEY.PRODUCTS }),
//     ])
//   }

//   const { mutate: mutateDeteleProduct, isPending: isPendingDeteleProduct } =
//     useMutation({
//       mutationFn: deleteProduct,
//       onSuccess: () => {
//         onRefetch()
//         onOpenDeleteChange()
//         setState({ productId: null })
//         setSelectedKeys(new Set([]))
//       },
//     })

//   return (
//     <section className='flex flex-col items-center justify-center gap-4 text-center'>
//       <ConfirmModal
//         isOpen={isDeleteOpen}
//         isPending={isPendingDeteleProduct}
//         onConfirm={() => {
//           mutateDeteleProduct(productId ? productId : selectedProductIds)
//         }}
//         onOpenChange={onOpenDeleteChange}
//       />
//       <ProductForm />
//       <ImageManager />
//       <VariantManager />
//       <CategoryManager />
//       <ShippingCountryManager />
//       <ProductLocalizationManager />

//       <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
//         {isLoadingDashboard &&
//           [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}

//         {!isLoadingDashboard &&
//           dashboard?.map((data) => (
//             <StatCard key={data.name} {...data} name={data.name} />
//           ))}
//       </div>

//       <div className='flex w-full flex-wrap gap-3 *:shrink-0 md:justify-end'>
//         <Button
//           color='primary'
//           startContent={<PlusIcon />}
//           variant='bordered'
//           onPress={() => onOpenProductChange()}
//         >
//           {t('addNew')}
//         </Button>
//         <Button
//           color='primary'
//           startContent={<SettingsIcon />}
//           variant='bordered'
//           onPress={() => onOpenCategoryManagerChange()}
//         >
//           {t('manageCategories')}
//         </Button>
//         <Button
//           color='primary'
//           startContent={<SettingsIcon />}
//           variant='bordered'
//           onPress={() => onOpenShippingCountryManagerChange()}
//         >
//           {t('manageShipping')}
//         </Button>
//         <Button
//           color='primary'
//           isDisabled={selectedProductIds.length === 0}
//           startContent={<XIcon />}
//           variant='bordered'
//           onPress={() => {
//             setState({ productId: null })
//             onOpenDeleteChange()
//           }}
//         >
//           {t('deleteSelected', { count: selectedProductIds.length })}
//         </Button>
//       </div>

//       <Table
//         aria-label={t('tableAria')}
//         checkboxesProps={{
//           classNames: {
//             base: 'data-[selected=true]:border-primary',
//             icon: 'text-secondary',
//           },
//         }}
//         className='border-default-100 rounded-lg border'
//         selectionMode='multiple'
//         onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
//       >
//         <TableHeader>
//           <TableColumn>{t('colId')}</TableColumn>
//           <TableColumn>{t('colDigital')}</TableColumn>
//           <TableColumn>{t('colImage')}</TableColumn>
//           <TableColumn>{t('colName')}</TableColumn>
//           <TableColumn>{t('colPrice')}</TableColumn>
//           <TableColumn>{t('colStock')}</TableColumn>
//           <TableColumn>{t('colCategory')}</TableColumn>
//           <TableColumn>{t('colActions')}</TableColumn>
//         </TableHeader>

//         <TableBody
//           emptyContent={t('empty')}
//           isLoading={isLoadingProducts}
//           loadingContent={<Spinner label={tc('loading')} />}
//         >
//           {(products?.items ?? []).map((product) => {
//             const price = getRangeDisplayValue(
//               {
//                 min: product?.priceMin,
//                 max: product?.priceMax,
//                 fallback: product?.price ?? 0,
//               },
//               {
//                 formatSingle: (value) =>
//                   formatCurrency(value, CURRENCY_OPTIONS),
//                 formatRange: (min, max) =>
//                   formatCurrencyRange(min, max, CURRENCY_OPTIONS),
//               },
//             )

//             const stock = getRangeDisplayValue(
//               {
//                 min: product?.stockMin,
//                 max: product?.stockMax,
//                 fallback: product?.stockQuantity,
//               },
//               {
//                 formatSingle: formatNumber,
//                 formatRange: formatNumberRange,
//               },
//             )

//             return (
//               <TableRow key={product.id}>
//                 <TableCell>{product.id}</TableCell>
//                 <TableCell>
//                   {product?.isDigitalProduct ? (
//                     <Chip
//                       color='primary'
//                       startContent={
//                         <FileIcon className='text-primary size-4' />
//                       }
//                       variant='bordered'
//                     >
//                       {t('digitalProduct')}
//                     </Chip>
//                   ) : (
//                     '-'
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   {product?.images?.length === 0 ? (
//                     '-'
//                   ) : (
//                     <AvatarGroup isBordered max={3}>
//                       {product?.images?.map((image) => (
//                         <Avatar key={image?.url} src={image?.url} />
//                       ))}
//                     </AvatarGroup>
//                   )}
//                 </TableCell>
//                 <TableCell className='max-w-72 min-w-72'>
//                   {product?.name ?? '-'}
//                 </TableCell>
//                 <TableCell className='min-w-32'>
//                   {price !== formatCurrency(0, CURRENCY_OPTIONS) ? (
//                     <Chip color='primary' variant='bordered'>
//                       {price}
//                     </Chip>
//                   ) : (
//                     '-'
//                   )}
//                 </TableCell>
//                 <TableCell className='min-w-32'>
//                   {stock !== formatNumber(0) ? (
//                     <Chip color='primary' variant='bordered'>
//                       {stock}
//                     </Chip>
//                   ) : (
//                     '-'
//                   )}
//                 </TableCell>
//                 <TableCell className='max-w-52'>
//                   {product?.category?.name ? (
//                     <Chip color='primary' variant='bordered'>
//                       {product?.category?.name}
//                     </Chip>
//                   ) : (
//                     '-'
//                   )}
//                 </TableCell>
//                 <TableCell className='flex gap-2.5'>
//                   <Dropdown placement='bottom-end'>
//                     <DropdownTrigger>
//                       <Button isIconOnly size='sm' variant='light'>
//                         <EllipsisVerticalIcon className='text-default-500 size-5' />
//                       </Button>
//                     </DropdownTrigger>
//                     <DropdownMenu
//                       aria-label={t('dropdownAria')}
//                       className='min-w-[180px]'
//                     >
//                       <DropdownItem
//                         key='edit'
//                         startContent={<EditIcon className='size-4' />}
//                         onClick={() => {
//                           setState({ productId: product?.id })
//                           onOpenProductChange()
//                         }}
//                       >
//                         {t('editInfo')}
//                       </DropdownItem>
//                       <DropdownItem
//                         key='image'
//                         startContent={<ImageIcon className='size-4' />}
//                         onClick={() => {
//                           setState({ productId: product?.id })
//                           onOpenImageManagerChange()
//                         }}
//                       >
//                         {t('manageImages')}
//                       </DropdownItem>
//                       <DropdownItem
//                         key='variant'
//                         startContent={<LayoutIcon className='size-4' />}
//                         onClick={() => {
//                           setState({ productId: product?.id })
//                           onOpenVariantManagerChange()
//                         }}
//                       >
//                         {t('manageOptions')}
//                       </DropdownItem>
//                       <DropdownItem
//                         key='product-localization'
//                         startContent={<LanguagesIcon className='size-4' />}
//                         onClick={() => {
//                           setState({ productId: product?.id })
//                           onOpenProductLocalizationManagerChange()
//                         }}
//                       >
//                         {t('manageNameLocalization')}
//                       </DropdownItem>
//                       <DropdownItem
//                         key='delete'
//                         className='text-danger'
//                         color='danger'
//                         startContent={<TrashIcon className='size-4' />}
//                         onClick={() => {
//                           setState({ productId: product?.id })
//                           onOpenDeleteChange()
//                         }}
//                       >
//                         {t('removeProduct')}
//                       </DropdownItem>
//                     </DropdownMenu>
//                   </Dropdown>
//                 </TableCell>
//               </TableRow>
//             )
//           })}
//         </TableBody>
//       </Table>

//       <Pagination
//         showControls
//         classNames={{
//           item: 'text-secondary',
//         }}
//         page={page}
//         total={products?.totalPages || 1}
//         onChange={(page) => setPage(page)}
//       />
//     </section>
//   )
// }
