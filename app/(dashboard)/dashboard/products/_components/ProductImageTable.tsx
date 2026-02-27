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
  Image,
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
import { useProductImages } from '@/features/product-image/product-image.hook'
import { useProductImageMutation } from '@/features/product-image/product-image.mutation'
import { useProductImageUIStore } from '@/features/product-image/product-image.store'
import { useIsMounted } from '@/hooks/useIsMounted'

interface Props {
  productId: string
}

const ProductImageTable = ({ productId }: Props) => {
  const isMounted = useIsMounted()
  const { openForm } = useProductImageUIStore()
  const { remove, isDeleting } = useProductImageMutation()
  const { data: images, isLoading } = useProductImages(productId)

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
          เพิ่มรูปภาพ
        </Button>
      </div>

      <Table
        aria-label='Product Images Table'
        className='border-default-100 rounded-lg border'
      >
        <TableHeader>
          <TableColumn width={120}>รูปภาพ</TableColumn>
          <TableColumn>คำอธิบาย (Alt Text)</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีรูปภาพสำหรับสินค้านี้'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดรูปภาพ...' />}
        >
          {(images || []).map((img) => (
            <TableRow key={img.id}>
              <TableCell>
                <Image
                  alt={img.alt || 'Product image'}
                  className='h-16 w-16 rounded-lg object-cover'
                  src={img.url || ''}
                />
              </TableCell>
              <TableCell className='text-default-600'>
                {img.alt || (
                  <span className='text-default-400'>ไม่มีคำอธิบาย</span>
                )}
              </TableCell>
              <TableCell>
                {img.isPrimary ? (
                  <Chip color='warning' size='sm' variant='flat'>
                    รูปหลัก
                  </Chip>
                ) : (
                  <Chip color='default' size='sm' variant='flat'>
                    รูปประกอบ
                  </Chip>
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
                  <DropdownMenu aria-label='จัดการรูปภาพ' variant='flat'>
                    <DropdownItem
                      key='edit'
                      startContent={<EditIcon size={16} />}
                      onPress={() => openForm(img.id)}
                    >
                      แก้ไขข้อมูล
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-danger'
                      color='danger'
                      startContent={<TrashIcon size={16} />}
                      onPress={() => handleDeleteClick(img.id)}
                    >
                      ลบรูปภาพ
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

export { ProductImageTable }
