/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
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
  User as HeroUser,
} from '@heroui/react'
import { EllipsisVerticalIcon, StarIcon } from 'lucide-react'

import type { getAllReviewsAdmin } from '@/features/review/review.action'
import type { Selection } from '@heroui/react'
import type { ReactNode } from 'react'

import { useIsMounted } from '@/hooks/useIsMounted'

type ReviewItemType = Awaited<
  ReturnType<typeof getAllReviewsAdmin>
>['items'][number]

interface ActionItem {
  key: string
  label: string
  icon: ReactNode
  isDanger?: boolean
  onClick: () => void
}

interface Props {
  reviewList: ReviewItemType[]
  isLoading: boolean
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  getActionItems: (review: ReviewItemType) => ActionItem[]
}

const ReviewTable = ({
  reviewList,
  isLoading,
  selectedKeys,
  onSelectionChange,
  getActionItems,
}: Props) => {
  const isMounted = useIsMounted()

  if (!isMounted) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table
        aria-label='Review management table'
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
          <TableColumn>รหัสรีวิว</TableColumn>
          <TableColumn>ผู้รีวิว / สินค้า</TableColumn>
          <TableColumn>คะแนน</TableColumn>
          <TableColumn width={350}>ความคิดเห็น</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีการรีวิวสินค้า'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูลรีวิว...' />}
        >
          {reviewList.map((review) => {
            const actionItems = getActionItems(review)
            return (
              <TableRow key={review.id}>
                <TableCell>
                  <span className='text-default-500 font-mono text-xs font-bold'>
                    #{review.id.slice(-8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className='max-w-96 min-w-96'>
                  <HeroUser
                    avatarProps={{
                      src: review?.user?.image || '',
                      className: 'shrink-0',
                    }}
                    description={
                      <span className='text-primary text-tiny font-medium'>
                        สินค้า: {review.product.name}
                      </span>
                    }
                    name={review.user.name || 'ผู้ใช้งาน'}
                  />
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <div className='text-warning flex items-center'>
                      <StarIcon fill='currentColor' size={14} />
                    </div>
                    <span className='text-small font-bold'>
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex flex-col gap-1'>
                    <p className='text-default-600 text-small leading-relaxed italic'>
                      {review.comment ? `"${review.comment}"` : '-'}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    className='font-bold'
                    color={
                      review.status === 'APPROVED'
                        ? 'success'
                        : review.status === 'REJECTED'
                          ? 'danger'
                          : 'warning'
                    }
                    size='sm'
                    variant='flat'
                  >
                    {review.status === 'APPROVED'
                      ? 'อนุมัติแล้ว'
                      : review.status === 'REJECTED'
                        ? 'ปฏิเสธ'
                        : 'รอตรวจสอบ'}
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
                    <DropdownMenu aria-label='Manage Review' variant='flat'>
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

export { ReviewTable }
