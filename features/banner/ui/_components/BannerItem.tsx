/* eslint-disable @next/next/no-img-element */
'use client'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import { EditIcon, EllipsisVerticalIcon, TrashIcon } from 'lucide-react'

import { cn } from '@/utils'

interface BannerItemProps {
  banner: {
    id: string
    url: string
    alt?: string | null
    isActive: boolean
  }
  onEdit: () => void
  onDelete: () => void
}

const BannerItem = ({ banner, onEdit, onDelete }: BannerItemProps) => {
  return (
    <div className='flex items-start gap-2'>
      <div className='flex w-full flex-col gap-1'>
        <img
          alt={banner.alt!}
          className={cn(
            'border-default-100 h-40 w-full rounded-md border object-cover',
            banner.isActive &&
              'border-primary border-y-divider border-r-divider border-l-4',
          )}
          src={banner.url}
        />

        <p className='text-tiny text-default-400 truncate'>{banner.id}</p>
      </div>

      <Dropdown placement='bottom-end'>
        <DropdownTrigger>
          <Button
            isIconOnly
            aria-label='Banner actions'
            size='sm'
            variant='light'
          >
            <EllipsisVerticalIcon className='text-default-500 size-5' />
          </Button>
        </DropdownTrigger>

        <DropdownMenu aria-label='Banner actions'>
          <DropdownItem
            key='edit'
            startContent={<EditIcon className='size-4' />}
            onClick={onEdit}
          >
            แก้ไข
          </DropdownItem>

          <DropdownItem
            key='delete'
            className='text-danger'
            color='danger'
            startContent={<TrashIcon className='size-4' />}
            onClick={onDelete}
          >
            ลบ
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export { BannerItem }
