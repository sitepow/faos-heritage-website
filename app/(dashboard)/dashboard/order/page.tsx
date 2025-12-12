'use client'

import { Avatar, AvatarGroup } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown'
import { Pagination } from '@heroui/pagination'
import { Spinner } from '@heroui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table'
import { useQuery } from '@tanstack/react-query'
import { EllipsisVerticalIcon } from 'lucide-react'
import { useState } from 'react'

import { OrderForm } from './_components/form/order'
import { getOrderDashboard, getOrders } from './actions/order'
import { useOrderStore } from './store'

import {
  TrendCard,
  TrendCardSkeleton,
} from '@/app/(dashboard)/_components/trend-card'
import { formatDate } from '@/utils/date'
import { getOrderStatus } from '@/utils/helper'
import { formatCurrency } from '@/utils/number'

const ITEM_PER_PAGE = 8

const Order = () => {
  const [page, setPage] = useState(1)
  const { onOpenOrderChange, setState } = useOrderStore()

  const QUERY = {
    DASHBOARD: ['dashboard', 'orders', 'card'],
    ORDERS: ['dashboard', 'orders', 'pagination', page],
  }

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: QUERY.ORDERS,
    queryFn: () => getOrders(page, ITEM_PER_PAGE),
  })

  const { data: dashboard, isLoading: isLoadingDashboard } = useQuery({
    queryKey: QUERY.DASHBOARD,
    queryFn: () => getOrderDashboard(),
  })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <OrderForm />

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {isLoadingDashboard &&
          [...Array(4)].map((_) => <TrendCardSkeleton key={_} />)}

        {!isLoadingDashboard &&
          dashboard?.map((data) => <TrendCard key={data.name} {...data} />)}
      </div>

      <Table aria-label='ตารางข้อมูลคำสั่งซื้อ' selectionMode='multiple'>
        <TableHeader>
          <TableColumn>รหัสคำสั่งซื้อ</TableColumn>
          <TableColumn>รูปภาพ</TableColumn>
          <TableColumn>ชื่อลูกค้า</TableColumn>
          <TableColumn>วันที่สั่งซื้อ</TableColumn>
          <TableColumn>ยอดรวม</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ไม่มีข้อมูลที่จะแสดง'
          isLoading={isLoadingOrders}
          loadingContent={<Spinner label='กำลังโหลด...' />}
        >
          {(orders?.items ?? []).map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                <AvatarGroup max={3}>
                  {order?.items?.map((item) => (
                    <Avatar
                      key={item?.product?.images?.[0]?.url}
                      src={
                        item?.product?.images?.[0]?.url ?? '/placeholder.svg'
                      }
                    />
                  ))}
                </AvatarGroup>
              </TableCell>
              <TableCell className='max-w-52 min-w-52'>
                {order?.user?.name ?? '-'}
              </TableCell>
              <TableCell className='max-w-52 min-w-52'>
                {formatDate(order?.createdAt)}
              </TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>
                <Chip variant='bordered'>{getOrderStatus(order.status)}</Chip>
              </TableCell>
              <TableCell className='flex gap-2.5'>
                <Dropdown placement='bottom-end'>
                  <DropdownTrigger>
                    <Button isIconOnly size='sm' variant='light'>
                      <EllipsisVerticalIcon className='size-5 text-default-500' />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label='จัดการคำสั่งซื้อ'
                    className='min-w-[180px]'
                  >
                    <DropdownItem
                      key='edit'
                      onClick={() => {
                        setState({ orderId: order?.id })
                        onOpenOrderChange()
                      }}
                    >
                      แก้ไขข้อมูล
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        showControls
        page={page}
        total={orders?.totalPages || 1}
        onChange={(page) => setPage(page)}
      />
    </section>
  )
}

export default Order
