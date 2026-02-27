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
  User as HeroUser,
} from '@heroui/react'
import { ReviewStatus } from '@prisma/client'
import { CheckIcon, XIcon, EllipsisVerticalIcon, StarIcon } from 'lucide-react'

import { useReviewsAdmin } from '@/features/review/review.hook'
import { useReviewMutation } from '@/features/review/review.mutation'

const ReviewTable = () => {
  const { data, isLoading } = useReviewsAdmin()
  const { moderate } = useReviewMutation()

  const reviews = data && 'items' in data ? data.items : []

  return (
    <Table
      aria-label='Review management table'
      className='border-default-100 rounded-lg border'
    >
      <TableHeader>
        <TableColumn>ผู้รีวิว / สินค้า</TableColumn>
        <TableColumn>คะแนน</TableColumn>
        <TableColumn width={300}>ความคิดเห็น</TableColumn>
        <TableColumn>สถานะ</TableColumn>
        <TableColumn align='center'>จัดการ</TableColumn>
      </TableHeader>
      <TableBody emptyContent='ยังไม่มีการรีวิวสินค้า' isLoading={isLoading}>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell>
              <HeroUser
                avatarProps={{ src: review?.user?.image! || '' }}
                description={review.product.name}
                name={review.user.name}
              />
            </TableCell>
            <TableCell>
              <div className='text-warning flex items-center gap-1'>
                <StarIcon fill='currentColor' size={14} />
                <span className='text-small font-bold'>{review.rating}</span>
              </div>
            </TableCell>
            <TableCell className='text-default-600 text-small italic'>
              {review.comment ? `"${review.comment}"` : '-'}
            </TableCell>
            <TableCell>
              <Chip
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
                {review.status}
              </Chip>
            </TableCell>
            <TableCell>
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size='sm' variant='light'>
                    <EllipsisVerticalIcon size={18} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label='Manage Review'>
                  <DropdownItem
                    key='approve'
                    startContent={
                      <CheckIcon className='text-success' size={16} />
                    }
                    onPress={() =>
                      moderate({
                        id: review.id,
                        status: ReviewStatus.APPROVED,
                        comment: review?.comment!,
                      })
                    }
                  >
                    อนุมัติ
                  </DropdownItem>
                  <DropdownItem
                    key='reject'
                    className='text-danger'
                    color='danger'
                    startContent={<XIcon size={16} />}
                    onPress={() =>
                      moderate({
                        id: review.id,
                        status: ReviewStatus.REJECTED,
                        comment: review?.comment!,
                      })
                    }
                  >
                    ไม่อนุมัติ
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

export { ReviewTable }
