'use client'

import { useDisclosure, Button } from '@heroui/react'
import { PlusIcon } from 'lucide-react'
import { useMemo, useCallback, useState } from 'react'

import type { Selection } from '@heroui/react'

import { ProductTable } from './_components/ProductTable'
import { TableConfigHeader } from './_components/TableConfigHeader'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { Container } from '@/components/layouts/Container'
import { AlertSeoBestPractice } from '@/components/ui/AlertSeoBestPractice'
import { StatCard } from '@/components/ui/StatCard'
import { useProductStats, useProductsAdmin } from '@/features/product/hook'
import { useProductMutation } from '@/features/product/mutation'
import { useProductUIStore } from '@/features/product/store'
import { ProductForm } from '@/features/product/ui/ProductForm'
const ProductPage = () => {
  const { openForm } = useProductUIStore()
  const { remove, isDeleting } = useProductMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [page, setPage] = useState(1)
  const [targetDeleteId, setTargetDeleteId] = useState<
    string | string[] | null
  >(null)

  const { data: stats } = useProductStats()
  const { data: productsData } = useProductsAdmin(page, 50)

  const productList = useMemo(() => {
    return productsData && 'items' in productsData ? productsData.items : []
  }, [productsData])

  const statsData = useMemo(() => {
    return Array.isArray(stats) ? stats : []
  }, [stats])

  const selectedCount = useMemo(() => {
    if (selectedKeys === 'all') {
      return productList.length
    }
    return selectedKeys.size
  }, [selectedKeys, productList])

  const selectedProductIds = useMemo(() => {
    if (selectedKeys === 'all') {
      return productList.map((p) => p.id)
    }
    return Array.from(selectedKeys) as string[]
  }, [selectedKeys, productList])

  const handleDeleteTrigger = useCallback(
    (id: string | string[]) => {
      setTargetDeleteId(id)
      onOpen()
    },
    [onOpen],
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!targetDeleteId) {
      return
    }
    await remove(targetDeleteId)
    onOpenChange()
    setTargetDeleteId(null)
    setSelectedKeys(new Set([]))
  }, [targetDeleteId, remove, onOpenChange])

  return (
    <Container className='flex flex-col gap-6'>
      <AlertSeoBestPractice />

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {statsData.map((stat) => (
          <StatCard key={stat.name} label={stat.name} value={stat.value} />
        ))}
      </div>

      <TableConfigHeader
        actionContent={
          <Button
            className='text-secondary font-bold'
            color='primary'
            startContent={<PlusIcon size={18} />}
            onPress={() => openForm()}
          >
            เพิ่มสินค้าใหม่
          </Button>
        }
        selectedCount={selectedCount}
        title='จัดการสินค้า'
        onDeleteSelected={() => handleDeleteTrigger(selectedProductIds)}
      />

      <ProductTable
        page={page}
        selectedKeys={selectedKeys}
        onDeleteClick={handleDeleteTrigger}
        onPageChange={setPage}
        onSelectionChange={setSelectedKeys}
      />

      <ProductForm />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default ProductPage
