'use client'

import { Button, Spinner } from '@heroui/react'
import { ChevronLeftIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { ProductVariantTable } from '../../_components/ProductVariantTable'

import { Container } from '@/components/layouts/Container'
import { useProductAdmin } from '@/features/product/product.hook'
import { useProductUIStore } from '@/features/product/product.store'
import { ProductVariantForm } from '@/features/product-variant/ui/ProductVariantForm'

const ProductVariantPage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const { openForm: setParentId } = useProductUIStore()

  const { data: product, isLoading } = useProductAdmin(productId, true)
  const isProductData = product && 'id' in product

  useEffect(() => {
    if (productId) setParentId(productId)
  }, [productId, setParentId])

  if (isLoading)
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Spinner />
      </div>
    )

  return (
    <Container className='flex flex-col gap-6'>
      <div className='flex items-center gap-3'>
        <Button isIconOnly variant='light' onPress={() => router.back()}>
          <ChevronLeftIcon size={24} />
        </Button>
        <div>
          <h1 className='text-2xl font-bold'>
            จัดการตัวเลือกสินค้า (Variants)
          </h1>
          <p className='text-small text-default-500'>
            สินค้า: {isProductData ? product.name : 'ไม่พบข้อมูลสินค้า'}
          </p>
        </div>
      </div>

      <ProductVariantTable productId={productId} />
      <ProductVariantForm />
    </Container>
  )
}

export default ProductVariantPage
