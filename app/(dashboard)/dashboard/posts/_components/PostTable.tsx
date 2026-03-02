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
  User,
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
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { PostForm } from './PostForm'

import { usePostsAdmin } from '@/features/post/post.hook'
import { usePostMutation } from '@/features/post/post.mutation'
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
  const { isDeleting } = usePostMutation()

  const { data: postsData, isLoading } = usePostsAdmin(page, 50)

  const postList = useMemo(() => {
    return postsData?.success ? postsData.data.items : []
  }, [postsData])

  const totalPages = useMemo(() => {
    return postsData?.success ? postsData.data.totalPages : 1
  }, [postsData])

  const statusColorMap: Record<PostStatus, 'default' | 'success' | 'warning'> =
    {
      [PostStatus.DRAFT]: 'warning',
      [PostStatus.PUBLISHED]: 'success',
      [PostStatus.ARCHIVED]: 'default',
    }

  return (
    <div className='flex flex-col gap-4'>
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
        selectedKeys={selectedKeys}
        selectionMode='multiple'
        onSelectionChange={onSelectionChange}
      >
        <TableHeader>
          <TableColumn>บทความ</TableColumn>
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
                <User
                  avatarProps={{
                    src: post.featuredImage || '',
                    radius: 'sm',
                  }}
                  description={post.slug}
                  name={post.title}
                />
              </TableCell>
              <TableCell>{post.category?.name || '-'}</TableCell>
              <TableCell>{post.viewCount.toLocaleString()}</TableCell>
              <TableCell>
                <Chip
                  color={statusColorMap[post.status as PostStatus]}
                  size='sm'
                  variant='flat'
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

      <PostForm />
    </div>
  )
}

export { PostTable }
