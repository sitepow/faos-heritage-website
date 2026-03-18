'use client'

import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import { EditIcon, EllipsisVerticalIcon, TrashIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { GetAddressResult } from '@/features/address/action'

import { formatFullAddress } from '@/utils'

interface Props {
  address: GetAddressResult
  onEdit: () => void
  onDelete: () => void
}

const AddressItem = ({ address, onEdit, onDelete }: Props) => {
  const t = useTranslations('address')
  const tActions = useTranslations('actions')

  return (
    <div className='group flex w-full flex-col'>
      <div className='border-default-100 bg-default-50/50 flex items-center justify-between gap-2 rounded-t-lg border p-3'>
        <div className='flex items-center gap-2 overflow-hidden'>
          <span className='truncate text-sm font-semibold'>
            {address?.name}
          </span>
          {address?.isDefault && (
            <Chip color='primary' radius='sm' size='sm' variant='flat'>
              {t('default')}
            </Chip>
          )}
        </div>

        <Dropdown placement='bottom-end'>
          <DropdownTrigger>
            <Button isIconOnly radius='full' size='sm' variant='light'>
              <EllipsisVerticalIcon className='text-default-500' />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label='Manage address' variant='flat'>
            <DropdownItem
              key='edit'
              startContent={<EditIcon />}
              onPress={onEdit}
            >
              {tActions('edit')}
            </DropdownItem>
            <DropdownItem
              key='delete'
              className='text-danger'
              color='danger'
              startContent={<TrashIcon />}
              onPress={onDelete}
            >
              {tActions('delete')}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className='border-default-100 flex flex-col gap-1 rounded-b-lg border-x border-b p-3 text-sm'>
        <p className='text-default-600 leading-relaxed'>
          {formatFullAddress(address)}
        </p>
      </div>
    </div>
  )
}

export { AddressItem }
