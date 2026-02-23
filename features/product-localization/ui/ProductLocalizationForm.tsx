// 'use client'

// import {
//   Button,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   Select,
//   Spinner,
//   Input,
//   SelectItem,
// } from '@heroui/react'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { useTranslations } from 'next-intl'
// import { useEffect, useState } from 'react'
// import { Controller, useForm } from 'react-hook-form'

// import {
//   createProductLocalization,
//   getProductLocalization,
//   updateProductLocalization,
// } from '../../action/product-localization'
// import {
//   productLocalizationSchema,
//   type ProductLocalizationInput,
// } from '../../schema/product-localization'
// import { useProductStore } from '../../store'

// import { CountryFlag } from '@/components/ui/CountryFlagAvatar'
// import { MdEditorCustomize } from '@/components/ui/MdEditorCustomize'
// import { COUNTRY } from '@/constants/country'

// const DEFAULT_VALUES: ProductLocalizationInput = {
//   productId: '',
//   languageCode: '',
//   name: '',
//   shortDescription: '',
//   description: '',
//   metaTitle: '',
//   metaDescription: '',
// }

// export const ProductLocalizationForm = () => {
//   const t = useTranslations('Dashboard.ProductForm')
//   const tCountry = useTranslations('Country')

//   const [editorShortDescKey, setEditorShortDescKey] = useState(0)
//   const [editorFullDescKey, setEditorFullDescKey] = useState(0)

//   const {
//     productId,
//     productLocalizationId,
//     isProductLocalizationOpen,
//     onOpenProductLocalizationChange,
//     onOpenProductLocalizationManagerChange,
//     setState,
//   } = useProductStore()

//   const queryClient = useQueryClient()

//   const QUERY_KEY = {
//     PRODUCT_LOCALIZATION: ['product-localization', productLocalizationId],
//     PRODUCT_LOCALIZATIONS: ['product-localizations', productId],
//   }

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { isDirty },
//   } = useForm<ProductLocalizationInput>({
//     resolver: zodResolver(productLocalizationSchema),
//     defaultValues: DEFAULT_VALUES,
//   })

//   const { data, isLoading } = useQuery({
//     queryKey: QUERY_KEY.PRODUCT_LOCALIZATION,
//     queryFn: () => getProductLocalization(productLocalizationId!),
//     enabled: !!productLocalizationId && isProductLocalizationOpen,
//   })

//   useEffect(() => {
//     if (!isProductLocalizationOpen) return

//     if (productLocalizationId && data) {
//       reset(data)
//     } else {
//       reset({
//         ...DEFAULT_VALUES,
//         productId: productId!,
//       })
//     }

//     setEditorShortDescKey((k) => k + 1)
//     setEditorFullDescKey((k) => k + 1)
//   }, [data, productLocalizationId, productId, isProductLocalizationOpen, reset])

//   const onRefetch = async () => {
//     await queryClient.invalidateQueries({
//       queryKey: QUERY_KEY.PRODUCT_LOCALIZATIONS,
//     })
//   }

//   const { mutate: createMutate, isPending: isCreating } = useMutation({
//     mutationFn: createProductLocalization,
//     onSuccess: () => {
//       onRefetch()
//       onClose()
//     },
//   })

//   const { mutate: updateMutate, isPending: isUpdating } = useMutation({
//     mutationFn: updateProductLocalization,
//     onSuccess: () => {
//       onRefetch()
//       onClose()
//     },
//   })

//   const isPending = isLoading || isCreating || isUpdating

//   const onSubmit = (form: ProductLocalizationInput) => {
//     if (productLocalizationId) {
//       updateMutate(form)
//     } else {
//       createMutate(form)
//     }
//   }

//   const onClose = async () => {
//     reset(DEFAULT_VALUES)
//     setState({ productLocalizationId: null })
//     await queryClient.invalidateQueries({
//       queryKey: QUERY_KEY.PRODUCT_LOCALIZATION,
//     })
//     onOpenProductLocalizationChange()
//     onOpenProductLocalizationManagerChange()
//   }

