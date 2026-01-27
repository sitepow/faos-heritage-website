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
import { BoltIcon, EllipsisVerticalIcon, EyeIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { OrderViewModal } from './_components/view-modal'
import { getOrders, getOrderStat } from './action'
import { OrderForm } from './form'
import { useOrderStore } from './store'

import {
  StatCard,
  StatCardSkeleton,
} from '@/app/[locale]/(dashboard)/_components/stat-card'
import { useAppStore } from '@/app/store'
import { EXCHANGE_RATE_TTL, ITEM_PER_PAGE } from '@/constants/app'
import { NO_IMAGE } from '@/constants/seo'
import { getThbExchangeRates } from '@/utils/currency/exchange'
import { formatDate } from '@/utils/date'
import { formatCurrency } from '@/utils/number'
import { getOrderStatus } from '@/utils/order'

export default function Order() {
  const tOrder = useTranslations('Dashboard.Order')

  const { country, hasHydrated } = useAppStore()

  const { data: exchangeRates } = useQuery({
    queryKey: ['exchange-rates', 'THB'],
    queryFn: getThbExchangeRates,
    staleTime: EXCHANGE_RATE_TTL,
    gcTime: EXCHANGE_RATE_TTL * 2,
    enabled: hasHydrated,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const CURRENCY_OPTIONS = {
    currency: country?.currency,
    locale: country?.locale,
    rates: exchangeRates,
  }

  const [page, setPage] = useState(1)
  const { onOpenOrderChange, onOpenViewChange, setState } = useOrderStore()

  const QUERY_KEY = {
    DASHBOARD: ['dashboard', 'orders', 'card'],
    ORDERS: ['dashboard', 'orders', 'pagination', page],
  }

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: QUERY_KEY.ORDERS,
    queryFn: () => getOrders(page, ITEM_PER_PAGE),
  })

  const { data: dashboard, isLoading: isLoadingDashboard } = useQuery({
    queryKey: QUERY_KEY.DASHBOARD,
    queryFn: () => getOrderStat(),
  })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <OrderForm />
      <OrderViewModal />

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {isLoadingDashboard &&
          [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}

        {!isLoadingDashboard &&
          dashboard?.map((data) => (
            <StatCard key={data.name} {...data} name={data.name} />
          ))}
      </div>

      <Table
        className='border-divider rounded-lg border'
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
          <TableColumn>{tOrder('table.orderId')}</TableColumn>
          <TableColumn>{tOrder('table.image')}</TableColumn>
          <TableColumn>{tOrder('table.customerName')}</TableColumn>
          <TableColumn>{tOrder('table.orderDate')}</TableColumn>
          <TableColumn>{tOrder('table.totalAmount')}</TableColumn>
          <TableColumn>{tOrder('table.status')}</TableColumn>
          <TableColumn>{tOrder('table.trackingNumber')}</TableColumn>
          <TableColumn>{tOrder('table.actions')}</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={tOrder('table.empty')}
          isLoading={isLoadingOrders}
          loadingContent={<Spinner label={tOrder('table.loading')} />}
        >
          {(orders?.items ?? []).map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                <AvatarGroup max={3} isBordered>
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
              <TableCell className='min-w-32'>
                <Chip color='primary' variant='bordered'>
                  {formatCurrency(order?.total, CURRENCY_OPTIONS)}
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
                      startContent={<BoltIcon className='size-4' />}
                      onClick={() => {
                        setState({ orderId: order?.id })
                        onOpenOrderChange()
                      }}
                    >
                      {tOrder('action.status')}
                    </DropdownItem>
                    <DropdownItem
                      key='view'
                      startContent={<EyeIcon className='size-4' />}
                      onClick={() => {
                        setState({ orderId: order?.id })
                        onOpenViewChange()
                      }}
                    >
                      {tOrder('action.details')}
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
        classNames={{
          item: 'text-secondary',
        }}
        page={page}
        total={orders?.totalPages || 1}
        onChange={(page) => setPage(page)}
      />
    </section>
  )
}
