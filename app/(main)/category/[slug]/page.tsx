import { getProducts } from '@/actions/product'
import { getIdFromSlug } from '@/utils/helper'
import type { FC } from 'react'
import { CategoryLayout } from './_components/layout'

const ITEM_PER_PAGE = 8

interface Props {
  params: { slug: string }
}

const Category: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const slugStr = Array.isArray(slug) ? slug[0] : slug
  const categoryId = getIdFromSlug(slugStr)

  const products = await getProducts({ limit: ITEM_PER_PAGE })

  return (
    <CategoryLayout
      initialProducts={products}
      itemPerPage={ITEM_PER_PAGE}
      categoryId={categoryId}
    />
  )
}

export default Category
