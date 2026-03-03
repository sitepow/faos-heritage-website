'use client'

import { EyeIcon, Edit3Icon } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { OrderDetailModal } from './_components/OrderDetailModal'
import { OrderTable } from './_components/OrderTable'
import { OrderUpdateModal } from './_components/OrderUpdateModal'
import { TableConfigHeader } from '../products/_components/TableConfigHeader'

import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import {
  useOrders,
  useOrderStats,
  useRevenueStats,
} from '@/features/order/order.hook'
import { useOrderStore } from '@/features/order/order.store'

const OrderPage = () => {
  const [page, setPage] = useState(1)
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

  const { setState } = useOrderStore()

  const { data: orderStats } = useOrderStats()
  const { data: revenueStats } = useRevenueStats()
  const { data, isLoading } = useOrders({ page, limit: 10 })

  const orderList = useMemo(() => data?.items ?? [], [data])

  const allStats = useMemo(() => {
    return [...(orderStats || []), ...(revenueStats || [])]
  }, [orderStats, revenueStats])

  const selectedCount = useMemo(() => {
    if (selectedKeys === 'all') {
      return orderList.length
    }
    return selectedKeys.size
  }, [selectedKeys, orderList])

  const handleViewDetails = useCallback(
    (id: string) => {
      setState({ orderId: id, isViewOpen: true })
    },
    [setState],
  )

  const handleUpdateStatus = useCallback(
    (id: string) => {
      setState({ orderId: id, isOrderOpen: true })
    },
    [setState],
  )

  const getActionItems = useCallback(
    (id: string) => [
      {
        key: 'view',
        label: 'ดูรายละเอียด',
        icon: <EyeIcon size={18} />,
        onClick: () => handleViewDetails(id),
      },
      {
        key: 'update',
        label: 'อัปเดตสถานะ',
        icon: <Edit3Icon size={18} />,
        onClick: () => handleUpdateStatus(id),
      },
    ],
    [handleViewDetails, handleUpdateStatus],
  )

  return (
    <Container className='flex flex-col gap-6'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
        {allStats.map((stat) => (
          <StatCard key={stat.name} label={stat.name} value={stat.value} />
        ))}
      </div>

      <TableConfigHeader
        actionContent={null}
        selectedCount={selectedCount}
        title='จัดการคำสั่งซื้อ'
        onDeleteSelected={() => {}}
      />

      <OrderTable
        getActionItems={getActionItems}
        isLoading={isLoading}
        orderList={orderList}
        page={page}
        selectedKeys={selectedKeys}
        total={data?.totalPages || 1}
        onPageChange={setPage}
        onSelectionChange={setSelectedKeys}
      />

      <OrderUpdateModal />
      <OrderDetailModal />
    </Container>
  )
}

export default OrderPage
