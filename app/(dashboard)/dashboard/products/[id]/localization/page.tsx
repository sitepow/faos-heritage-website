'use client'

import { Button } from '@heroui/react'
import { ChevronLeftIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { ProductLocalizationTable } from '../../_components/ProductLocalizationTable'

import { Container } from '@/components/layouts/Container'
import { useProductAdmin } from '@/features/product/product.hook'
import { useProductUIStore } from '@/features/product/product.store'

const ProductLocalizationPage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const { openForm } = useProductUIStore()

  const { data: product } = useProductAdmin(productId, true)
  const isProductData = product && 'id' in product

  useEffect(() => {
    if (productId) {
      openForm(productId)
    }
  }, [productId, openForm])

  return (
    <Container className='flex flex-col gap-6 text-left'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button isIconOnly variant='light' onPress={() => router.back()}>
            <ChevronLeftIcon size={24} />
          </Button>
          <div>
            <h1 className='text-2xl font-bold'>จัดการภาษา (Localization)</h1>
            <p className='text-small text-default-500 text-left'>
              ต้นฉบับ: {isProductData ? product.name : 'ไม่พบข้อมูลสินค้า'}
            </p>
          </div>
        </div>
      </div>

      <ProductLocalizationTable
        originalName={isProductData ? product.name : ''}
        productId={productId}
      />
    </Container>
  )
}

export default ProductLocalizationPage
