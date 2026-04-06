'use client'

import { useDisclosure, Button, Alert } from '@heroui/react'
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  InfoIcon,
  LayoutGridIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useCallback, useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { StorefrontTable } from './_components/StorefrontTable'
import { TableConfigHeader } from '../products/_components/TableConfigHeader'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useStorefronts } from '@/features/storefront/hook'
import { useStorefrontMutation } from '@/features/storefront/mutation'
import { useStorefrontStore } from '@/features/storefront/store'
import { StorefrontForm } from '@/features/storefront/ui/StorefrontForm'

const StorefrontPage = () => {
  const router = useRouter()
  const { openForm } = useStorefrontStore()
  const { deleteStorefront, isDeleting } = useStorefrontMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetId, setTargetId] = useState<string | string[] | null>(null)

  const { data: storefrontList = [], isLoading } = useStorefronts()

  const statsData = useMemo(() => {
    return [
      { name: 'สาขาทั้งหมด', value: storefrontList.length },
      {
        name: 'เปิดให้บริการ',
        value: storefrontList.filter((s) => {
          return s.isActive
        }).length,
      },
      {
        name: 'ปิดปรับปรุง',
        value: storefrontList.filter((s) => {
          return !s.isActive
        }).length,
      },
    ]
  }, [storefrontList])

  const selectedCount = useMemo(() => {
    return selectedKeys === 'all' ? storefrontList.length : selectedKeys.size
  }, [selectedKeys, storefrontList])

  const selectedIds = useMemo(() => {
    return selectedKeys === 'all'
      ? storefrontList.map((item) => {
          return item.id
        })
      : (Array.from(selectedKeys) as string[])
  }, [selectedKeys, storefrontList])

  const handleDeleteTrigger = useCallback(
    (id: string | string[]) => {
      setTargetId(id)
      return onOpen()
    },
    [onOpen],
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!targetId) {
      return
    }

    if (Array.isArray(targetId)) {
      await Promise.all(
        targetId.map((id) => {
          return deleteStorefront(id)
        }),
      )
    } else {
      await deleteStorefront(targetId)
    }
    setTargetId(null)
    setSelectedKeys(new Set([]))
    return onOpenChange()
  }, [targetId, deleteStorefront, onOpenChange])

  const getActionItems = useCallback(
    (id: string) => {
      return [
        {
          key: 'edit',
          label: 'แก้ไขข้อมูลสาขา',
          icon: <EditIcon size={16} />,
          onClick: () => {
            return openForm(id)
          },
        },
        {
          key: 'stock',
          label: 'จัดการสต็อกและราคา',
          icon: <LayoutGridIcon size={16} />,
          onClick: () => router.push(`/dashboard/storefronts/${id}`),
        },
        {
          key: 'delete',
          label: 'ลบสาขา',
          icon: <TrashIcon size={16} />,
          isDanger: true,
          onClick: () => {
            return handleDeleteTrigger(id)
          },
        },
      ]
    },
    [openForm, router, handleDeleteTrigger],
  )

  return (
    <Container className='flex flex-col gap-6 text-left'>
      <Alert
        description='ระบบสาขาหน้าร้านมีไว้เพื่อเป็นตัวเลือกเสริมให้กับลูกค้าในการสั่งซื้อออนไลน์แล้วเลือก "เข้ารับสินค้าด้วยตัวเอง" ณ จุดบริการที่กำหนด การจัดการข้อมูลสาขาที่ถูกต้องจะช่วยให้ลูกค้าสามารถตัดสินใจเลือกสาขาที่ใกล้ที่สุดเพื่อประหยัดค่าจัดส่ง (Zero Shipping Fee) และได้รับสินค้าทันทีที่สถานะออเดอร์พร้อมรับ โดยไม่ต้องรอรอบการขนส่งปกติ'
        icon={<InfoIcon />}
        title='ข้อมูลสำคัญเกี่ยวกับระบบจัดการสาขาหน้าร้าน'
        variant='bordered'
      />

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {statsData.map((stat) => {
          return (
            <StatCard key={stat.name} label={stat.name} value={stat.value} />
          )
        })}
      </div>

      <TableConfigHeader
        actionContent={
          <Button
            className='text-secondary font-bold'
            color='primary'
            startContent={<PlusIcon size={18} />}
            onPress={() => {
              return openForm()
            }}
          >
            เพิ่มสาขาใหม่
          </Button>
        }
        selectedCount={selectedCount}
        title='จัดการสาขาหน้าร้าน'
        onDeleteSelected={() => {
          return handleDeleteTrigger(selectedIds)
        }}
      />

      <StorefrontTable
        getActionItems={getActionItems}
        isLoading={isLoading}
        selectedKeys={selectedKeys}
        storefrontList={storefrontList}
        onSelectionChange={setSelectedKeys}
      />

      <StorefrontForm />

      <ConfirmDeleteModal
        description='การลบสาขาจะส่งผลให้ลูกค้าไม่สามารถเลือกรับสินค้าที่สาขานี้ได้ ข้อมูลออเดอร์เก่าจะยังคงอยู่ คุณแน่ใจหรือไม่?'
        isOpen={isOpen}
        isPending={isDeleting}
        title='ยืนยันการลบสาขา'
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default StorefrontPage
