'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react'
import { PlusIcon, PackageIcon, TagIcon, MoreVerticalIcon } from 'lucide-react'

import type { getStorefrontInventories } from '@/features/storefront-inventory/action'

import { TableConfigHeader } from '../../products/_components/TableConfigHeader'

import { ProductImage } from '@/components/ui/Product/ProductImage'
import { IMAGE_FALLBACK } from '@/constants'
import { useStorefrontInventoryStore } from '@/features/storefront-inventory/store'
import { StorefrontInventoryForm } from '@/features/storefront-inventory/ui/StorefrontInventoryForm'

type StorefrontInventoryList = Awaited<
  ReturnType<typeof getStorefrontInventories>
>

interface Props {
  inventoryList: StorefrontInventoryList
  isLoading: boolean
  storefrontId: string
}

const StorefrontInventoryTable = ({
  inventoryList,
  isLoading,
  storefrontId,
}: Props) => {
  const { onOpen } = useStorefrontInventoryStore()

  return (
    <div className='flex flex-col gap-4'>
      <TableConfigHeader
        actionContent={
          <Button
            className='text-secondary font-bold'
            color='primary'
            startContent={<PlusIcon size={18} />}
            onPress={() => {
              return onOpen()
            }}
          >
            เพิ่มสินค้าเข้าสาขา
          </Button>
        }
        selectedCount={0}
        title='รายการสินค้าและสต็อกในสาขา'
      />

      <Table aria-label='Storefront inventory table'>
        <TableHeader>
          <TableColumn>รหัสรายการ</TableColumn>
          <TableColumn>รูปภาพ</TableColumn>
          <TableColumn>ชื่อสินค้า</TableColumn>
          <TableColumn>ตัวเลือก (Variant)</TableColumn>
          <TableColumn align='center'>สต็อกสาขา</TableColumn>
          <TableColumn align='end'>ราคาหน้าร้าน</TableColumn>
          <TableColumn align='end' className='text-primary'>
            ราคาที่ได้รับจริง (Net)
          </TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีการลงสินค้าในสาขานี้'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดสต็อก...' />}
        >
          {inventoryList.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <span className='text-default-500 font-mono text-xs font-bold'>
                    #{item.id.slice(-8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>
                  <ProductImage
                    fill
                    className='size-20'
                    image={
                      item.product.images?.[0]?.url ?? IMAGE_FALLBACK.EMPTY
                    }
                  />
                </TableCell>
                <TableCell className='max-w-52 min-w-52 font-medium'>
                  {item.product.name}
                </TableCell>
                <TableCell>{item.variant?.name ?? '-'}</TableCell>
                <TableCell className='text-center font-bold'>
                  {item.stockQuantity.toLocaleString()}
                </TableCell>
                <TableCell className='text-right'>
                  ฿{Number(item.retailPrice).toLocaleString()}
                </TableCell>
                <TableCell className='text-primary text-right font-bold'>
                  ฿{Number(item.netPrice).toLocaleString()}
                </TableCell>
                <TableCell className='text-center'>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size='sm' variant='light'>
                        <MoreVerticalIcon size={18} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label='Static Actions'>
                      <DropdownItem
                        key='stock'
                        startContent={<PackageIcon size={18} />}
                        onPress={() => {
                          return onOpen({
                            storefrontId: item.storefrontId,
                            productId: item.productId,
                            variantId: item.variantId,
                            stockQuantity: 0,
                            retailPrice: Number(item.retailPrice),
                            netPrice: Number(item.netPrice),
                            direction: 'IN',
                            mode: 'stock',
                          })
                        }}
                      >
                        จัดการสต็อก
                      </DropdownItem>
                      <DropdownItem
                        key='price'
                        startContent={<TagIcon size={18} />}
                        onPress={() => {
                          return onOpen({
                            storefrontId: item.storefrontId,
                            productId: item.productId,
                            variantId: item.variantId,
                            stockQuantity: item.stockQuantity,
                            retailPrice: Number(item.retailPrice),
                            netPrice: Number(item.netPrice),
                            direction: 'IN',
                            mode: 'price',
                          })
                        }}
                      >
                        แก้ไขราคา
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <StorefrontInventoryForm storefrontId={storefrontId} />
    </div>
  )
}

export { StorefrontInventoryTable }
