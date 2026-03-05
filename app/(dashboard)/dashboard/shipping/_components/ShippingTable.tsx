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
} from '@heroui/react'
import { EllipsisVerticalIcon, GlobeIcon } from 'lucide-react'

import type { Selection } from '@heroui/react'
import type { ReactNode } from 'react'

import { useIsMounted } from '@/hooks/useIsMounted'
import { formatCurrency } from '@/utils'

interface ActionItem {
  key: string
  label: string
  icon: ReactNode
  isDanger?: boolean
  onClick: () => void
}

interface Props {
  shippingList: any[]
  isLoading: boolean
  getActionItems: (id: string) => ActionItem[]
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
}

const ShippingTable = ({
  shippingList,
  isLoading,
  getActionItems,
  selectedKeys,
  onSelectionChange,
}: Props) => {
  const isMounted = useIsMounted()

  if (!isMounted) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table
        aria-label='Shipping rate table'
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
          <TableColumn>รหัสค่าส่ง</TableColumn>
          <TableColumn>ประเทศ</TableColumn>
          <TableColumn>ค่าส่งเริ่มต้น</TableColumn>
          <TableColumn>ราคา/กก.</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีการกำหนดค่าจัดส่ง'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
        >
          {shippingList.map((item) => {
            const actionItems = getActionItems(item.id)
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <span className='text-default-500 font-mono text-xs font-bold'>
                    #{item.id.slice(-8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className='min-w-40'>
                  <div className='flex items-center gap-2'>
                    <GlobeIcon className='text-default-400' size={16} />
                    <span>
                      {item.countryName} ({item.countryCode})
                    </span>
                  </div>
                </TableCell>
                <TableCell className='min-w-32'>
                  {formatCurrency(item.baseRate)}
                </TableCell>
                <TableCell className='min-w-32'>
                  {formatCurrency(item.pricePerKg)} / kg
                </TableCell>
                <TableCell>
                  <Chip
                    color={item.isActive ? 'success' : 'danger'}
                    size='sm'
                    variant='dot'
                  >
                    {item.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </Chip>
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
                    <DropdownMenu aria-label='จัดการค่าส่ง' variant='flat'>
                      {actionItems.map((action) => (
                        <DropdownItem
                          key={action.key}
                          className={action.isDanger ? 'text-danger' : ''}
                          color={action.isDanger ? 'danger' : 'default'}
                          startContent={action.icon}
                          onPress={action.onClick}
                        >
                          {action.label}
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

export { ShippingTable }
