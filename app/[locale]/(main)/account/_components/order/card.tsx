'use client'

import { Card, CardHeader, CardBody, Skeleton, Pagination } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { OrderItem } from './item'

import { getOrders } from '@/app/[locale]/(dashboard)/dashboard/order'
import { OrderViewModal } from '@/app/[locale]/(dashboard)/dashboard/order/_components/view-modal'
import { OrderForm } from '@/app/[locale]/(main)/account/_components/order/form'
import { ITEM_PER_PAGE } from '@/utils/constants'

export const OrderCard = () => {
  const t = useTranslations('Account.Orders')
  const [page, setPage] = useState(1)

  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY_KEY = {
    ORDERS: ['account', 'orders', 'pagination', userId, page],
  }

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: QUERY_KEY.ORDERS,
    queryFn: () => getOrders(page, ITEM_PER_PAGE, userId),
  })

  const ordersLength = orders?.items?.length

  return (
    <div>
      <OrderViewModal />
      <OrderForm />

      <Card fullWidth>
        <CardHeader>
          <span>{t('title')}</span>
        </CardHeader>
        {isLoadingOrders && (
          <CardBody>
            <Skeleton className='h-20 w-full rounded-lg' />
          </CardBody>
        )}

        {!isLoadingOrders && ordersLength === 0 && (
          <CardBody>
            <div className='text-default-500 flex flex-col items-center gap-2'>
              <AlertCircleIcon />
              <span className='text-center'>
                {t('emptyState')}
                <br />
                <Link className='underline' href='/products'>
                  {t('exploreLink')}
                </Link>
              </span>
            </div>
          </CardBody>
        )}

        {!isLoadingOrders && ordersLength !== 0 && (
          <CardBody className='gap-4'>
            {orders?.items?.map((order) => (
              <OrderItem key={order?.id} order={order} />
            ))}
          </CardBody>
        )}

        {!isLoadingOrders && ordersLength !== 0 && (
          <Pagination
            showControls
            classNames={{
              item: 'text-secondary',
            }}
            className='mx-auto my-2.5'
            page={page}
            total={orders?.totalPages || 1}
            onChange={(page) => setPage(page)}
          />
        )}
      </Card>
    </div>
  )
}
