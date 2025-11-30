'use client'

import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Spinner } from '@heroui/spinner'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { CartSection } from './_components/section/cart'
import { DetailSection } from './_components/section/detail'
import { ImageSection } from './_components/section/image'
import { SimilarSection } from './_components/section/similar'
import { useProductStore } from './store'

import { getProduct } from '@/app/(dashboard)/dashboard/product/actions/product'
import { getIdFromSlug } from '@/utils/helper'

const Product = () => {
  const { setProduct } = useProductStore()
  const { slug } = useParams()

  const slugStr = useMemo(() => (Array.isArray(slug) ? slug[0] : slug) ?? '', [slug])

  const productId = useMemo(() => getIdFromSlug(slugStr), [slugStr])

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  })

  useEffect(() => {
    if (product) setProduct(product)
  }, [product, setProduct])

  if (isLoading)
    return (
      <div className='flex items-center justify-center'>
        <Spinner label='กำลังโหลด...' />
      </div>
    )

  if (!product) return null

  return (
    <section className='flex flex-col justify-center gap-4 text-center'>
      <Breadcrumbs className='font-bold'>
        <BreadcrumbItem>หน้าหลัก</BreadcrumbItem>
        <BreadcrumbItem>{product.category?.name ?? 'ไม่มีหมวดหมู่'}</BreadcrumbItem>
      </Breadcrumbs>

      <div className='grid gap-4 xl:grid-cols-3'>
        <ImageSection className='xl:col-span-2' />
        <CartSection />
      </div>

      <DetailSection />
      <SimilarSection />
    </section>
  )
}

export default Product
