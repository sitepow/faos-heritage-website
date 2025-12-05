import { getProduct } from '@/app/(dashboard)/dashboard/product/actions/product'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { BannerAdvertise } from '@/components/banner-advertise'
import { CategoryBreadcrumbs } from '@/components/breadcrumbs'
import { getIdFromSlug } from '@/utils/helper'
import { AlertCircleIcon } from 'lucide-react'
import { getServerSession } from 'next-auth'
import type { FC } from 'react'
import { CartSection } from './_components/section/cart'
import { DetailSection } from './_components/section/detail'
import { ImageSection } from './_components/section/image'
import { SimilarSection } from './_components/section/similar'

interface Props {
  params: { slug: string }
}

const ProductPage: FC<Props> = async ({ params }) => {
  const slugStr = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const productId = getIdFromSlug(slugStr)

  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  let product = null

  try {
    product = await getProduct(productId, userId)
  } catch {
    return (
      <div className='flex flex-col items-center justify-center gap-2 text-center text-default-500'>
        <AlertCircleIcon className='h-6 w-6' />
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

export default ProductPage
