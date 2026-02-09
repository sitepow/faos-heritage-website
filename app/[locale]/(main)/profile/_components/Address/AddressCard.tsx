// /* eslint-disable no-nested-ternary */
// 'use client'

// import {
//   Card,
//   CardHeader,
//   Button,
//   CardBody,
//   Skeleton,
//   Alert,
//   useDisclosure,
// } from '@heroui/react'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { PlusIcon } from 'lucide-react'
// import { useSession } from 'next-auth/react'
// import { useTranslations } from 'next-intl'
// import { useMemo } from 'react'

// import { AddressItem } from './AddressItem'

// import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
// import { deleteAddress } from '@/features/address/address.action'
// import { addressQueryKeys } from '@/features/address/address.query-key'
// import { useAddressStore } from '@/features/address/address.store'
// import { AddressForm } from '@/features/address/ui/AddressForm'
// import { useAddresses } from '@/features/address/useAddress'

// const AddressCard = () => {
//   const queryClient = useQueryClient()
//   const t = useTranslations('Account.Address')
//   const { onOpenAddressChange, setState, addressId } = useAddressStore()
//   const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
//     useDisclosure()

//   const userId = useSession()?.data?.user?.id
//   const { data: addresses, isLoading: isLoadingAddresses } =
//     useAddresses(userId)

//   const hasDefault = useMemo(
//     () => addresses.some((a) => a?.isDefault),
//     [addresses],
//   )
//   const isEmpty = !isLoadingAddresses && addresses.length === 0

//   const { mutate: performDelete, isPending: isDeleting } = useMutation({
//     mutationFn: deleteAddress,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: addressQueryKeys.list.all })
//       onOpenDeleteChange()
//       setState({ addressId: null })
//     },
//   })

//   const handleOpenForm = (id: string | null = null) => {
//     setState({ addressId: id })
//     onOpenAddressChange()
//   }

//   return (
//     <>
//       <ConfirmDeleteModal
//         isOpen={isDeleteOpen}
//         isPending={isDeleting}
//         onConfirm={() => performDelete(addressId)}
//         onOpenChange={onOpenDeleteChange}
//       />

//       <Card
//         fullWidth
//         className='border-default-100 border'
//         radius='sm'
//         shadow='none'
//       >
//         <CardHeader className='flex-wrap items-center justify-between gap-2'>
//           <span className='text-lg font-medium'>
//             {t('manageTitle')}
//           </span>
//           <Button
//             color='primary'
//             startContent={<PlusIcon size={18} />}
//             variant='bordered'
//             onPress={() => handleOpenForm()}
//           >
//             {t('addButton')}
//           </Button>
//         </CardHeader>

//         <CardBody className='gap-5'>
//           <AddressForm />

//           {isLoadingAddresses ? (
//             <div className='grid gap-2 sm:grid-cols-2'>
//               <Skeleton className='h-32 rounded-lg' />
//               <Skeleton className='h-32 rounded-lg' />
//             </div>
//           ) : isEmpty ? (
//             <Alert
//               color='warning'
//               description={t('noAddressAlert')}
//               variant='bordered'
//             />
//           ) : (
//             <>
//               {!hasDefault && (
//                 <Alert
//                   color='warning'
//                   description={t('noDefaultAlert')}
//                   variant='bordered'
//                 />
//               )}

//               <div className='grid gap-3 sm:grid-cols-2'>
//                 {addresses.map((address) => (
//                   <AddressItem
//                     key={address.id}
//                     address={address}
//                     onDelete={() => {
//                       setState({ addressId: address.id })
//                       onOpenDeleteChange()
//                     }}
//                     onEdit={() => handleOpenForm(address.id)}
//                   />
//                 ))}
//               </div>
//             </>
//           )}
//         </CardBody>
//       </Card>
//     </>
//   )
// }

// export { AddressCard }
