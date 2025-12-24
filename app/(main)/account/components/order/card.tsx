'use client'

import { Card, CardHeader, CardBody, Skeleton, Pagination } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { OrderItem } from './item'

import { getOrders } from '@/app/(dashboard)/dashboard/order'
import { OrderViewModal } from '@/app/(dashboard)/dashboard/order/components/view-modal'
import { OrderForm } from '@/app/(main)/account/components/order/form'
import { ITEM_PER_PAGE } from '@/utils/constants'

export const OrderCard = () => {
  const [page, setPage] = useState(1)

  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY = {
    ORDERS: ['account', 'orders', 'pagination', userId, page],
  }

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: QUERY.ORDERS,
    queryFn: () => getOrders(page, ITEM_PER_PAGE, userId),
  })

  const ordersLength = orders?.items?.length

  return (
    <div>
      <OrderViewModal />
      <OrderForm />

      <Card fullWidth>
        <CardHeader>
          <span>My Orders</span>
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
                You do not have any orders yet.
                <br />
                <Link className='underline' href='/products'>
                  Explore all products.
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
            className='mx-auto my-2.5 text-white'
            page={page}
            total={orders?.totalPages || 1}
            onChange={(page) => setPage(page)}
          />
        )}
      </Card>
    </div>
  )
}
