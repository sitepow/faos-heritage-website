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
  useDisclosure,
} from '@heroui/react'
import {
  EditIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  GlobeIcon,
} from 'lucide-react'
import { useState } from 'react'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { useShippingCountriesAdmin } from '@/features/shipping/shipping.hook'
import { useShippingMutation } from '@/features/shipping/shipping.mutation'
import { useShippingUIStore } from '@/features/shipping/shipping.store'
import { ShippingForm } from '@/features/shipping/ui/ShippingForm'
import { formatCurrency } from '@/utils'

const ShippingTable = () => {
  const { openForm } = useShippingUIStore()
  const { data: countries, isLoading } = useShippingCountriesAdmin()
  const { remove, isDeleting } = useShippingMutation()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [targetId, setTargetId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setTargetId(id)
    onOpen()
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>จัดการค่าจัดส่งรายประเทศ</h1>
        <Button
          className='text-secondary font-bold'
          color='primary'
          startContent={<PlusIcon size={18} />}
          onPress={() => openForm()}
        >
          เพิ่มประเทศ/เรทค่าส่ง
        </Button>
      </div>

      <Table
        aria-label='Shipping rate table'
        className='border-default-100 rounded-lg border'
      >
        <TableHeader>
          <TableColumn>ประเทศ</TableColumn>
          <TableColumn>ค่าส่งเริ่มต้น</TableColumn>
          <TableColumn>ราคา/กก.</TableColumn>
          <TableColumn>สกุลเงิน</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีการกำหนดค่าจัดส่ง'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
        >
          {(countries || []).map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className='flex items-center gap-2 font-bold'>
                  <GlobeIcon className='text-default-400' size={16} />
                  <span>
                    {item.countryName} ({item.countryCode})
                  </span>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(item.baseRate)}</TableCell>
              <TableCell>{formatCurrency(item.pricePerKg)} / kg</TableCell>
              <TableCell>
                <Chip
                  className='font-bold'
                  color='primary'
                  size='sm'
                  variant='flat'
                >
                  {item.currency}
                </Chip>
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
                  <DropdownMenu variant='flat'>
                    <DropdownItem
                      key='edit'
                      startContent={<EditIcon size={16} />}
                      onPress={() => openForm(item.id)}
                    >
                      แก้ไขเรทค่าส่ง
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-danger'
                      color='danger'
                      startContent={<TrashIcon size={16} />}
                      onPress={() => handleDeleteClick(item.id)}
                    >
                      ลบข้อมูล
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ShippingForm />

      <ConfirmDeleteModal
        description='การลบข้อมูลนี้จะส่งผลให้ลูกค้าในประเทศดังกล่าวไม่สามารถสั่งซื้อสินค้าได้ชั่วคราว คุณแน่ใจหรือไม่?'
        isOpen={isOpen}
        isPending={isDeleting}
        title='ยืนยันการลบค่าจัดส่ง'
        onConfirm={async () => {
          if (targetId) {
            await remove(targetId)
            onOpenChange()
          }
        }}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

export { ShippingTable }
