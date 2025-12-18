import type { FC } from 'react'

import { getProduct } from '@/app/(dashboard)/actions/product'
import { PageNotFound } from '@/app/(main)/_components/page-not-found'
import { ProductClient } from '@/app/(main)/product/[slug]/_components/client/product'
import { getSession } from '@/lib/auth/require-session'
import { getIdFromSlug } from '@/utils/helper'

interface Props {
  params: { slug: string }
}

const Product: FC<Props> = async ({ params }) => {
  const { slug } = await params

  const session = await getSession()
  const userId = session?.user?.id

  const slugStr = Array.isArray(slug) ? slug[0] : slug
  const productId = getIdFromSlug(slugStr)

  let product

  try {
    product = await getProduct(productId, userId)
  } catch {
    return (
      <PageNotFound>
        Sorry! Product code...{' '}
        <span className='text-primary'>&quot;{productId}&quot;</span> Nothing
        matches. Please try searching for new products on the homepage.
      </PageNotFound>
    )
  }

  return (
    <ProductClient
      initialProduct={product}
      productId={productId!}
      userId={userId!}
    />
  )
}

export default Product
