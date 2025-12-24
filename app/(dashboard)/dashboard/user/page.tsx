'use client'

import {
  useDisclosure,
  Button,
  TableHeader,
  TableColumn,
  TableBody,
  Spinner,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Table,
} from '@heroui/react'
import { Role } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EditIcon,
  EllipsisVertical,
  PlusIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react'
import { useState } from 'react'

import { deleteUser, getUsers, getUserStat } from './action'
import { useUserStore } from './store'
import { UserForm } from '../product/components/form/user'

import {
  StatCard,
  StatCardSkeleton,
} from '@/app/(dashboard)/components/stat-card'
import { ConfirmModal } from '@/components/modal/confirm'
import { ITEM_PER_PAGE, NO_IMAGE } from '@/utils/constants'

export default function User() {
  const queryClient = useQueryClient()
  const { userId, setState, onOpenUserChange } = useUserStore()

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]))
  const selectedUserIds = Array.from(selectedKeys)
  const [page, setPage] = useState(1)

  const QUERY = {
    DASHBOARD: ['dashboard', 'users', 'card'],
    USERS: ['dashboard', 'users', 'pagination', page],
  }

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: QUERY.USERS,
    queryFn: () => getUsers(page, ITEM_PER_PAGE),
  })

  const { data: dashboard, isLoading: isLoadingDashboard } = useQuery({
    queryKey: QUERY.DASHBOARD,
    queryFn: () => getUserStat(),
  })

  const { mutate: mutateDeteleUser, isPending: isPendingDeteleUser } =
    useMutation({
      mutationFn: deleteUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY.DASHBOARD })
        onOpenDeleteChange()
        setState({ userId: null })
        setSelectedKeys(new Set([]))
      },
    })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <ConfirmModal
        isOpen={isDeleteOpen}
        isPending={isPendingDeteleUser}
        onConfirm={() => {
          mutateDeteleUser(userId ? userId : selectedUserIds)
        }}
        onOpenChange={onOpenDeleteChange}
      />
      <UserForm />

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {isLoadingDashboard &&
          [...Array(4)].map((_) => <StatCardSkeleton key={_} />)}

        {!isLoadingDashboard &&
          dashboard?.map((data) => <StatCard key={data.name} {...data} />)}
      </div>

      <div className='flex w-full flex-wrap gap-3 *:shrink-0 md:justify-end'>
        <Button
          className='text-white'
          color='primary'
          startContent={<PlusIcon />}
          onPress={() => {
            onOpenUserChange()
          }}
        >
          Add new users
        </Button>
        <Button
          className='text-white'
          color='primary'
          isDisabled={selectedUserIds.length === 0}
          startContent={<XIcon />}
          onPress={() => {
            setState({ userId: null })
            onOpenDeleteChange()
          }}
        >
          Delete selected items ({selectedUserIds.length})
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
          <TableColumn>Customer ID</TableColumn>
          <TableColumn>Image</TableColumn>
          <TableColumn>Customer Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Account Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='There is no information to display'
          isLoading={isLoadingUsers}
          loadingContent={<Spinner label='Loading...' />}
        >
          {(users?.items ?? []).map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                {user?.image?.length === 0 && <span>-</span>}

                {user?.image?.length !== 0 && (
                  <Avatar key={user?.image} src={user?.image ?? NO_IMAGE} />
                )}
              </TableCell>
              <TableCell className='max-w-40 min-w-40'>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip color='primary' variant='bordered'>
                  {user.role === Role.ADMIN
                    ? 'System administrator'
                    : 'Customer'}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip color='primary' variant='bordered'>
                  {user.isActive ? 'Enable' : 'Account suspended'}
                </Chip>
              </TableCell>
              <TableCell className='flex gap-2.5'>
                <Dropdown placement='bottom-end'>
                  <DropdownTrigger>
                    <Button isIconOnly size='sm' variant='light'>
                      <EllipsisVertical className='text-default-500 size-5' />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label='Manage users'
                    className='min-w-[180px]'
                  >
                    <DropdownItem
                      key='edit'
                      startContent={<EditIcon className='size-4' />}
                      onClick={() => {
                        setState({ userId: user?.id })
                        onOpenUserChange()
                      }}
                    >
                      Edit information
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
                      Close account (Soft Delete)
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
        className='text-white'
        page={page}
        total={users?.totalPages || 1}
        onChange={(page) => setPage(page)}
      />
    </section>
  )
}
