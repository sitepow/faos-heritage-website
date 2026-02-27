'use client'

import { Button, Spinner } from '@heroui/react'
import { ChevronLeftIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { ProductImageTable } from '../../_components/ProductImageTable'

import { Container } from '@/components/layouts/Container'
import { useProductAdmin } from '@/features/product/product.hook'
import { useProductUIStore } from '@/features/product/product.store'
import { ProductImageForm } from '@/features/product-image/ui/ProductImageForm'

const ProductImagePage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const { openForm: setParentId } = useProductUIStore()
  const { data: product, isLoading: isLoadingProduct } = useProductAdmin(
    productId,
    true,
  )

  useEffect(() => {
    if (productId) setParentId(productId)
  }, [productId, setParentId])

  if (isLoadingProduct) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Spinner />
      </div>
    )
  }

  const isProductData = product && 'id' in product

  return (
    <Container className='flex flex-col gap-6 text-left'>
      <div className='flex items-center gap-3'>
        <Button isIconOnly variant='light' onPress={() => router.back()}>
          <ChevronLeftIcon size={24} />
        </Button>
        <div>
          <h1 className='text-2xl font-bold'>จัดการรูปภาพสินค้า</h1>
          <p className='text-small text-default-500'>
            สินค้า: {isProductData ? product.name : 'ไม่พบข้อมูลสินค้า'}
          </p>
        </div>
      </div>

      <ProductImageTable productId={productId} />

      <ProductImageForm />
    </Container>
  )
}

export default ProductImagePage
