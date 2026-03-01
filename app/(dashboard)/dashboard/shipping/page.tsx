'use client'

import { useDisclosure, Button } from '@heroui/react'
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { ShippingTable } from './_components/ShippingTable'
import { TableConfigHeader } from '../products/_components/TableConfigHeader'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import {
  useShippingCountriesAdmin,
  useShippingStatAdmin,
} from '@/features/shipping/shipping.hook'
import { useShippingMutation } from '@/features/shipping/shipping.mutation'
import { useShippingUIStore } from '@/features/shipping/shipping.store'
import { ShippingForm } from '@/features/shipping/ui/ShippingForm'

const ShippingPage = () => {
  const { openForm } = useShippingUIStore()
  const { remove, isDeleting } = useShippingMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetId, setTargetId] = useState<string | string[] | null>(null)

  const { data: stats } = useShippingStatAdmin()
  const { data: countries, isLoading } = useShippingCountriesAdmin()

  const shippingList = useMemo(() => {
    return countries || []
  }, [countries])

  const statsData = useMemo(() => {
    return Array.isArray(stats) ? stats : []
  }, [stats])

  const selectedCount = useMemo(() => {
    if (selectedKeys === 'all') {
      return shippingList.length
    }
    return selectedKeys.size
  }, [selectedKeys, shippingList])

  const selectedShippingIds = useMemo(() => {
    if (selectedKeys === 'all') {
      return shippingList.map((item) => item.id)
    }
    return Array.from(selectedKeys) as string[]
  }, [selectedKeys, shippingList])

  const handleDeleteTrigger = useCallback(
    (id: string | string[]) => {
      setTargetId(id)
      onOpen()
    },
    [onOpen],
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!targetId) {
      return
    }

    if (Array.isArray(targetId)) {
      await Promise.all(targetId.map((id) => remove(id)))
    } else {
      await remove(targetId)
    }

    setTargetId(null)
    setSelectedKeys(new Set([]))
    onOpenChange()
  }, [targetId, remove, onOpenChange])

  const getActionItems = useCallback(
    (id: string) => [
      {
        key: 'edit',
        label: 'แก้ไขเรทค่าส่ง',
        icon: <EditIcon size={16} />,
        onClick: () => openForm(id),
      },
      {
        key: 'delete',
        label: 'ลบข้อมูล',
        icon: <TrashIcon size={16} />,
        isDanger: true,
        onClick: () => handleDeleteTrigger(id),
      },
    ],
    [openForm, handleDeleteTrigger],
  )

  return (
    <Container className='flex flex-col gap-6'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {statsData.map((stat) => (
          <StatCard key={stat.name} label={stat.name} value={stat.value} />
        ))}
      </div>

      <TableConfigHeader
        actionContent={
          <Button
            className='text-secondary font-bold'
            color='primary'
            startContent={<PlusIcon size={18} />}
            onPress={() => openForm()}
          >
            เพิ่มประเทศ/เรทค่าส่ง
          </Button>
        }
        selectedCount={selectedCount}
        title='จัดการค่าจัดส่งรายประเทศ'
        onDeleteSelected={() => handleDeleteTrigger(selectedShippingIds)}
      />

      <ShippingTable
        getActionItems={getActionItems}
        isLoading={isLoading}
        selectedKeys={selectedKeys}
        shippingList={shippingList}
        onSelectionChange={setSelectedKeys}
      />

      <ShippingForm />

      <ConfirmDeleteModal
        description='การลบข้อมูลนี้จะส่งผลให้ลูกค้าในประเทศดังกล่าวไม่สามารถสั่งซื้อสินค้าได้ชั่วคราว คุณแน่ใจหรือไม่?'
        isOpen={isOpen}
        isPending={isDeleting}
        title='ยืนยันการลบค่าจัดส่ง'
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default ShippingPage
