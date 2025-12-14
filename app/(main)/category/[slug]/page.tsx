import type { FC } from 'react'

import { CategoryLayout } from './_components/layout'

import { getProducts } from '@/actions/product'
import { NotFound } from '@/components/not-found'
import { getIdFromSlug } from '@/utils/helper'

const ITEM_PER_PAGE = 8

interface Props {
  params: { slug: string }
}

const Category: FC<Props> = async ({ params }) => {
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
      <NotFound>
        Sorry! Product category code.{' '}
        <span className='text-primary-website'>&quot;{categoryId}&quot;</span>{' '}
        It doesn&apos;t match anything at all.
        <br />
        Please try searching for new products on the homepage.
      </NotFound>
    )
  }

  return (
    <CategoryLayout
      categoryId={categoryId}
      initialProducts={products}
      itemPerPage={ITEM_PER_PAGE}
    />
  )
}

export default Category
