'use client'

import { Button, Spinner, useDisclosure } from '@heroui/react'
import { ChevronLeftIcon, PlusIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useCallback, useState, useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { ProductVariantTable } from '../../_components/ProductVariantTable'
import { TableConfigHeader } from '../../_components/TableConfigHeader'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useProductAdmin } from '@/features/product/hook'
import { useProductUIStore } from '@/features/product/store'
import {
  useProductVariants,
  useProductVariantStat,
} from '@/features/product-variant/hook'
import { useProductVariantMutation } from '@/features/product-variant/mutation'
import { useProductVariantUIStore } from '@/features/product-variant/store'
import { ProductVariantForm } from '@/features/product-variant/ui/ProductVariantForm'

const ProductVariantPage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const { openForm: setParentId } = useProductUIStore()
  const { openForm: openVariantForm } = useProductVariantUIStore()
  const { remove, isDeleting } = useProductVariantMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetDeleteId, setTargetDeleteId] = useState<
    string | string[] | null
  >(null)

  const { data: stats } = useProductVariantStat(productId)
  const { data: product, isLoading: isProductLoading } = useProductAdmin(
    productId,
    true,
  )
  const { data: variants } = useProductVariants(productId)

  const isProductData = product && 'id' in product
  const variantList = useMemo(() => variants || [], [variants])
  const statsData = useMemo(() => (Array.isArray(stats) ? stats : []), [stats])

  const selectedCount = useMemo(() => {
    if (selectedKeys === 'all') {
      return variantList.length
    }
    return selectedKeys.size
  }, [selectedKeys, variantList])

  const selectedVariantIds = useMemo(() => {
    if (selectedKeys === 'all') {
      return variantList.map((v) => v.id)
    }
    return Array.from(selectedKeys) as string[]
  }, [selectedKeys, variantList])

  useEffect(() => {
    if (productId) {
      setParentId(productId)
    }
  }, [productId, setParentId])

  const handleDeleteTrigger = useCallback(
    (id: string | string[]) => {
      setTargetDeleteId(id)
      onOpen()
    },
    [onOpen],
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!targetDeleteId) return

    if (Array.isArray(targetDeleteId)) {
      await Promise.all(targetDeleteId.map((id) => remove(id)))
    } else {
      await remove(targetDeleteId)
    }

    setTargetDeleteId(null)
    setSelectedKeys(new Set([]))
    onOpenChange()
  }, [targetDeleteId, remove, onOpenChange])

  const handleAddVariant = useCallback(() => {
    openVariantForm()
  }, [openVariantForm])

  if (isProductLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Spinner label='กำลังโหลดข้อมูลสินค้า...' />
      </div>
    )
  }

  return (
    <Container className='flex flex-col gap-6'>
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
            onPress={handleAddVariant}
          >
            เพิ่มตัวเลือกใหม่
          </Button>
        }
        selectedCount={selectedCount}
        title={
          <div className='flex items-center gap-3'>
            <Button isIconOnly variant='light' onPress={() => router.back()}>
              <ChevronLeftIcon size={24} />
            </Button>
            <div>
              <p className='text-small text-default-500'>
                จัดการตัวเลือกสำหรับสินค้า:
              </p>
              <h2 className='text-xl font-bold'>
                {isProductData ? product.name : 'ไม่พบข้อมูลสินค้า'}
              </h2>
            </div>
          </div>
        }
        onDeleteSelected={() => handleDeleteTrigger(selectedVariantIds)}
      />

      <ProductVariantTable
        productId={productId}
        selectedKeys={selectedKeys}
        onDelete={handleDeleteTrigger}
        onSelectionChange={setSelectedKeys}
      />

      <ProductVariantForm />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default ProductVariantPage
