'use client'

import { useDisclosure, Button } from '@heroui/react'
import { PlusIcon, EditIcon, ShieldAlertIcon } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { UserTable } from './_components/UserTable'
import { TableConfigHeader } from '../products/_components/TableConfigHeader'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { UserForm } from '@/features/user/ui/UserForm'
import { useUsers, useUserStat } from '@/features/user/user.hook'
import { useUserMutation } from '@/features/user/user.mutation'
import { useAuthStore } from '@/features/user/user.store'

const UserPage = () => {
  const [page, setPage] = useState(1)
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetId, setTargetId] = useState<string | string[] | null>(null)

  const { setState, onOpenUserChange } = useAuthStore()
  const { remove, isDeleting } = useUserMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const { data: stats } = useUserStat()
  const { data, isLoading } = useUsers(page, 50)

  const userList = useMemo(() => {
    return data?.items || []
  }, [data])

  const statsData = useMemo(() => {
    return Array.isArray(stats) ? stats : []
  }, [stats])

  const selectedCount = useMemo(() => {
    if (selectedKeys === 'all') {
      return userList.length
    }
    return selectedKeys.size
  }, [selectedKeys, userList])

  const selectedUserIds = useMemo(() => {
    if (selectedKeys === 'all') {
      return userList.map((u) => u.id)
    }
    return Array.from(selectedKeys) as string[]
  }, [selectedKeys, userList])

  const handleEdit = useCallback(
    (id: string) => {
      setState({ userId: id })
      onOpenUserChange(true)
    },
    [setState, onOpenUserChange],
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
    (userId: string) => [
      {
        key: 'edit',
        label: 'แก้ไขข้อมูล',
        icon: <EditIcon size={16} />,
        onClick: () => handleEdit(userId),
      },
      {
        key: 'delete',
        label: 'ระงับบัญชี',
        icon: <ShieldAlertIcon size={16} />,
        isDanger: true,
        onClick: () => handleDeleteTrigger(userId),
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
            onPress={() => onOpenUserChange(true)}
          >
            เพิ่มผู้ใช้งานใหม่
          </Button>
        }
        selectedCount={selectedCount}
        title='จัดการผู้ใช้งาน'
        onDeleteSelected={() => handleDeleteTrigger(selectedUserIds)}
      />

      <UserTable
        getActionItems={getActionItems}
        isLoading={isLoading}
        page={page}
        selectedKeys={selectedKeys}
        total={data?.totalPages || 1}
        userList={userList}
        onPageChange={setPage}
        onSelectionChange={setSelectedKeys}
      />

      <UserForm />

      <ConfirmDeleteModal
        confirmText='ยืนยันการระงับ'
        description='คุณแน่ใจหรือไม่ว่าต้องการระงับบัญชีนี้? ผู้ใช้จะไม่สามารถเข้าสู่ระบบได้จนกว่าจะมีการเปิดใช้งานใหม่'
        isOpen={isOpen}
        isPending={isDeleting}
        title='ระงับบัญชีผู้ใช้งาน'
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default UserPage
