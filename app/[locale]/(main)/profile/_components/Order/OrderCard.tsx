'use client'

import { CardBody } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { ProfileHeader } from '../ProfileHeader'
import { OrderItem } from './OrderItem'

import { BorderedCard } from '@/components/ui/BorderedCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { PaginationWrapper } from '@/components/ui/PaginationWrapper'
import { PAGINATION } from '@/constants'
import { useOrders } from '@/features/order/useOrder'
import { useAuth } from '@/hooks/useAuth'

const OrderCard = () => {
  const t = useTranslations('profile')
  const tOrders = useTranslations('orders')
  const [page, setPage] = useState(1)

  const { userId } = useAuth()

  const { data: orders, isLoading } = useOrders({
    page,
    limit: PAGINATION.ITEMS_PER_PAGE,
    userId,
  })

  const orderItems = orders?.items ?? []
  const totalPages = orders?.totalPages ?? 0
  const hasItems = orderItems.length > 0
  const isEmpty = !isLoading && !hasItems
  const showPagination = !isLoading && totalPages > 1

  const renderContent = () => {
    if (isEmpty) {
      return (
        <CardBody>
          <EmptyState description={tOrders('empty')} />
        </CardBody>
      )
    }

    return (
      <CardBody className='gap-5'>
        {orderItems.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </CardBody>
    )
  }

  return (
    <BorderedCard>
      <ProfileHeader>
        <b>{t('tabs.orders')}</b>
      </ProfileHeader>
      {renderContent()}
      {showPagination && (
        <PaginationWrapper page={page} total={totalPages} onChange={setPage} />
      )}
    </BorderedCard>
  )
}

export { OrderCard }
