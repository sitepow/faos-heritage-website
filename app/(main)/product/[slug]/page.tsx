import { getServerSession } from 'next-auth'

import type { FC } from 'react'

import { ProductLayout } from './_components/layout'

import { getProduct } from '@/app/(dashboard)/dashboard/product/actions/product'
import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route'
import { NotFound } from '@/components/not-found'
import { getIdFromSlug } from '@/utils/helper'

interface Props {
  params: { slug: string }
}

const Product: FC<Props> = async ({ params }) => {
  const { slug } = await params

  const session = await getServerSession(NEXT_AUTH_OPTIONS)
  const userId = session?.user?.id

  const slugStr = Array.isArray(slug) ? slug[0] : slug
  const productId = getIdFromSlug(slugStr)

  let product

  try {
    product = await getProduct(productId, userId)
  } catch {
    return (
      <NotFound>
        Sorry! Product code...{' '}
        <span className='text-primary'>&quot;{productId}&quot;</span> Nothing
        matches. Please try searching for new products on the homepage.
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
