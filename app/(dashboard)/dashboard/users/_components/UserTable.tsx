'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  User as HeroUser,
  useDisclosure,
} from '@heroui/react'
import { EditIcon, EllipsisVerticalIcon, ShieldAlertIcon } from 'lucide-react'
import { useState } from 'react'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { PaginationWrapper } from '@/components/ui/PaginationWrapper'
import { UserForm } from '@/features/user/ui/UserForm'
import { useUsers } from '@/features/user/user.hook'
import { useUserMutation } from '@/features/user/user.mutation'
import { useAuthStore } from '@/features/user/user.store'
import { formatDate } from '@/utils'

const UserTable = () => {
  const [page, setPage] = useState(1)
  const { setState, onOpenUserChange } = useAuthStore()
  const { remove, isDeleting } = useUserMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [targetId, setTargetId] = useState<string | null>(null)

  const { data, isLoading } = useUsers(page, 50)
  const userList = data?.items || []

  const handleEdit = (id: string) => {
    setState({ userId: id })
    onOpenUserChange(true)
  }

  const handleDeleteClick = (id: string) => {
    setTargetId(id)
    onOpen()
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table
        aria-label='User management table'
        className='border-default-100 rounded-lg border'
      >
        <TableHeader>
          <TableColumn>ผู้ใช้งาน</TableColumn>
          <TableColumn>บทบาท</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn>วันที่ลงทะเบียน</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ไม่พบข้อมูลผู้ใช้งาน'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลด...' />}
        >
          {userList.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <HeroUser
                  avatarProps={{ src: user.image || '', size: 'sm' }}
                  description={user.email}
                  name={user.name}
                />
              </TableCell>
              <TableCell>
                <Chip
                  color={user.role === 'ADMIN' ? 'secondary' : 'default'}
                  size='sm'
                  variant='flat'
                >
                  {user.role}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip
                  color={user.isActive ? 'success' : 'danger'}
                  size='sm'
                  variant='dot'
                >
                  {user.isActive ? 'ปกติ' : 'ถูกระงับ'}
                </Chip>
              </TableCell>
              <TableCell className='text-default-400 text-xs'>
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell>
                <Dropdown placement='bottom-end'>
                  <DropdownTrigger>
                    <Button isIconOnly size='sm' variant='light'>
                      <EllipsisVerticalIcon
                        className='text-default-500'
                        size={20}
                      />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu variant='flat'>
                    <DropdownItem
                      key='edit'
                      startContent={<EditIcon size={16} />}
                      onPress={() => handleEdit(user.id)}
                    >
                      แก้ไขข้อมูล
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-danger'
                      color='danger'
                      startContent={<ShieldAlertIcon size={16} />}
                      onPress={() => handleDeleteClick(user.id)}
                    >
                      ระงับบัญชี
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationWrapper
        page={page}
        total={data?.totalPages || 1}
        onChange={(p) => setPage(p)}
      />

      <UserForm />

      <ConfirmDeleteModal
        confirmText='ยืนยันการระงับ'
        description='คุณแน่ใจหรือไม่ว่าต้องการระงับบัญชีนี้? ผู้ใช้จะไม่สามารถเข้าสู่ระบบได้จนกว่าจะมีการเปิดใช้งานใหม่'
        isOpen={isOpen}
        isPending={isDeleting}
        title='ระงับบัญชีผู้ใช้งาน'
        onConfirm={async () => {
          if (targetId) {
            await remove(targetId)
            onOpenChange()
            setTargetId(null)
          }
        }}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

export { UserTable }
