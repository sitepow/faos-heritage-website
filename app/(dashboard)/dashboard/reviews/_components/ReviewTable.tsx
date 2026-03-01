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

import type { Selection } from '@heroui/react'
import type { ReactNode } from 'react'

import { useIsMounted } from '@/hooks/useIsMounted'

interface ActionItem {
  key: string
  label: string
  icon: ReactNode
  isDanger?: boolean
  onClick: () => void
}

interface Props {
  reviewList: any[]
  isLoading: boolean
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  getActionItems: (review: any) => ActionItem[]
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
          <TableColumn>ผู้รีวิว / สินค้า</TableColumn>
          <TableColumn>คะแนน</TableColumn>
          <TableColumn width={300}>ความคิดเห็น</TableColumn>
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
                  <HeroUser
                    avatarProps={{ src: review?.user?.image || '', size: 'sm' }}
                    description={review.product.name}
                    name={review.user.name}
                  />
                </TableCell>
                <TableCell>
                  <div className='text-warning flex items-center gap-1'>
                    <StarIcon fill='currentColor' size={14} />
                    <span className='text-small font-bold'>
                      {review.rating}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='text-default-600 text-small italic'>
                  {review.comment ? `"${review.comment}"` : '-'}
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
                    {review.status}
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
