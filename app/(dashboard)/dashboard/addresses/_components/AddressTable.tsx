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
  User as HeroUser,
  Spinner,
} from '@heroui/react'
import { EllipsisVerticalIcon, MapPinIcon } from 'lucide-react'

import type { getAddressesAdmin } from '@/features/address/address.action'
import type { Selection } from '@heroui/react'
import type { ReactNode } from 'react'

import { IMAGE_FALLBACK } from '@/constants'
import { useIsMounted } from '@/hooks/useIsMounted'

type AddressItemType = Awaited<ReturnType<typeof getAddressesAdmin>>[number]

interface ActionItem {
  key: string
  label: string
  icon: ReactNode
  isDanger?: boolean
  onClick: () => void
}

interface Props {
  addressList: AddressItemType[]
  isLoading: boolean
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  getActionItems: (id: string) => ActionItem[]
}

const AddressTable = ({
  addressList,
  isLoading,
  selectedKeys,
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
        aria-label='Admin User Address Management'
        checkboxesProps={{
          classNames: {
            wrapper: 'after:bg-primary before:border-default-300',
            icon: 'text-white font-bold',
          },
        }}
        className='border-default-100 rounded-lg border'
        selectedKeys={selectedKeys}
        selectionMode='multiple'
        shadow='none'
        onSelectionChange={onSelectionChange}
      >
        <TableHeader>
          <TableColumn>รหัสที่อยู่</TableColumn>
          <TableColumn>เจ้าของบัญชี</TableColumn>
          <TableColumn>ผู้รับ / เบอร์โทร</TableColumn>
          <TableColumn width={350}>ที่อยู่</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ไม่พบข้อมูลที่อยู่'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
        >
          {addressList.map((addr) => {
            const actionItems = getActionItems(addr.id)

            return (
              <TableRow key={addr.id}>
                <TableCell>
                  <span className='text-default-500 font-mono text-xs font-bold'>
                    #{addr.id.slice(-8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>
                  <HeroUser
                    avatarProps={{
                      src: addr?.user?.image ?? IMAGE_FALLBACK.EMPTY,
                    }}
                    description={addr?.user?.email}
                    name={addr?.user?.name || 'ผู้ใช้ทั่วไป'}
                  />
                </TableCell>
                <TableCell>
                  <div className='flex flex-col'>
                    <span className='text-small'>{addr.name}</span>
                    <span className='text-default-400 text-tiny'>
                      {addr.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-start gap-2'>
                    <MapPinIcon
                      className='text-default-400 mt-1 shrink-0'
                      size={14}
                    />
                    <span className='text-small'>
                      {addr.address} {addr.subDistrict} {addr.district}{' '}
                      {addr.province} {addr.postalCode} {addr.country}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {addr.isDefault ? (
                    <Chip
                      className='font-bold'
                      color='primary'
                      size='sm'
                      variant='flat'
                    >
                      หลัก
                    </Chip>
                  ) : (
                    <span className='text-default-300'>-</span>
                  )}
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
                    <DropdownMenu aria-label='Address Actions' variant='flat'>
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
    </div>
  )
}

export { AddressTable }
