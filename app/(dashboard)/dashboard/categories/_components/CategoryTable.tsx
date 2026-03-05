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
  Chip,
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

import { ProductImage } from '@/components/ui/Product/ProductImage'
import { IMAGE_FALLBACK } from '@/constants'
import { useCategoriesAdmin } from '@/features/category/category.hook'
import { useCategoryUIStore } from '@/features/category/category.store'
import { useIsMounted } from '@/hooks/useIsMounted'

interface Props {
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  onDeleteClick: (id: string) => void
}

const CategoryTable = ({
  selectedKeys,
  onSelectionChange,
  onDeleteClick,
}: Props) => {
  const isMounted = useIsMounted()
  const router = useRouter()
  const { openForm } = useCategoryUIStore()

  const { data: categories, isLoading } = useCategoriesAdmin()

  const categoryList = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories],
  )

  if (!isMounted) {
    return null
  }

  return (
    <Table
      aria-label='Category Admin Table'
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
        <TableColumn>รหัสหมวดหมู่</TableColumn>
        <TableColumn>รูปภาพหมวดหมู่</TableColumn>
        <TableColumn>ชื่อหมวดหมู่</TableColumn>
        <TableColumn>URL Slug</TableColumn>
        <TableColumn>จำนวนสินค้า</TableColumn>
        <TableColumn>สถานะ</TableColumn>
        <TableColumn align='center'>จัดการ</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent='ไม่พบข้อมูลหมวดหมู่'
        isLoading={isLoading}
        loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
      >
        {categoryList.map((cat) => (
          <TableRow key={cat.id}>
            <TableCell>
              <span className='text-default-500 font-mono text-xs font-bold'>
                #{cat.id.slice(-8).toUpperCase()}
              </span>
            </TableCell>
            <TableCell>
              <ProductImage
                fill
                className='size-20'
                image={cat?.image ?? IMAGE_FALLBACK.EMPTY}
              />
            </TableCell>
            <TableCell className='min-w-40 font-medium'>{cat.name}</TableCell>
            <TableCell className='min-w-40'>{cat.slug}</TableCell>
            <TableCell>
              <Chip color='secondary' size='sm' variant='dot'>
                {cat._count?.products || 0} รายการ
              </Chip>
            </TableCell>
            <TableCell>
              <Chip
                color={cat.isActive ? 'success' : 'danger'}
                size='sm'
                variant='dot'
              >
                {cat.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
              </Chip>
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
                <DropdownMenu aria-label='จัดการหมวดหมู่' variant='flat'>
                  <DropdownItem
                    key='edit'
                    startContent={<EditIcon size={16} />}
                    onPress={() => openForm(cat.id)}
                  >
                    แก้ไขข้อมูล
                  </DropdownItem>
                  <DropdownItem
                    key='locale'
                    startContent={<LanguagesIcon size={16} />}
                    onPress={() =>
                      router.push(
                        `/dashboard/categories/${cat.id}/localization`,
                      )
                    }
                  >
                    จัดการภาษา (Translation)
                  </DropdownItem>
                  <DropdownItem
                    key='delete'
                    className='text-danger'
                    color='danger'
                    startContent={<TrashIcon size={16} />}
                    onPress={() => onDeleteClick(cat.id)}
                  >
                    ลบหมวดหมู่
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

export { CategoryTable }
