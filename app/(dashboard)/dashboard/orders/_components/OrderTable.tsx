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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from '@heroui/react'
import { EllipsisVerticalIcon } from 'lucide-react'

import type { getOrders } from '@/features/order/action'
import type { Selection } from '@heroui/react'
import type { OrderStatus } from '@prisma/client'
import type { ReactNode } from 'react'

import { PaginationWrapper } from '@/components/ui/PaginationWrapper'
import { IMAGE_FALLBACK } from '@/constants'
import { useIsMounted } from '@/hooks/useIsMounted'
import {
  formatCurrency,
  formatDate,
  ORDER_STATUS_COLOR_MAP,
  ORDER_STATUS_TH_MAP,
} from '@/utils'

type OrderItemType = Awaited<ReturnType<typeof getOrders>>['items'][number]

interface ActionItem {
  key: string
  label: string
  icon: ReactNode
  onClick: () => void
}

interface Props {
  orderList: OrderItemType[]
  isLoading: boolean
  page: number
  total: number
  selectedKeys: Selection
  onPageChange: (page: number) => void
  onSelectionChange: (keys: Selection) => void
  getActionItems: (id: string) => ActionItem[]
}

const OrderTable = ({
  orderList,
  isLoading,
  page,
  total,
  selectedKeys,
  onPageChange,
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
        aria-label='ตารางคำสั่งซื้อ'
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
          <TableColumn>คำสั่งซื้อ</TableColumn>
          <TableColumn>ลูกค้า</TableColumn>
          <TableColumn>ยอดรวม (Base)</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn>วันที่สั่งซื้อ</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ไม่พบรายการคำสั่งซื้อ'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูลออเดอร์...' />}
        >
          {orderList.map((order) => {
            const actionItems = getActionItems(order.id)
            return (
              <TableRow key={order.id}>
                <TableCell>
                  <span className='text-default-500 font-mono text-xs font-bold'>
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className='max-w-64 min-w-64'>
                  <User
                    avatarProps={{
                      src: order?.user?.image || IMAGE_FALLBACK.EMPTY,
                    }}
                    description={
                      <div className='flex flex-col gap-2'>
                        <span>{order?.user?.email ?? '-'}</span>
                        <span>{order?.shippingPhone ?? '-'}</span>
                      </div>
                    }
                    name={order.user?.name || 'ลูกค้าทั่วไป'}
                  />
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(order.total), {
                    currency: order.currency,
                    skipCalculation: true,
                  })}
                </TableCell>
                <TableCell>
                  <Chip
                    className='font-bold'
                    color={ORDER_STATUS_COLOR_MAP[order.status as OrderStatus]}
                    size='sm'
                    variant='dot'
                  >
                    {ORDER_STATUS_TH_MAP[order.status as OrderStatus]}
                  </Chip>
                </TableCell>
                <TableCell className='text-default-500 text-small max-w-64 min-w-64'>
                  {formatDate(order.createdAt)}
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
                    <DropdownMenu aria-label='Order Actions' variant='flat'>
                      {actionItems.map((item) => (
                        <DropdownItem
                          key={item.key}
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

      <PaginationWrapper page={page} total={total} onChange={onPageChange} />
    </div>
  )
}

export { OrderTable }
