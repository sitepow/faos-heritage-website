'use client'

import {
  getProduct,
  type GetProductResult,
} from '@/app/(dashboard)/dashboard/product/actions/product'
import { BannerAdvertise } from '@/components/banner-advertise'
import { CategoryBreadcrumbs } from '@/components/breadcrumbs'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import type { FC } from 'react'
import { CartSection } from './section/cart'
import { DetailSection } from './section/detail'
import { ImageSection } from './section/image'
import { SimilarSection } from './section/similar'

interface Props {
  initialProduct: GetProductResult
  productId: string
  userId: string
}

const ProductLayout: FC<Props> = ({ initialProduct, productId, userId }) => {
  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId, userId),
    initialData: initialProduct,
    enabled: !!productId,
  })

  if (!initialProduct) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 text-center text-default-500'>
        <AlertCircleIcon className='size-6' />
        <span>
          ขออภัยครับ! รหัสสินค้า &quot;{productId}&quot; ไม่ตรงกับสิ่งใดเลย
          <br />
          โปรดลองหาสินค้าใหม่ได้ที่หน้าหลัก
        </span>
      </div>
    )
  }

  return (
    <section className='flex flex-col justify-center gap-4 text-center'>
      <CategoryBreadcrumbs categoryName={product?.category?.name} />

      <div className='grid gap-4 xl:grid-cols-3'>
        <ImageSection className='xl:col-span-2' product={product} />
        <CartSection product={product} />
      </div>

      <BannerAdvertise />

      <DetailSection product={product} />
      <SimilarSection product={product} />
    </section>
  )
}

export { ProductLayout }
