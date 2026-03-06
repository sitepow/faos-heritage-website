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

import { useBlogCategoryLocales } from '@/features/blog-category-localization/blog-category-localization.hook'
import { useIsMounted } from '@/hooks/useIsMounted'

interface ActionItem {
  key: string
  label: string
  icon: ReactNode
  isDanger?: boolean
  onClick: () => void
}

interface Props {
  blogCategoryId: string
  originalName: string
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  getActionItems: (id: string) => ActionItem[]
}

const BlogCategoryLocalizationTable = ({
  blogCategoryId,
  originalName,
  selectedKeys,
  onSelectionChange,
  getActionItems,
}: Props) => {
  const isMounted = useIsMounted()
  const { data: localizations, isLoading } =
    useBlogCategoryLocales(blogCategoryId)

  const localeList = useMemo(() => localizations || [], [localizations])

  if (!isMounted) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table
        aria-label='Blog Category Localization Table'
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
          <TableColumn>ชื่อหมวดหมู่บทความ (ต้นฉบับ)</TableColumn>
          <TableColumn>ชื่อที่แปลแล้ว</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีข้อมูลการแปลสำหรับหมวดหมู่นี้'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูลภาษา...' />}
        >
          {localeList.map((locale) => {
            const actionItems = getActionItems(locale.id)
            return (
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
                <TableCell className='text-default-500 max-w-40 min-w-40'>
                  {originalName}
                </TableCell>
                <TableCell className='text-primary max-w-40 min-w-40 font-medium'>
                  {locale.name}
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
                    <DropdownMenu aria-label='จัดการการแปล' variant='flat'>
                      {actionItems.map((item) => (
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
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export { BlogCategoryLocalizationTable }
