/* eslint-disable no-nested-ternary */
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
  Pagination,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react'
import { PostStatus } from '@prisma/client'
import {
  EditIcon,
  Trash2Icon,
  EllipsisVerticalIcon,
  FileTextIcon,
  LanguagesIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { ProductImage } from '@/components/ui/Product/ProductImage'
import { IMAGE_FALLBACK } from '@/constants'
import { usePostsAdmin } from '@/features/post/post.hook'
import { usePostUIStore } from '@/features/post/post.store'

interface Props {
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  page: number
  onPageChange: (page: number) => void
  onDeleteClick: (id: string) => void
}

const PostTable = ({
  selectedKeys,
  onSelectionChange,
  page,
  onPageChange,
  onDeleteClick,
}: Props) => {
  const router = useRouter()
  const { openForm } = usePostUIStore()

  const { data: postsData, isLoading } = usePostsAdmin(page, 50)

  const postList = useMemo(() => {
    return postsData?.items ?? []
  }, [postsData])

  const totalPages = useMemo(() => {
    return postsData?.totalPages ?? 1
  }, [postsData])

  const statusColorMap: Record<PostStatus, 'default' | 'success' | 'warning'> =
    {
      [PostStatus.DRAFT]: 'warning',
      [PostStatus.PUBLISHED]: 'success',
      [PostStatus.ARCHIVED]: 'default',
    }

  return (
    <Table
      aria-label='ตารางบทความ'
      bottomContent={
        totalPages > 1 && (
          <div className='flex w-full justify-center'>
            <Pagination
              isCompact
              showControls
              color='primary'
              page={page}
              total={totalPages}
              onChange={onPageChange}
            />
          </div>
        )
      }
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
        <TableColumn>รหัสบทความ</TableColumn>
        <TableColumn>รูปภาพบทความ</TableColumn>
        <TableColumn>ชื่อบทความ</TableColumn>
        <TableColumn>หมวดหมู่</TableColumn>
        <TableColumn>ยอดเข้าชม</TableColumn>
        <TableColumn>สถานะ</TableColumn>
        <TableColumn align='center'>จัดการ</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent='ไม่พบบทความ'
        isLoading={isLoading}
        loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
      >
        {postList.map((post) => (
          <TableRow key={post.id}>
            <TableCell>
              <span className='text-default-500 font-mono text-xs font-bold'>
                #{post.id.slice(-8).toUpperCase()}
              </span>
            </TableCell>
            <TableCell>
              <ProductImage
                fill
                className='size-20'
                image={post?.featuredImage ?? IMAGE_FALLBACK.EMPTY}
              />
            </TableCell>
            <TableCell className='max-w-64 min-w-64'>
              {post?.title ?? '-'}
            </TableCell>
            <TableCell className='max-w-64 min-w-64'>
              {post.category?.name || '-'}
            </TableCell>
            <TableCell>{post.viewCount.toLocaleString()}</TableCell>
            <TableCell>
              <Chip
                color={statusColorMap[post.status as PostStatus]}
                size='sm'
                variant='dot'
              >
                {post.status === PostStatus.PUBLISHED
                  ? 'เผยแพร่แล้ว'
                  : post.status === PostStatus.DRAFT
                    ? 'ฉบับร่าง'
                    : 'เก็บถาวร'}
              </Chip>
            </TableCell>
            <TableCell>
              <div className='flex items-center justify-center gap-2'>
                <Dropdown placement='bottom-end'>
                  <DropdownTrigger>
                    <Button isIconOnly size='sm' variant='light'>
                      <EllipsisVerticalIcon
                        className='text-default-500'
                        size={20}
                      />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label='จัดการบทความ'>
                    <DropdownItem
                      key='edit'
                      startContent={<EditIcon size={16} />}
                      onPress={() => openForm(post.id)}
                    >
                      แก้ไขข้อมูลพื้นฐาน
                    </DropdownItem>

                    <DropdownItem
                      key='content'
                      startContent={<FileTextIcon size={16} />}
                      onPress={() =>
                        router.push(`/dashboard/posts/${post.id}/description`)
                      }
                    >
                      แก้ไขเนื้อหาบทความ
                    </DropdownItem>
                    <DropdownItem
                      key='locale'
                      startContent={<LanguagesIcon size={16} />}
                      onPress={() =>
                        router.push(`/dashboard/posts/${post.id}/localization`)
                      }
                    >
                      จัดการภาษา (Translation)
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-danger'
                      color='danger'
                      startContent={<Trash2Icon size={16} />}
                      onPress={() => onDeleteClick(post.id)}
                    >
                      ลบบทความ
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { PostTable }
