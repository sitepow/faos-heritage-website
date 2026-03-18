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
import {
  EditIcon,
  EllipsisVerticalIcon,
  LanguagesIcon,
  TrashIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { GetBlogCategoriesResult } from '@/features/blog-category/action'
import type { Selection } from '@heroui/react'

import { useIsMounted } from '@/hooks/useIsMounted'

type BlogCategoryItem = NonNullable<GetBlogCategoriesResult['data']>[number]

interface Props {
  categoryList: BlogCategoryItem[]
  isLoading: boolean
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  onDeleteClick: (id: string) => void
  onEditClick: (id: string) => void
}

const BlogCategoryTable = ({
  categoryList,
  isLoading,
  selectedKeys,
  onSelectionChange,
  onDeleteClick,
  onEditClick,
}: Props) => {
  const router = useRouter()
  const isMounted = useIsMounted()

  if (!isMounted) {
    return null
  }

  return (
    <Table
      aria-label='Blog Category Table'
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
        <TableColumn>หมวดหมู่บทความ</TableColumn>
        <TableColumn>URL Slug</TableColumn>
        <TableColumn>จำนวนโพสต์</TableColumn>
        <TableColumn>สถานะ</TableColumn>
        <TableColumn align='center'>จัดการ</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent='ไม่พบข้อมูลหมวดหมู่บทความ'
        isLoading={isLoading}
        loadingContent={<Spinner label='กำลังโหลด...' />}
      >
        {categoryList.map((cat) => (
          <TableRow key={cat?.id!}>
            <TableCell>
              <span className='text-default-500 font-mono text-xs font-bold'>
                #{cat?.id.slice(-8).toUpperCase()}
              </span>
            </TableCell>
            <TableCell className='max-w-40 min-w-40 font-medium'>
              {cat?.name!}
            </TableCell>
            <TableCell className='text-default-500 max-w-40 min-w-40'>
              {cat?.slug!}
            </TableCell>
            <TableCell>
              <Chip
                className='font-bold'
                color='secondary'
                size='sm'
                variant='flat'
              >
                {cat?._count?.posts || 0} โพสต์
              </Chip>
            </TableCell>
            <TableCell>
              <Chip
                color={cat?.isActive ? 'success' : 'danger'}
                size='sm'
                variant='dot'
              >
                {cat?.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
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
                <DropdownMenu aria-label='Blog Category Actions' variant='flat'>
                  <DropdownItem
                    key='edit'
                    startContent={<EditIcon size={16} />}
                    onPress={() => onEditClick(cat?.id!)}
                  >
                    แก้ไขข้อมูล
                  </DropdownItem>
                  <DropdownItem
                    key='locale'
                    startContent={<LanguagesIcon size={16} />}
                    onPress={() =>
                      router.push(
                        `/dashboard/blog-categories/${cat?.id!}/localization`,
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
                    onPress={() => onDeleteClick(cat?.id!)}
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

export { BlogCategoryTable }
