'use client'

import { Alert } from '@heroui/alert'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { CustomerItem } from '../_components/customer-item'
import { ProductItem } from '../_components/product-item'
import { getOrderSum, getOrdersWithoutPagination } from '../actions/order'

import {
  TrendCard,
  TrendCardSkeleton,
} from '@/app/(dashboard)/_components/chart/trend-card'
import { SubHeader } from '@/app/(main)/_components/section/header'
import { Order } from '@/app/(main)/account/_components/order'

const ITEM_PER_PAGE = 4

const Index = () => {
  const router = useRouter()

  const { data: dashboard, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ['dashboard', 'orders', 'sum'],
    queryFn: () => getOrderSum(),
  })

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['dashboard', 'orders', 'recap'],
    queryFn: () => getOrdersWithoutPagination(ITEM_PER_PAGE),
  })

  const goToOrder = () => {
    router.push('/dashboard/order')
  }
  const goToCustomer = () => {
    router.push('/dashboard/user')
  }
  const goToProduct = () => {
    router.push('/dashboard/product')
  }

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {isLoadingDashboard &&
          [...Array(4)].map((_, index) => <TrendCardSkeleton key={index} />)}

        {!isLoadingDashboard &&
          dashboard?.map((data) => <TrendCard key={data.name} {...data} />)}
      </div>

      <div className='grid w-full gap-5 lg:grid-cols-2'>
        <Card className='sm:col-span-2'>
          <CardHeader className='flex-wrap items-center justify-between'>
            <SubHeader title='ออเดอร์ใหม่' />
            <Button variant='faded' onClick={goToOrder}>
              ดูทั้งหมด
            </Button>
          </CardHeader>

          {isLoadingDashboard && (
            <CardBody>
              <Skeleton className='h-24 w-full rounded-lg' />
            </CardBody>
          )}

          {!isLoadingOrders && !orders && (
            <CardBody>
              <Alert
                description='คุณยังไม่มีคำสั่งซื้อจากลูกค้า'
                variant='bordered'
              />
            </CardBody>
          )}

          {!isLoadingOrders && orders && (
            <CardBody className='grid gap-4 lg:grid-cols-2'>
              {orders?.map((order) => (
                <Order key={order?.id} hideButton order={order} />
              ))}
            </CardBody>
          )}
        </Card>

        <Card>
          <CardHeader className='flex-wrap items-center justify-between'>
            <SubHeader title='ลูกค้าใหม่' />
            <Button variant='faded' onClick={goToCustomer}>
              ดูทั้งหมด
            </Button>
          </CardHeader>
          <CardBody>
            <CustomerItem />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className='flex-wrap items-center justify-between'>
            <SubHeader title='สินค้าขายดี' />
            <Button variant='faded' onClick={goToProduct}>
              ดูทั้งหมด
            </Button>
          </CardHeader>
          <CardBody>
            <ProductItem />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className='flex-wrap items-center justify-between'>
            <SubHeader title='สต็อกกำลังหมด' />
            <Button variant='faded' onClick={goToProduct}>
              ดูทั้งหมด
            </Button>
          </CardHeader>
          <CardBody>
            <ProductItem />
          </CardBody>
        </Card>
      </div>
    </section>
  )
}

export default Index
