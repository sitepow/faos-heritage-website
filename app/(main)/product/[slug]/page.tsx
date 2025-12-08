import { getServerSession } from 'next-auth'

import type { FC } from 'react'

import { ProductLayout } from './_components/layout'

import { getProduct } from '@/app/(dashboard)/dashboard/product/actions/product'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NotFound } from '@/components/not-found'
import { getIdFromSlug } from '@/utils/helper'

interface Props {
  params: { slug: string }
}

const Product: FC<Props> = async ({ params }) => {
  const { slug } = await params

  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  const slugStr = Array.isArray(slug) ? slug[0] : slug
  const productId = getIdFromSlug(slugStr)

  let product

  try {
    product = await getProduct(productId, userId)
  } catch {
    return (
      <NotFound>
        ขออภัยครับ! รหัสสินค้า{' '}
        <span className='text-primary-website'>&quot;{productId}&quot;</span>{' '}
        ไม่ตรงกับสิ่งใดเลย โปรดลองหาสินค้าใหม่ได้ที่หน้าหลัก
      </NotFound>
    )
  }

  return (
    <ProductLayout
      initialProduct={product}
      productId={productId!}
      userId={userId!}
    />
  )
}

export default Product
