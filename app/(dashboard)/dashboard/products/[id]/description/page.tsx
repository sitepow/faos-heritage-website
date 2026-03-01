'use client'

import { Button } from '@heroui/react'
import { ChevronLeftIcon, SaveIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

import type { ProductInput } from '@/features/product/product.schema'

import { TableConfigHeader } from '../../_components/TableConfigHeader'

import { Container } from '@/components/layouts/Container'
import { MdEditorCustomize } from '@/components/ui/MdEditorCustomize'
import { useProductAdmin } from '@/features/product/product.hook'
import { useProductMutation } from '@/features/product/product.mutation'

const ProductDescriptionPage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [content, setContent] = useState<string>('')
  const [loadCount, setLoadCount] = useState(0)

  const { data: product } = useProductAdmin(productId, true)
  const { update, isUpdating } = useProductMutation()

  const isProductData = product && 'id' in product

  useEffect(() => {
    if (isProductData) {
      setContent(product.description || '')
      setLoadCount((prev) => prev + 1)
    }
  }, [isProductData, product])

  const handleSave = useCallback(async () => {
    if (!productId || !isProductData) {
      return
    }

    await update(
      {
        ...product,
        id: productId,
        description: content,
      } as ProductInput,
      {
        onSuccess: () => {
          router.push('/dashboard/products')
        },
      },
    )
  }, [productId, isProductData, product, content, update, router])

  return (
    <Container className='flex flex-col gap-6'>
      <TableConfigHeader
        actionContent={
          <Button
            className='text-secondary font-bold'
            color='primary'
            isLoading={isUpdating}
            startContent={!isUpdating && <SaveIcon size={18} />}
            onPress={handleSave}
          >
            บันทึกเนื้อหา
          </Button>
        }
        selectedCount={0}
        title={
          <div className='flex items-center gap-3'>
            <Button isIconOnly variant='light' onPress={() => router.back()}>
              <ChevronLeftIcon size={24} />
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>แก้ไขรายละเอียดสินค้า</h1>
              <p className='text-small text-default-500'>
                {isProductData ? product.name : 'ไม่พบข้อมูลสินค้า'}
              </p>
            </div>
          </div>
        }
        onDeleteSelected={() => {}}
      />

      <MdEditorCustomize
        key={loadCount}
        placeholder='เริ่มเขียนรายละเอียดสินค้าของคุณที่นี่...'
        value={content}
        onChange={(val) => setContent(val)}
      />
    </Container>
  )
}

export default ProductDescriptionPage
