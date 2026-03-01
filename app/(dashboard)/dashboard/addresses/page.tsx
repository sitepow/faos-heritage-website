'use client'

import { useDisclosure, Button } from '@heroui/react'
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { AddressForm } from './_components/AddressForm'
import { AddressTable } from './_components/AddressTable'
import { TableConfigHeader } from '../products/_components/TableConfigHeader'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import {
  useAddressesAdmin,
  useAddressStat,
} from '@/features/address/address.hook'
import { useDeleteAddress } from '@/features/address/address.mutation'
import { useAddressStore } from '@/features/address/address.store'

const AddressesPage = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetId, setTargetId] = useState<string | string[] | null>(null)

  const { setState, onOpenAddressChange } = useAddressStore()

  const { data: stats } = useAddressStat()
  const { data: addresses, isLoading } = useAddressesAdmin()

  const { mutateAsync: remove, isPending: isDeleting } = useDeleteAddress()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const addressList = useMemo(() => {
    return Array.isArray(addresses) ? addresses : []
  }, [addresses])

  const statsData = useMemo(() => {
    return Array.isArray(stats) ? stats : []
  }, [stats])

  const selectedCount = useMemo(() => {
    if (selectedKeys === 'all') {
      return addressList.length
    }
    return selectedKeys.size
  }, [selectedKeys, addressList])

  const selectedAddressIds = useMemo(() => {
    if (selectedKeys === 'all') {
      return addressList.map((addr) => addr.id)
    }
    return Array.from(selectedKeys) as string[]
  }, [selectedKeys, addressList])

  const handleAdd = useCallback(() => {
    setState({ addressId: null })
    onOpenAddressChange(true)
  }, [setState, onOpenAddressChange])

  const handleEdit = useCallback(
    (id: string) => {
      setState({ addressId: id })
      onOpenAddressChange(true)
    },
    [setState, onOpenAddressChange],
  )

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
        label: 'แก้ไข',
        icon: <EditIcon size={16} />,
        onClick: () => handleEdit(id),
      },
      {
        key: 'delete',
        label: 'ลบ',
        icon: <TrashIcon size={16} />,
        isDanger: true,
        onClick: () => handleDeleteTrigger(id),
      },
    ],
    [handleEdit, handleDeleteTrigger],
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
            onPress={handleAdd}
          >
            เพิ่มที่อยู่ใหม่
          </Button>
        }
        selectedCount={selectedCount}
        title='จัดการที่อยู่ลูกค้า'
        onDeleteSelected={() => handleDeleteTrigger(selectedAddressIds)}
      />

      <AddressTable
        addressList={addressList}
        getActionItems={getActionItems}
        isLoading={isLoading}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />

      <AddressForm />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default AddressesPage
