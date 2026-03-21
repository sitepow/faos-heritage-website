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
import {
  EllipsisVerticalIcon,
  PackageIcon,
  PhoneIcon,
  DatabaseIcon,
  StoreIcon,
} from 'lucide-react'

import type { GetStorefrontsResult } from '@/features/storefront/action'
import type { Selection } from '@heroui/react'
import type { ReactNode } from 'react'

import { useIsMounted } from '@/hooks/useIsMounted'

interface ActionItem {
  key: string
  label: string
  icon: ReactNode
  isDanger?: boolean
  onClick: () => void
}

type StorefrontData = GetStorefrontsResult[number] & { totalStock?: number }

interface Props {
  storefrontList: StorefrontData[]
  isLoading: boolean
  getActionItems: (id: string) => ActionItem[]
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
}

const StorefrontTable = ({
  storefrontList,
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
        aria-label='Storefront management table'
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
          <TableColumn>ชื่อสาขา</TableColumn>
          <TableColumn>ที่อยู่ / ติดต่อ</TableColumn>
          <TableColumn>ประเภทสต็อก</TableColumn>
          <TableColumn>พิกัด</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn align='center'>สต็อกรวม (ชิ้น)</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีข้อมูลสาขา'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
        >
          {storefrontList.map((item) => {
            const actionItems = getActionItems(item.id)
            return (
              <TableRow key={item.id}>
                <TableCell className='max-w-64 min-w-64 font-bold break-words whitespace-normal'>
                  {item.name}
                </TableCell>
                <TableCell className='max-w-64 min-w-64 break-words whitespace-normal'>
                  <div className='flex flex-col gap-1'>
                    <span className='text-default-500 text-xs'>
                      {item.address}
                    </span>
                    <div className='text-tiny text-primary flex items-center gap-1'>
                      <PhoneIcon size={12} /> {item.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    className='gap-1'
                    color={item.isMain ? 'primary' : 'default'}
                    size='sm'
                    startContent={
                      item.isMain ? (
                        <DatabaseIcon size={12} />
                      ) : (
                        <StoreIcon size={12} />
                      )
                    }
                    variant='bordered'
                  >
                    {item.isMain ? 'คลังหลัก' : 'สต็อกแยกสาขา'}
                  </Chip>
                </TableCell>
                <TableCell className='text-default-400 text-xs'>
                  {item?.googleMapUrl ? (
                    <a
                      className='text-primary hover:underline'
                      href={item.googleMapUrl}
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      ดูแผนที่
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    color={item.isActive ? 'success' : 'danger'}
                    size='sm'
                    variant='dot'
                  >
                    {item.isActive ? 'เปิดให้บริการ' : 'ปิดชั่วคราว'}
                  </Chip>
                </TableCell>
                <TableCell align='center'>
                  <div className='flex flex-col items-center justify-center gap-1'>
                    <div className='text-primary flex items-center gap-1 font-bold'>
                      <PackageIcon size={14} />
                      {item.totalStock?.toLocaleString() ?? 0}
                    </div>
                  </div>
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
                    <DropdownMenu aria-label='จัดการสาขา' variant='flat'>
                      {actionItems.map((action) => {
                        return (
                          <DropdownItem
                            key={action.key}
                            className={action.isDanger ? 'text-danger' : ''}
                            color={action.isDanger ? 'danger' : 'default'}
                            startContent={action.icon}
                            onPress={() => {
                              return action.onClick()
                            }}
                          >
                            {action.label}
                          </DropdownItem>
                        )
                      })}
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

export { StorefrontTable }
