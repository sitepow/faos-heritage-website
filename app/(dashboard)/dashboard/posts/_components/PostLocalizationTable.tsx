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
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from '@heroui/react'
import { EllipsisVerticalIcon } from 'lucide-react'
import { useMemo } from 'react'

import type { Selection } from '@heroui/react'
import type { ReactNode } from 'react'

import { usePostLocales } from '@/features/post-localization/post-localization.hook'
import { useIsMounted } from '@/hooks/useIsMounted'

interface ActionItem {
  key: string
  label: string
  icon: ReactNode
  isDanger?: boolean
  onClick: () => void
}

interface Props {
  postId: string
  originalTitle: string
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  getActionItems: (id: string) => ActionItem[]
}

const PostLocalizationTable = ({
  postId,
  originalTitle,
  selectedKeys,
  onSelectionChange,
  getActionItems,
}: Props) => {
  const isMounted = useIsMounted()
  const { data: localizations, isLoading } = usePostLocales(postId)

  const localeList = useMemo(() => localizations || [], [localizations])

  if (!isMounted) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table
        aria-label='Post Localization Table'
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
          <TableColumn>รหัสแปลภาษา</TableColumn>
          <TableColumn>รหัสภาษา</TableColumn>
          <TableColumn>ชื่อบทความ (ต้นฉบับ)</TableColumn>
          <TableColumn>ชื่อบทความ (ที่แปลแล้ว)</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีข้อมูลการแปลภาษาสำหรับบทความนี้'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูลภาษา...' />}
        >
          {localeList.map((locale) => (
            <TableRow key={locale.id}>
              <TableCell>
                <span className='text-default-500 font-mono text-xs font-bold'>
                  #{locale.id.slice(-8).toUpperCase()}
                </span>
              </TableCell>
              <TableCell>
                <Chip
                  className='font-bold'
                  color='secondary'
                  size='sm'
                  variant='flat'
                >
                  {locale.languageCode.toUpperCase()}
                </Chip>
              </TableCell>
              <TableCell className='text-default-500'>
                {originalTitle}
              </TableCell>
              <TableCell className='text-primary font-medium'>
                {locale.title}
              </TableCell>
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
                  <DropdownMenu aria-label='จัดการภาษา' variant='flat'>
                    {getActionItems(locale.id).map((item) => (
                      <DropdownItem
                        key={item.key}
                        className={item.isDanger ? 'text-danger' : ''}
                        color={item.isDanger ? 'danger' : 'default'}
                        startContent={item.icon}
                        onPress={item.onClick}
                      >
                        {item.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { PostLocalizationTable }
