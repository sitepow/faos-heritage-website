'use client'

import { Button } from '@heroui/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import { ArrowUpIcon, EditIcon, EllipsisVertical, PlusIcon, TrashIcon, XIcon } from 'lucide-react'

import { useState } from 'react'

import { TrendCard, TrendCardSkeleton } from '@/app/(dashboard)/_components/chart/trend-card'
import { ModalDelete } from '@/components/modal/delete'
import { Avatar } from '@heroui/avatar'
import { Chip } from '@heroui/chip'
import { useDisclosure } from '@heroui/modal'
import { Pagination } from '@heroui/pagination'
import { Spinner } from '@heroui/spinner'
import { Role } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserForm } from './_components/form/user'
import { deleteUser, getDashboard, getUsers } from './actions/user'
import { useUserStore } from './store'

const ITEM_PER_PAGE = 10

const Customer = () => {
  const queryClient = useQueryClient()
  const { userId, setState, onOpenUserChange } = useUserStore()

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]))
  const selectedUserIds = Array.from(selectedKeys)
  const [page, setPage] = useState(1)

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['dashboard', 'users', page, ITEM_PER_PAGE],
    queryFn: () => getUsers(page, ITEM_PER_PAGE),
  })

  const { data: dashboard, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ['dashboard', 'products'],
    queryFn: () => getDashboard(),
  })

  const { mutate: mutateDeteleUser, isPending: isPendingDeteleUser } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'users'] })
      onOpenDeleteChange()
      setState({ userId: null })
      setSelectedKeys(new Set([]))
    },
  })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <ModalDelete
        isOpen={isDeleteOpen}
        isPending={isPendingDeteleUser}
        onConfirm={() => {
          mutateDeteleUser(userId ? userId : selectedUserIds)
        }}
        onOpenChange={onOpenDeleteChange}
      />
      <UserForm />

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {isLoadingDashboard && [...Array(4)].map((_, index) => <TrendCardSkeleton key={index} />)}

        {!isLoadingDashboard && dashboard?.map((data) => <TrendCard key={data.name} {...data} />)}
      </div>

      <div className='flex w-full flex-wrap gap-3 *:shrink-0 md:justify-end'>
        <Button
          startContent={<PlusIcon className='text-default-500' />}
          variant='faded'
          onPress={() => {
            onOpenUserChange()
          }}
        >
          เพิ่มผู้ใช้งานใหม่
        </Button>
        <Button startContent={<ArrowUpIcon className='text-default-500' />} variant='faded'>
          ส่งออกไฟล์ XLSX
        </Button>
        <Button
          isDisabled={selectedUserIds.length === 0}
          startContent={<XIcon className='text-default-500' />}
          variant='faded'
          onPress={() => {
            setState({ userId: null })
            onOpenDeleteChange()
          }}
        >
          ลบรายการที่เลือก ({selectedUserIds.length})
        </Button>
      </div>

      <Table
        aria-label='ตารางข้อมูลผู้ใช้งาน'
        selectionMode='multiple'
        onSelectionChange={(keys) => {
          setSelectedKeys(keys as Set<string>)
        }}
      >
        <TableHeader>
          <TableColumn>รหัสลูกค้า</TableColumn>
          <TableColumn>รูปภาพ</TableColumn>
          <TableColumn>ชื่อลูกค้า</TableColumn>
          <TableColumn>อีเมล</TableColumn>
          <TableColumn>สิทธิ์การใช้งาน</TableColumn>
          <TableColumn>สถานะบัญชี</TableColumn>
          <TableColumn>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ไม่มีข้อมูลที่จะแสดง'
          isLoading={isLoadingUsers}
          loadingContent={<Spinner label='กำลังโหลด...' />}
        >
          {(users?.items ?? []).map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                {user?.image?.length === 0 && <span>-</span>}

                {user?.image?.length !== 0 && (
                  <Avatar key={user?.image} src={user?.image ?? '/placeholder.svg'} />
                )}
              </TableCell>
              <TableCell className='max-w-40 min-w-40'>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip>{user.role === Role.ADMIN ? 'ผู้ดูแลระบบ' : 'ลูกค้า'}</Chip>
              </TableCell>
              <TableCell>
                <Chip>{user.isActive ? 'เปิดการใช้งาน' : 'ถูกระงับการใช้งาน'}</Chip>
              </TableCell>
              <TableCell className='flex gap-2.5'>
                <Dropdown placement='bottom-end'>
                  <DropdownTrigger>
                    <Button isIconOnly size='sm' variant='light'>
                      <EllipsisVertical className='size-5 text-default-500' />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label='จัดการผู้ใช้งาน' className='min-w-[180px]'>
                    <DropdownItem
                      key='edit'
                      startContent={<EditIcon className='size-4' />}
                      onClick={() => {
                        setState({ userId: user?.id })
                        onOpenUserChange()
                      }}
                    >
                      แก้ไขข้อมูล
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-danger'
                      color='danger'
                      startContent={<TrashIcon className='size-4' />}
                      onClick={() => {
                        setState({ userId: user?.id })
                        onOpenDeleteChange()
                      }}
                    >
                      ปิดบัญชี (Soft Delete)
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        showControls
        page={page}
        total={users?.totalPages ?? 1}
        onChange={(p) => setPage(p)}
      />
    </section>
  )
}

export default Customer
