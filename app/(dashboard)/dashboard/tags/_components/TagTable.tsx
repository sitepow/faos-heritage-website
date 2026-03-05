/* eslint-disable no-unused-vars */
'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from '@heroui/react'
import {
  EditIcon,
  EllipsisVerticalIcon,
  LanguagesIcon,
  TrashIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { useTags } from '@/features/tag/tag.hook'
import { useTagUIStore } from '@/features/tag/tag.store'
import { useIsMounted } from '@/hooks/useIsMounted'

interface Props {
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  onDeleteClick: (id: string) => void
}

const TagTable = ({
  selectedKeys,
  onSelectionChange,
  onDeleteClick,
}: Props) => {
  const isMounted = useIsMounted()
  const { openForm } = useTagUIStore()
  const { data: tags, isLoading } = useTags()
  const router = useRouter()

  const tagList = useMemo(() => (Array.isArray(tags) ? tags : []), [tags])

  if (!isMounted) {
    return null
  }

  return (
    <Table
      aria-label='Tag Admin Table'
      checkboxesProps={{
        classNames: {
          wrapper: 'after:bg-primary before:border-default-300',
          icon: 'text-white font-bold',
        },
      }}
      selectedKeys={selectedKeys}
      selectionMode='multiple'
      onSelectionChange={onSelectionChange}
    >
      <TableHeader>
        <TableColumn>รหัสแท็ก</TableColumn>
        <TableColumn>ชื่อแท็ก</TableColumn>
        <TableColumn>Slug</TableColumn>
        <TableColumn align='center'>จัดการ</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent='ไม่พบข้อมูลแท็ก'
        isLoading={isLoading}
        loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
      >
        {tagList.map((tag) => (
          <TableRow key={tag?.id!}>
            <TableCell>
              <span className='text-default-500 font-mono text-xs font-bold'>
                #{tag?.id?.slice(-8).toUpperCase()}
              </span>
            </TableCell>
            <TableCell className='min-w-40 font-medium'>{tag?.name!}</TableCell>
            <TableCell className='min-w-40'>{tag?.slug!}</TableCell>
            <TableCell>
              <Dropdown placement='bottom-end'>
                <DropdownTrigger>
                  <Button isIconOnly size='sm' variant='light'>
                    <EllipsisVerticalIcon
                      className='text-default-500'
                      size={20}
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label='จัดการแท็ก' variant='flat'>
                  <DropdownItem
                    key='edit'
                    startContent={<EditIcon size={16} />}
                    onPress={() => openForm(tag?.id!)}
                  >
                    แก้ไข
                  </DropdownItem>
                  <DropdownItem
                    key='locale'
                    startContent={<LanguagesIcon size={16} />}
                    onPress={() =>
                      router.push(`/dashboard/tags/${tag?.id!}/localization`)
                    }
                  >
                    จัดการภาษา (Translation)
                  </DropdownItem>
                  <DropdownItem
                    key='delete'
                    className='text-danger'
                    color='danger'
                    startContent={<TrashIcon size={16} />}
                    onPress={() => onDeleteClick(tag?.id!)}
                  >
                    ลบแท็ก
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { TagTable }
