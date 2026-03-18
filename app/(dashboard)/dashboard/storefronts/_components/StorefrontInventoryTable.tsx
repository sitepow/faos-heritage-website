/* eslint-disable react/jsx-sort-props */
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
  User,
} from '@heroui/react'
import { EditIcon, PlusIcon } from 'lucide-react'

import { TableConfigHeader } from '../../products/_components/TableConfigHeader'

import { useStorefrontInventoryStore } from '@/features/storefront-inventory/store'
import { StorefrontInventoryForm } from '@/features/storefront-inventory/ui/StorefrontInventoryForm'

interface Props {
  inventoryList: any[]
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
            เพิ่มสินค้าเข้าสาขา selec edCount={0} t{' '}
          </Button>
        }
        title='รายการสินค้าและสต็อกในสาขา'
        selectedCount={0}
      />

      <Table aria-label='Storefront inventory table'>
        <TableHeader>
          <TableColumn>สินค้า</TableColumn>
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
                  <User
                    avatarProps={{
                      src: item.product.images?.[0]?.url,
                      radius: 'sm',
                      size: 'sm',
                    }}
                    description={item.product.slug}
                    name={item.product.name}
                  />
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
                  <Button
                    isIconOnly
                    color='primary'
                    size='sm'
                    variant='light'
                    onPress={() => {
                      return onOpen({
                        storefrontId: item.storefrontId,
                        productId: item.productId,
                        variantId: item.variantId,
                        stockQuantity: item.stockQuantity,
                        retailPrice: Number(item.retailPrice),
                        netPrice: Number(item.netPrice),
                        direction: 'IN', // default เป็น IN เมื่อกดแก้ไข
                      })
                    }}
                  >
                    <EditIcon size={18} />
                  </Button>
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
