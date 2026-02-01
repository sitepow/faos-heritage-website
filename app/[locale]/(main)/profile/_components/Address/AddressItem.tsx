// 'use client'

// import {
//   Button,
//   Chip,
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownTrigger,
// } from '@heroui/react'
// import { EditIcon, EllipsisVerticalIcon, TrashIcon } from 'lucide-react'
// import { useTranslations } from 'next-intl'

// import type { Address } from '@prisma/client'

// import { CountryFlagAvatar } from '@/components/ui/CountryFlagAvatar'
// import { formatFullAddress } from '@/utils/commo n'

// type AddressDisplayProps = Omit<Address, 'createdAt' | 'updatedAt'>

// interface AddressItemProps {
//   address: AddressDisplayProps
//   onEdit: () => void
//   onDelete: () => void
// }

// const AddressItem = ({ address, onEdit, onDelete }: AddressItemProps) => {
//   const translate = useTranslations('Account.Address')

//   return (
//     <div className='group flex w-full flex-col'>
//       <div className='border-divider bg-default-50/50 flex items-center justify-between gap-2 rounded-t-lg border p-3'>
//         <div className='flex items-center gap-2 overflow-hidden'>
//           <CountryFlagAvatar countryCode={address.countryCode} />
//           <span className='truncate text-sm font-semibold'>
//             {address?.name}
//           </span>
//           {address?.isDefault && (
//             <Chip color='primary' radius='sm' size='sm' variant='flat'>
//               {translate('defaultTag')}
//             </Chip>
//           )}
//         </div>

//         <Dropdown placement='bottom-end'>
//           <DropdownTrigger>
//             <Button isIconOnly radius='full' size='sm' variant='light'>
//               <EllipsisVerticalIcon className='text-default-500 size-4' />
//             </Button>
//           </DropdownTrigger>
//           <DropdownMenu aria-label='Manage address' variant='flat'>
//             <DropdownItem
//               key='edit'
//               startContent={<EditIcon className='size-4' />}
//               onPress={onEdit}
//             >
//               {translate('editAddress')}
//             </DropdownItem>
//             <DropdownItem
//               key='delete'
//               className='text-danger'
//               color='danger'
//               startContent={<TrashIcon className='size-4' />}
//               onPress={onDelete}
//             >
//               {translate('removeAddress')}
//             </DropdownItem>
//           </DropdownMenu>
//         </Dropdown>
//       </div>

//       <div className='border-divider flex flex-col gap-1 rounded-b-lg border-x border-b p-3 text-sm'>
//         <p className='text-default-600 leading-relaxed'>
//           {formatFullAddress(address)}
//         </p>
//         <p className='text-default-400 text-xs italic'>{address.phone}</p>
//       </div>
//     </div>
//   )
// }

// export { AddressItem }
