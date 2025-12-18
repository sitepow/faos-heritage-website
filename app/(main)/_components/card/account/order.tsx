import { Card, CardBody, CardHeader } from '@heroui/card'
import { Pagination } from '@heroui/pagination'
import { Skeleton } from '@heroui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { OrderView } from '@/app/(dashboard)/_components/view/order'
import { getOrders } from '@/app/(dashboard)/actions/order'
import { OrderItem } from '@/app/(main)/_components/card/account/item/order'
import { OrderForm } from '@/app/(main)/_components/form/order'
import { ITEM_PER_PAGE } from '@/utils/const'

const OrderCard = () => {
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
      <OrderView />
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
            <div className='flex flex-col items-center gap-2 text-default-500'>
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

export { OrderCard }
