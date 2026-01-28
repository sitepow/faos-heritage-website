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
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { deleteUser, getUsers, getUserStat } from './action'
import { UserForm } from './form'
import { useUserStore } from './store'

import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { StatCard, StatCardSkeleton } from '@/components/ui/StatCard'
import { ITEM_PER_PAGE } from '@/constants/app'
import { NO_IMAGE } from '@/constants/seo'

export default function User() {
  const t = useTranslations('Dashboard.UserManager')
  const tc = useTranslations('Common')

  const queryClient = useQueryClient()
  const { userId, setState, onOpenUserChange } = useUserStore()

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]))
  const selectedUserIds = Array.from(selectedKeys)
  const [page, setPage] = useState(1)

  const QUERY_KEY = {
    DASHBOARD: ['dashboard', 'users', 'card'],
    USERS: ['dashboard', 'users', 'pagination', page],
  }

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: QUERY_KEY.USERS,
    queryFn: () => getUsers(page, ITEM_PER_PAGE),
  })

  const { data: dashboard, isLoading: isLoadingDashboard } = useQuery({
    queryKey: QUERY_KEY.DASHBOARD,
    queryFn: () => getUserStat(),
  })

  const { mutate: mutateDeteleUser, isPending: isPendingDeteleUser } =
    useMutation({
      mutationFn: deleteUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.DASHBOARD })
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
          [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}

        {!isLoadingDashboard &&
          dashboard?.map((data) => (
            <StatCard key={data.name} {...data} name={data.name} />
          ))}
      </div>

      <div className='flex w-full flex-wrap gap-3 *:shrink-0 md:justify-end'>
        <Button
          color='primary'
          startContent={<PlusIcon />}
          variant='bordered'
          onPress={() => {
            onOpenUserChange()
          }}
        >
          {t('addNew')}
        </Button>
        <Button
          color='primary'
          isDisabled={selectedUserIds.length === 0}
          startContent={<XIcon />}
          variant='bordered'
          onPress={() => {
            setState({ userId: null })
            onOpenDeleteChange()
          }}
        >
          {t('deleteSelected', { count: selectedUserIds.length })}
        </Button>
      </div>

      <Table
        aria-label={t('tableAria')}
        checkboxesProps={{
          classNames: {
            base: 'data-[selected=true]:border-primary',
            icon: 'text-secondary',
          },
        }}
        className='border-divider rounded-lg border'
        selectionMode='multiple'
        onSelectionChange={(keys) => {
          setSelectedKeys(keys as Set<string>)
        }}
      >
        <TableHeader>
          <TableColumn>{t('colId')}</TableColumn>
          <TableColumn>{t('colImage')}</TableColumn>
          <TableColumn>{t('colName')}</TableColumn>
          <TableColumn>{t('colEmail')}</TableColumn>
          <TableColumn>{t('colRole')}</TableColumn>
          <TableColumn>{t('colStatus')}</TableColumn>
          <TableColumn>{t('colActions')}</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={t('empty')}
          isLoading={isLoadingUsers}
          loadingContent={<Spinner label={tc('loading')} />}
        >
          {(users?.items ?? []).map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                {!user?.image && <span>-</span>}
                {user?.image && (
                  <Avatar
                    key={user?.image}
                    isBordered
                    src={user?.image ?? NO_IMAGE}
                  />
                )}
              </TableCell>
              <TableCell className='max-w-40 min-w-40'>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip color='primary' variant='bordered'>
                  {user.role === Role.ADMIN ? t('roleAdmin') : t('roleUser')}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip color='primary' variant='bordered'>
                  {user.isActive ? t('statusEnable') : t('statusDisable')}
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
                    aria-label={t('dropdownAria')}
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
                      {t('editInfo')}
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
                      {t('deleteUser')}
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
        classNames={{
          item: 'text-secondary',
        }}
        page={page}
        total={users?.totalPages || 1}
        onChange={(page) => setPage(page)}
      />
    </section>
  )
}
