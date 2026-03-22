'use client'

import { Alert, Button } from '@heroui/react'
import { EyeIcon, Edit3Icon, PlusIcon, InfoIcon } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { OrderDetailModal } from './_components/OrderDetailsModal'
import { OrderPOSModal } from './_components/OrderPOSModal'
import { OrderTable } from './_components/OrderTable'
import { OrderUpdateModal } from './_components/OrderUpdateModal'
import { TableConfigHeader } from '../products/_components/TableConfigHeader'

import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import {
  useOrders,
  useOrderStats,
  useRevenueStats,
} from '@/features/order/hook'
import { useOrderStore } from '@/features/order/store'

const OrderPage = () => {
  const [page, setPage] = useState(1)
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [isPOSOpen, setIsPOSOpen] = useState(false)

  const { setState } = useOrderStore()

  const { data: orderStats } = useOrderStats()
  const { data: revenueStats } = useRevenueStats()
  const { data, isLoading } = useOrders({ page, limit: 10 })

  const orderList = useMemo(() => {
    return data?.items ?? []
  }, [data])

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
      return setState({ orderId: id, isViewOpen: true })
    },
    [setState],
  )

  const handleUpdateStatus = useCallback(
    (id: string) => {
      return setState({ orderId: id, isOrderOpen: true })
    },
    [setState],
  )

  const getActionItems = useCallback(
    (id: string) => {
      return [
        {
          key: 'view',
          label: 'ดูรายละเอียด',
          icon: <EyeIcon size={18} />,
          onClick: () => {
            return handleViewDetails(id)
          },
        },
        {
          key: 'update',
          label: 'อัปเดตสถานะ',
          icon: <Edit3Icon size={18} />,
          onClick: () => {
            return handleUpdateStatus(id)
          },
        },
      ]
    },
    [handleViewDetails, handleUpdateStatus],
  )

  return (
    <Container className='flex flex-col gap-6'>
      <Alert
        description={
          <div className='text-default-600 mt-1 flex flex-col gap-2 text-sm'>
            <p>
              • <strong>การเลือกหน้าร้าน:</strong>{' '}
              กรุณาเลือกสาขาที่ถูกต้องก่อนยืนยันรายการ
              เพื่อระบบจะได้ทำการตัดสต็อกสินค้าในคลังของสาขานั้นๆ ได้อย่างแม่นยำ
            </p>
            <p>
              • <strong>การขายผ่านตัวแทน:</strong>{' '}
              หากรายการนี้เป็นการขายที่อ้างอิงจากตัวแทนจำหน่าย (Affiliate)
              โปรดเลือกชื่อตัวแทนในช่อง{' '}
              <span className='underline'>ระบุตัวแทนจำหน่าย</span>{' '}
              เพื่อให้ระบบคำนวณค่าคอมมิชชัน
            </p>
            <p>
              • <strong>การรับสินค้า:</strong> รายการที่สร้างผ่านระบบ POS นี้
              จะถือว่าเป็นรายการแบบ{' '}
              <span className='underline'>รับสินค้าที่หน้าร้าน (Pickup)</span>{' '}
              โดยอัตโนมัติ
            </p>
          </div>
        }
        icon={<InfoIcon />}
        title='คำแนะนำสำหรับการขายหน้าร้าน (POS)'
      />

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {allStats.map((stat) => {
          return (
            <StatCard key={stat.name} label={stat.name} value={stat.value} />
          )
        })}
      </div>

      <TableConfigHeader
        actionContent={
          <Button
            className='text-secondary'
            color='primary'
            startContent={<PlusIcon size={18} />}
            onPress={() => {
              return setIsPOSOpen(true)
            }}
          >
            สร้างคำสั่งซื้อใหม่ (POS)
          </Button>
        }
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
      <OrderPOSModal
        isOpen={isPOSOpen}
        onClose={() => {
          return setIsPOSOpen(false)
        }}
      />
    </Container>
  )
}

export default OrderPage
