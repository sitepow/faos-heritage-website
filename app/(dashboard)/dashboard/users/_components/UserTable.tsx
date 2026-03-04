/* eslint-disable no-unused-vars */
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
  User,
} from '@heroui/react'
import { EllipsisVerticalIcon } from 'lucide-react'

import type { getUsers } from '@/features/user/user.action'
import type { Selection } from '@heroui/react'
import type { ReactNode } from 'react'

import { PaginationWrapper } from '@/components/ui/PaginationWrapper'
import { IMAGE_FALLBACK } from '@/constants'
import { useIsMounted } from '@/hooks/useIsMounted'
import { formatDate } from '@/utils'

type UserItemType = Awaited<ReturnType<typeof getUsers>>['items'][number]

interface ActionItem {
  key: string
  label: string
  icon: ReactNode
  isDanger?: boolean
  onClick: () => void
}

interface Props {
  userList: UserItemType[]
  isLoading: boolean
  page: number
  total: number
  selectedKeys: Selection
  onPageChange: (page: number) => void
  onSelectionChange: (keys: Selection) => void
  getActionItems: (id: string) => ActionItem[]
}

const UserTable = ({
  userList,
  isLoading,
  page,
  total,
  selectedKeys,
  onPageChange,
  onSelectionChange,
  getActionItems,
}: Props) => {
  const isMounted = useIsMounted()

  if (!isMounted) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table
        aria-label='User management table'
        checkboxesProps={{
          classNames: {
            wrapper: 'after:bg-primary before:border-default-300',
            icon: 'text-white font-bold',
          },
        }}
        selectedKeys={selectedKeys}
        selectionMode='multiple'
        onSelectionChange={onSelectionChange}
      >
        <TableHeader>
          <TableColumn>รหัสผู้ใช้งาน</TableColumn>
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
          {userList.map((user) => {
            const actionItems = getActionItems(user.id)
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <span className='text-default-500 font-mono text-xs font-bold'>
                    #{user.id.slice(-8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>
                  <User
                    avatarProps={{
                      src: user.image || IMAGE_FALLBACK.EMPTY,
                    }}
                    description={user.email}
                    name={user.name || 'ไม่ระบุชื่อ'}
                  >
                    {user.email}
                  </User>
                </TableCell>
                <TableCell>
                  <Chip
                    className='font-bold'
                    color={user.role === 'ADMIN' ? 'primary' : 'default'}
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
                    <DropdownMenu aria-label='User actions menu' variant='flat'>
                      {actionItems.map((item) => (
                        <DropdownItem
                          key={item.key}
                          className={item.isDanger ? 'text-danger' : ''}
                          color={item.isDanger ? 'danger' : 'default'}
                          startContent={item.icon}
                          onPress={item.onClick}
                        >
                          {item.label}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <PaginationWrapper page={page} total={total} onChange={onPageChange} />
    </div>
  )
}

export { UserTable }
