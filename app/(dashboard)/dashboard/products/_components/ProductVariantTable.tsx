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
} from 'lucide-react'
import { useState } from 'react'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { useProductVariants } from '@/features/product-variant/product-variant.hook'
import { useProductVariantMutation } from '@/features/product-variant/product-variant.mutation'
import { useProductVariantUIStore } from '@/features/product-variant/product-variant.store'
import { useIsMounted } from '@/hooks/useIsMounted'
import { formatCurrency, formatNumber } from '@/utils'

interface Props {
  productId: string
}

const ProductVariantTable = ({ productId }: Props) => {
  const isMounted = useIsMounted()
  const { openForm } = useProductVariantUIStore()
  const { remove, isDeleting } = useProductVariantMutation()
  const { data: variants, isLoading } = useProductVariants(productId)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null)

  if (!isMounted) {
    return null
  }

  const handleDeleteClick = (id: string) => {
    setTargetDeleteId(id)
    onOpen()
  }

  const handleConfirmDelete = async () => {
    if (targetDeleteId) {
      await remove(targetDeleteId)
      setTargetDeleteId(null)
      onOpenChange()
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-end'>
        <Button
          className='text-secondary font-bold'
          color='primary'
          startContent={<PlusIcon size={18} />}
          onPress={() => openForm()}
        >
          เพิ่มตัวเลือกสินค้า
        </Button>
      </div>

      <Table
        aria-label='Product Variant Table'
        className='border-default-100 rounded-lg border'
      >
        <TableHeader>
          <TableColumn>ชื่อตัวเลือก</TableColumn>
          <TableColumn>ราคา</TableColumn>
          <TableColumn>คงเหลือ</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีข้อมูลตัวเลือกสำหรับสินค้านี้'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
        >
          {(variants || []).map((variant) => (
            <TableRow key={variant.id}>
              <TableCell>{variant.name}</TableCell>
              <TableCell>{formatCurrency(variant.price)}</TableCell>
              <TableCell>{formatNumber(variant.stockQuantity)}</TableCell>
              <TableCell>
                <Chip
                  color={variant.isActive ? 'success' : 'danger'}
                  size='sm'
                  variant='dot'
                >
                  {variant.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
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
                  <DropdownMenu aria-label='จัดการตัวเลือก' variant='flat'>
                    <DropdownItem
                      key='edit'
                      startContent={<EditIcon size={16} />}
                      onPress={() => openForm(variant.id)}
                    >
                      แก้ไขตัวเลือก
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-danger'
                      color='danger'
                      startContent={<TrashIcon size={16} />}
                      onPress={() => handleDeleteClick(variant.id)}
                    >
                      ลบตัวเลือก
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

export { ProductVariantTable }
