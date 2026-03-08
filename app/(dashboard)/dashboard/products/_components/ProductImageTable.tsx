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
import { EllipsisVerticalIcon } from 'lucide-react'
import { useMemo } from 'react'

import type { Selection } from '@heroui/react'
import type { ReactNode } from 'react'

import { ProductImage } from '@/components/ui/Product/ProductImage'
import { IMAGE_FALLBACK } from '@/constants'
import { useProductImages } from '@/features/product-image/product-image.hook'
import { useIsMounted } from '@/hooks/useIsMounted'

interface ActionItem {
  key: string
  label: string
  icon: ReactNode
  isDanger?: boolean
  onClick: () => void
}

interface Props {
  productId: string
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  getActionItems: (id: string) => ActionItem[]
}

const ProductImageTable = ({
  productId,
  selectedKeys,
  onSelectionChange,
  getActionItems,
}: Props) => {
  const isMounted = useIsMounted()
  const { data: images, isLoading } = useProductImages(productId)

  const imageList = useMemo(() => images || [], [images])

  if (!isMounted) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table
        aria-label='Product Images Table'
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
          <TableColumn>รหัสรูปภาพ</TableColumn>
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
          {imageList.map((img) => {
            const actionItems = getActionItems(img.id)
            return (
              <TableRow key={img.id}>
                <TableCell>
                  <span className='text-default-500 font-mono text-xs font-bold'>
                    #{img.id.slice(-8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>
                  <ProductImage
                    fill
                    className='size-20'
                    image={img?.url ?? IMAGE_FALLBACK.EMPTY}
                  />
                </TableCell>
                <TableCell className='text-default-600 font-medium'>
                  {img?.alt ?? '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    className='font-bold'
                    color={img.isPrimary ? 'warning' : 'default'}
                    size='sm'
                    variant='dot'
                  >
                    {img.isPrimary ? 'รูปหลัก' : 'รูปประกอบ'}
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
                    <DropdownMenu aria-label='จัดการรูปภาพ' variant='flat'>
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

export { ProductImageTable }
