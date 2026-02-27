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
  FileTextIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { useProductLocales } from '@/features/product-localization/product-localization.hook'
import { useProductLocaleMutation } from '@/features/product-localization/product-localization.mutation'
import { useProductLocaleUIStore } from '@/features/product-localization/product-localization.store'
import { ProductLocalizationForm } from '@/features/product-localization/ui/ProductLocalizationForm'
import { useIsMounted } from '@/hooks/useIsMounted'

interface Props {
  productId: string
  originalName: string
}

const ProductLocalizationTable = ({ productId, originalName }: Props) => {
  const router = useRouter()
  const isMounted = useIsMounted()
  const { openForm } = useProductLocaleUIStore()
  const { remove, isDeleting } = useProductLocaleMutation()

  const { data: localizations, isLoading } = useProductLocales(productId)

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
          เพิ่มการแปลภาษา
        </Button>
      </div>

      <Table
        aria-label='Product Localization Table'
        className='border-default-100 rounded-lg border'
      >
        <TableHeader>
          <TableColumn>รหัสภาษา</TableColumn>
          <TableColumn>ชื่อสินค้า (ต้นฉบับ)</TableColumn>
          <TableColumn>ชื่อสินค้า (ที่แปลแล้ว)</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีข้อมูลการแปลภาษาสำหรับสินค้านี้'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูลภาษา...' />}
        >
          {(localizations || []).map((locale) => (
            <TableRow key={locale.id}>
              <TableCell>
                <Chip
                  className='font-bold'
                  color='secondary'
                  size='sm'
                  variant='flat'
                >
                  {locale.languageCode.toUpperCase()}
                </Chip>
              </TableCell>
              <TableCell>{originalName}</TableCell>
              <TableCell className='text-primary font-medium'>
                {locale.name}
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
                  <DropdownMenu aria-label='จัดการภาษา' variant='flat'>
                    <DropdownItem
                      key='edit'
                      startContent={<EditIcon size={16} />}
                      onPress={() => openForm(locale.id)}
                    >
                      แก้ไขการแปล
                    </DropdownItem>
                    <DropdownItem
                      key='description'
                      startContent={<FileTextIcon size={16} />}
                      onPress={() =>
                        router.push(
                          `/dashboard/products/${productId}/localization/${locale.id}/description`,
                        )
                      }
                    >
                      แก้ไขรายละเอียดเนื้อหา
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-danger'
                      color='danger'
                      startContent={<TrashIcon size={16} />}
                      onPress={() => handleDeleteClick(locale.id)}
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

      <ProductLocalizationForm />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

export { ProductLocalizationTable }
