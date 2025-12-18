import type { FC } from 'react'

import { PageNotFound } from '@/app/(main)/_components/page-not-found'
import { getProducts } from '@/app/(main)/actions/product'
import { CategoryClient } from '@/app/(main)/category/_components/client/category'
import { ITEM_PER_PAGE } from '@/utils/const'
import { getIdFromSlug } from '@/utils/helper'

interface Props {
  params: { slug: string }
}

const Categories: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const slugStr = Array.isArray(slug) ? slug[0] : slug
  const categoryId = getIdFromSlug(slugStr)

  let products

  try {
    products = await getProducts({
      limit: ITEM_PER_PAGE,
      categoryId,
    })
  } catch {
    return (
      <PageNotFound>
        Sorry! Product category code.{' '}
        <span className='text-primary'>&quot;{categoryId}&quot;</span> It
        doesn&apos;t match anything at all.
        <br />
        Please try searching for new products on the homepage.
      </PageNotFound>
    )
  }

  return (
    <CategoryClient
      categoryId={categoryId}
      initialProducts={products}
      itemPerPage={ITEM_PER_PAGE}
    />
  )
}

export default Categories
