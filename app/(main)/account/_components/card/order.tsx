import { Card, CardBody, CardHeader } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import { useInfiniteQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { Order } from '../order'

import { getOrders, type GetOrdersResult } from '@/actions/order'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const ITEM_PER_PAGE = 8

const OrderCard = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const ORDER_QUERY_KEY = ['account', 'orders', userId]

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<GetOrdersResult>({
      queryKey: ORDER_QUERY_KEY,
      initialPageParam: null,
      queryFn: ({ pageParam }) =>
        getOrders({
          userId: userId!,
          cursor: pageParam as string | null,
          limit: ITEM_PER_PAGE,
        }),
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      enabled: !!userId,
    })

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 300,
  })

  const items = data?.pages?.flatMap((page) => page.items) ?? []
  const ordersTotal = items?.length

  return (
    <Card fullWidth>
      <CardHeader>
        <span>รายการคำสั่งซื้อของฉัน</span>
      </CardHeader>
      {isLoading && (
        <CardBody>
          <Skeleton className='h-20 w-full rounded-lg' />
        </CardBody>
      )}

      {!isLoading && ordersTotal === 0 && (
        <CardBody>
          <div className='flex flex-col items-center gap-2 text-default-500'>
            <AlertCircleIcon />
            <span className='text-center'>
              คุณยังไม่มีคำสั่งซื้อสินค้า
              <br />
              <Link className='underline' href='/products'>
                สำรวจสินค้าทั้งหมด
              </Link>
            </span>
          </div>
        </CardBody>
      )}

      {!isLoading && ordersTotal !== 0 && (
        <CardBody className='gap-4'>
          {items?.map((order) => (
            <Order key={order?.id} order={order} />
          ))}
        </CardBody>
      )}
    </Card>
  )
}

export { OrderCard }