//   return (
//     <Modal
//       isDismissable={false}
//       isOpen={isProductLocalizationOpen}
//       scrollBehavior='inside'
//       size='4xl'
//       onOpenChange={onOpenProductLocalizationChange}
//     >
//       <ModalContent>
//         <ModalHeader>
//           {productLocalizationId
//             ? 'แก้ไขรายละเอียดสินค้า'
//             : 'เพิ่มรายละเอียดสินค้าใหม่'}
//         </ModalHeader>

//         {isPending && <Spinner label='Loading...' />}

//         {!isPending && (
//           <ModalBody className='gap-4'>
//             <Controller
//               control={control}
//               name='languageCode'
//               render={({ field }) => (
//                 <Select
//                   disallowEmptySelection
//                   label='ประเทศ'
//                   renderValue={(items) =>
//                     items.map((item) => {
//                       const selected = COUNTRY.find(
//                         (currency) => currency.code === item.key,
//                       )

//                       if (!selected) {
//                         return null
//                       }

//                       return (
//                         <span key={item.key}>{tCountry(selected.code)}</span>
//                       )
//                     })
//                   }
//                   selectedKeys={field.value ? [field.value] : []}
//                   variant='bordered'
//                   onSelectionChange={(keys) =>
//                     field.onChange(Array.from(keys)[0])
//                   }
//                 >
//                   {COUNTRY.map((c) => (
//                     <SelectItem key={c.code} textValue={c.name}>
//                       <div className='flex items-center gap-2'>
//                         <CountryFlag countryCode={c.code} />
//                         <span>{tCountry(c.code)}</span>
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </Select>
//               )}
//             />

//             <Controller
//               control={control}
//               name='name'
//               render={({ field }) => (
//                 <Input {...field} label='ชื่อสินค้า' variant='bordered' />
//               )}
//             />

//             <Controller
//               control={control}
//               name='shortDescription'
//               render={({ field: { value, ...field } }) => (
//                 <MdEditorCustomize
//                   key={editorShortDescKey}
//                   className='col-span-1 sm:col-span-2'
//                   placeholder={t('fields.shortDesc')}
//                   {...field}
//                   value={value ?? ''}
//                 />
//               )}
//             />

//             <Controller
//               control={control}
//               name='description'
//               render={({ field: { value, ...field } }) => (
//                 <MdEditorCustomize
//                   key={editorFullDescKey}
//                   className='col-span-1 sm:col-span-2'
//                   placeholder={t('fields.fullDesc')}
//                   {...field}
//                   value={value ?? ''}
//                 />
//               )}
//             />

//             {/* <Controller
//               control={control}
//               name='description'
//               render={({ field: { value, ...field } }) => (
//                 <Textarea
//                   {...field}
//                   value={value ?? ''}
//                   variant='bordered'
//                   label='รายละเอียดสินค้า (ฉบับเต็ม)'
//                 />
//               )}
//             /> */}

//             {/* <Controller
//               control={control}
//               name='metaTitle'
//               render={({ field: { value, ...field } }) => (
//                 <Input
//                   {...field}
//                   value={value ?? ''}
//                   variant='bordered'
//                   label='Meta Title'
//                 />
//               )}
//             />

//             <Controller
//               control={control}
//               name='metaDescription'
//               render={({ field: { value, ...field } }) => (
//                 <Textarea
//                   {...field}
//                   value={value ?? ''}
//                   variant='bordered'
//                   label='Meta Description'
//                 />
//               )}
//             /> */}
//           </ModalBody>
//         )}

//         <ModalFooter>
//           <Button variant='faded' onPress={onClose}>
//             Cancel
//           </Button>
//           <Button
//             className='text-secondary'
//             color='primary'
//             isDisabled={!isDirty || isPending}
//             onClick={handleSubmit(onSubmit)}
//           >
//             Save
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   )
// }
