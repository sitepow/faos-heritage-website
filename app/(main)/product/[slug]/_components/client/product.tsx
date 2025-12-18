'use client'

import {
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  CardBody,
  Chip,
} from '@heroui/react'
import { Skeleton } from '@heroui/skeleton'
import { useQuery } from '@tanstack/react-query'

import type { GetProductResult } from '@/app/(dashboard)/actions/product'
import type { FC } from 'react'

import { getProduct } from '@/app/(dashboard)/actions/product'
import { DetailCard } from '@/app/(main)/_components/card/product/detail'
import { ReviewCard } from '@/app/(main)/_components/card/product/review'
import { ImagePreview } from '@/app/(main)/_components/image-preview'
import { PageNotFound } from '@/app/(main)/_components/page-not-found'
import { CartSection } from '@/app/(main)/_components/section/product/cart'
import { SimilarSection } from '@/app/(main)/_components/section/product/similar'
import { SocialShare } from '@/app/(main)/_components/social-share'
import { BannerCertificate } from '@/components/banner/certificate'

interface Props {
  initialProduct: GetProductResult
  productId: string
  userId: string
}

const ProductClient: FC<Props> = ({ initialProduct, productId, userId }) => {
  const QUERY = {
    PRODUCT: ['product', productId],
  }

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: QUERY.PRODUCT,
    queryFn: () => getProduct(productId, userId),
    placeholderData: initialProduct,
    enabled: !!productId,
  })

  if (!product) {
    return (
      <PageNotFound>
        I&apos;m sorry.!{' '}
        <span className='text-primary'>Product ID &quot;{productId}&quot;</span>{' '}
        Nothing matches. Please try searching for new products on the homepage.
      </PageNotFound>
    )
  }

  return (
    <section className='flex flex-col justify-center gap-4 text-center'>
      {isLoadingProduct && <Skeleton className='h-5 max-w-72' />}
      {!isLoadingProduct && (
        <Breadcrumbs className='font-bold'>
          <BreadcrumbItem>Homepage</BreadcrumbItem>
          <BreadcrumbItem>
            {product?.category?.name ?? 'No category'}
          </BreadcrumbItem>
        </Breadcrumbs>
      )}
      <div className='grid gap-4 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardBody>
            <div className='flex flex-col gap-5 md:flex-row'>
              <ImagePreview
                images={product?.images?.flatMap((image) => image?.url) ?? []}
              />

              <div className='flex w-full flex-col gap-4 rounded-l-xl sm:border-l sm:border-divider sm:pl-2.5'>
                <div className='flex flex-col gap-2'>
                  <span className='text-2xl font-bold'>{product?.name}</span>

                  <div className='flex flex-wrap gap-2'>
                    {product?.isDemoProduct && (
                      <Chip className='text-white' color='primary'>
                        Demo product
                      </Chip>
                    )}

                    {product?.isDigitalProduct && (
                      <Chip className='text-white' color='primary'>
                        Digital product
                      </Chip>
                    )}
                    <Chip className='text-white' color='primary'>
                      {product?.category?.name ?? 'No category'}
                    </Chip>
                  </div>
                </div>

                <span>{product?.shortDescription || '-'}</span>
                <SocialShare />
              </div>
            </div>
          </CardBody>
        </Card>

        <CartSection product={product} />
      </div>

      <div className='flex flex-col gap-4'>
        <span className='mx-auto w-fit border-b border-primary pb-1 text-xl font-bold'>
          Product details
        </span>
        <Card>
          <CardBody>
            <div className='grid gap-4 lg:grid-cols-4'>
              <DetailCard product={product} />
              <ReviewCard />
            </div>
          </CardBody>
        </Card>
      </div>

      <BannerCertificate />
      <SimilarSection product={product} />
    </section>
  )
}

export { ProductClient }
