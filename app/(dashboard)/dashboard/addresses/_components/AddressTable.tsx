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
  useDisclosure,
  User as HeroUser,
  Spinner,
} from '@heroui/react'
import {
  EditIcon,
  EllipsisVerticalIcon,
  MapPinIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react'
import { useState } from 'react'

import { AddressForm } from './AddressForm'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { useAddressesAdmin } from '@/features/address/address.hook'
import { useDeleteAddress } from '@/features/address/address.mutation'
import { useAddressStore } from '@/features/address/address.store'

const AddressTable = () => {
  const { setState, onOpenAddressChange } = useAddressStore()
  const { data: addresses, isLoading } = useAddressesAdmin()
  const { mutateAsync: remove, isPending: isDeleting } = useDeleteAddress()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [targetId, setTargetId] = useState<string | null>(null)

  const handleAdd = () => {
    setState({ addressId: null })
    onOpenAddressChange(true)
  }

  const handleEdit = (id: string) => {
    setState({ addressId: id })
    onOpenAddressChange(true)
  }

  const handleDeleteClick = (id: string) => {
    setTargetId(id)
    onOpen()
  }

  const handleConfirmDelete = async () => {
    if (targetId) {
      await remove(targetId)
      onOpenChange()
      setTargetId(null)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>จัดการที่อยู่ลูกค้า</h1>
        <Button
          className='text-secondary font-bold'
          color='primary'
          startContent={<PlusIcon size={18} />}
          onPress={handleAdd}
        >
          เพิ่มที่อยู่ใหม่
        </Button>
      </div>

      <Table
        aria-label='Admin User Address Management'
        className='border-default-100 rounded-lg border'
        shadow='none'
      >
        <TableHeader>
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
          {(Array.isArray(addresses) ? addresses : []).map((addr: any) => (
            <TableRow key={addr.id}>
              <TableCell>
                <HeroUser
                  avatarProps={{ src: addr.user?.image || '', size: 'sm' }}
                  description={addr.user?.email}
                  name={addr.user?.name || 'ผู้ใช้ทั่วไป'}
                />
              </TableCell>
              <TableCell>
                <div className='flex flex-col'>
                  <span className='font-bold'>{addr.name}</span>
                  <span className='text-default-400 text-tiny'>
                    {addr.phone}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-start gap-2'>
                  <MapPinIcon
                    className='text-default-400 mt-1 shrink-0'
                    size={16}
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
                  <DropdownMenu variant='flat'>
                    <DropdownItem
                      key='edit'
                      startContent={<EditIcon size={16} />}
                      onPress={() => handleEdit(addr.id)}
                    >
                      แก้ไข
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-danger'
                      color='danger'
                      startContent={<TrashIcon size={16} />}
                      onPress={() => handleDeleteClick(addr.id)}
                    >
                      ลบ
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddressForm />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

export { AddressTable }
