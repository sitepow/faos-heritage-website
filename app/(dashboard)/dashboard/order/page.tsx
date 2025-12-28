'use client'

import {
  TableHeader,
  TableColumn,
  TableBody,
  Spinner,
  TableRow,
  TableCell,
  AvatarGroup,
  Avatar,
  Chip,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Table,
} from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { ArchiveRestoreIcon, EllipsisVerticalIcon, EyeIcon } from 'lucide-react'
import { useState } from 'react'

import { getOrders, getOrderStat } from './action'
import { OrderViewModal } from './components/view-modal'
import { useOrderStore } from './store'
import { OrderForm } from '../product/components/form/order'

import {
  StatCard,
  StatCardSkeleton,
} from '@/app/(dashboard)/components/stat-card'
import { ITEM_PER_PAGE, NO_IMAGE } from '@/utils/constants'
import { formatDate } from '@/utils/date'
import { getOrderStatus } from '@/utils/features'
import { formatCurrency } from '@/utils/number'

export default function Order() {
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
    queryFn: () => getOrderStat(),
  })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <OrderForm />
      <OrderViewModal />

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {isLoadingDashboard &&
          [...Array(4)].map((_) => <StatCardSkeleton key={_} />)}

        {!isLoadingDashboard &&
          dashboard?.map((data) => <StatCard key={data.name} {...data} />)}
      </div>

      <Table
        aria-label='Order data table'
        selectionMode='multiple'
        checkboxesProps={{
          classNames: {
            base: 'data-[selected=true]:border-primary',
            icon: 'text-secondary',
          },
        }}
      >
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
                      src={item?.product?.images?.[0]?.url ?? NO_IMAGE}
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
              <TableCell>
                <Chip color='primary' variant='bordered'>
                  {formatCurrency(order?.total?.toNumber())}
                </Chip>
              </TableCell>
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
                      <EllipsisVerticalIcon className='text-default-500 size-5' />
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
        className='text-secondary'
        page={page}
        total={orders?.totalPages || 1}
        onChange={(page) => setPage(page)}
      />
    </section>
  )
}
