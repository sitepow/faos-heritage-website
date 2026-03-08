'use client'

import { Button } from '@heroui/react'
import { PlusIcon } from 'lucide-react'
import { useState, useMemo } from 'react'

import type { ProductWithPayload } from '@/features/product/product.action'
import type { Selection } from '@heroui/react'

import { InventoryTable } from './_components/InventoryTable'
import { TableConfigHeader } from '../products/_components/TableConfigHeader'

import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import {
  useProductsAdmin,
  useProductStats,
} from '@/features/product/product.hook'
import { useStockStore } from '@/features/stock/stock.store'
import { StockAdjustmentForm } from '@/features/stock/ui/StockAdjustmentForm'

const InventoryPage = () => {
  const { openAdjustment } = useStockStore()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [page, setPage] = useState(1)

  const { data: stats } = useProductStats()
  const { data: productsData, isLoading } = useProductsAdmin(page, 50)

  const productList = useMemo(() => {
    const items =
      productsData && 'items' in productsData ? productsData.items : []
    return items as ProductWithPayload[]
  }, [productsData])

  const statsData = useMemo(() => {
    return Array.isArray(stats) ? stats : []
  }, [stats])

  const selectedCount = useMemo(() => {
    return selectedKeys === 'all' ? productList.length : selectedKeys.size
  }, [selectedKeys, productList])

  return (
    <Container className='flex flex-col gap-6 text-left'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {statsData.map((stat) => {
          return (
            <StatCard key={stat.name} label={stat.name} value={stat.value} />
          )
        })}
      </div>

      <TableConfigHeader
        actionContent={
          <Button
            className='text-secondary font-bold'
            color='primary'
            startContent={<PlusIcon size={18} />}
            onPress={() => {
              return openAdjustment('')
            }}
          >
            ทำรายการใหม่
          </Button>
        }
        selectedCount={selectedCount}
        title='จัดการสต็อกสินค้า'
      />

      <InventoryTable
        isLoading={isLoading}
        page={page}
        productList={productList}
        selectedKeys={selectedKeys}
        onPageChange={setPage}
        onSelectionChange={setSelectedKeys}
      />

      <StockAdjustmentForm />
    </Container>
  )
}

export default InventoryPage
