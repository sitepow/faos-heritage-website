'use client'

import { useQuery } from '@tanstack/react-query'

import { getOrderDashboard, getOrderSum } from './order/actions/order'
import { getProductDashboard } from './product/actions/product'
import { getUserDashboard } from './user/actions/user'

import {
  TrendCard,
  TrendCardSkeleton,
} from '@/app/(dashboard)/_components/trend-card'

const Index = () => {
  const QUERY = {
    ORDER_SUM: ['dashboard', 'orders', 'card', 'sum'],
    ORDER: ['dashboard', 'orders', 'card'],
    PRODUCT: ['dashboard', 'products', 'card'],
    USER: ['dashboard', 'users', 'card'],
  }

  const { data: orderSum, isLoading: isLoadingOrderSum } = useQuery({
    queryKey: QUERY.ORDER_SUM,
    queryFn: () => getOrderSum(),
  })

  const { data: order, isLoading: isLoadingOrder } = useQuery({
    queryKey: QUERY.ORDER,
    queryFn: () => getOrderDashboard(),
  })

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: QUERY.PRODUCT,
    queryFn: () => getProductDashboard(),
  })

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: QUERY.USER,
    queryFn: () => getUserDashboard(),
  })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {isLoadingOrderSum &&
          [...Array(4)].map((_) => <TrendCardSkeleton key={_} />)}

        {!isLoadingOrderSum &&
          orderSum?.map((data) => <TrendCard key={data.name} {...data} />)}

        {isLoadingOrder &&
          [...Array(4)].map((_) => <TrendCardSkeleton key={_} />)}

        {!isLoadingOrder &&
          order?.map((data) => <TrendCard key={data.name} {...data} />)}

        {isLoadingProduct &&
          [...Array(4)].map((_) => <TrendCardSkeleton key={_} />)}

        {!isLoadingOrderSum &&
          product?.map((data) => <TrendCard key={data.name} {...data} />)}

        {isLoadingUser &&
          [...Array(4)].map((_) => <TrendCardSkeleton key={_} />)}

        {!isLoadingUser &&
          user?.map((data) => <TrendCard key={data.name} {...data} />)}
      </div>
    </section>
  )
}

export default Index
