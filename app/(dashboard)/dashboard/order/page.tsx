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
import { ArchiveRestoreIcon, EllipsisVerticalIcon, EyeIcon } from 'lucide-react'
import { useState } from 'react'

import { OrderForm } from './_components/form/order'
import { OrderView } from './_components/view/order'
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
  const { onOpenOrderChange, onOpenViewChange, setState } = useOrderStore()

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
      <OrderView />

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {isLoadingDashboard &&
          [...Array(4)].map((_) => <TrendCardSkeleton key={_} />)}

        {!isLoadingDashboard &&
          dashboard?.map((data) => <TrendCard key={data.name} {...data} />)}
      </div>

      <Table aria-label='Order data table' selectionMode='multiple'>
        <TableHeader>
          <TableColumn>Order ID</TableColumn>
          <TableColumn>Image</TableColumn>
          <TableColumn>Customer Name</TableColumn>
          <TableColumn>Order Date</TableColumn>
          <TableColumn>Total Amount</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Tracking Number</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='There is no information to display'
          isLoading={isLoadingOrders}
          loadingContent={<Spinner label='Loading...' />}
        >
          {(orders?.items ?? []).map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                <AvatarGroup max={3}>
                  {order?.items?.map((item) => (
                    <Avatar
                      key={item?.product?.images?.[0]?.url}
                      src={item?.product?.images?.[0]?.url ?? '/no-image.png'}
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
                <Chip color='primary' variant='bordered'>
                  {getOrderStatus(order.status)}
                </Chip>
              </TableCell>
              <TableCell>
                {order?.trackingNumber ? (
                  <Chip color='primary' variant='bordered'>
                    {order?.trackingNumber}
                  </Chip>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className='flex gap-2.5'>
                <Dropdown placement='bottom-end'>
                  <DropdownTrigger>
                    <Button isIconOnly size='sm' variant='light'>
                      <EllipsisVerticalIcon className='size-5 text-default-500' />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label='Manage orders'
                    className='min-w-[180px]'
                  >
                    <DropdownItem
                      key='edit'
                      startContent={<ArchiveRestoreIcon className='size-4' />}
                      onClick={() => {
                        setState({ orderId: order?.id })
                        onOpenOrderChange()
                      }}
                    >
                      Order status
                    </DropdownItem>
                    <DropdownItem
                      key='view'
                      startContent={<EyeIcon className='size-4' />}
                      onClick={() => {
                        setState({ orderId: order?.id })
                        onOpenViewChange()
                      }}
                    >
                      See details
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
