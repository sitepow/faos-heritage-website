'use client'

import { Button, Card, CardHeader } from '@heroui/react'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import type { GetProductsInfiniteResult } from '@/features/product/product.action'

import { ProductSection } from '@/components/ui/Product/ProductSection'
import { PAGINATION } from '@/constants'
import { useProducts } from '@/features/product/useProduct'

interface ProductExploreSectionProps {
  initialData: GetProductsInfiniteResult
  itemsPerPage: number
}

const ProductExploreSection = ({
  initialData,
  itemsPerPage,
}: ProductExploreSectionProps) => {
  const locale = useLocale()
  const translateCategory = useTranslations('CategoryCarousel')
  const translateSection = useTranslations('Section')

  const { data: products, isLoading: isProductsLoading } = useProducts({
    locale,
    itemsPerPage: PAGINATION.ITEMS_PER_PAGE,
    initialData,
  })

  if (!products?.items?.length) {
    return null
  }

  return (
    <section className='container mx-auto flex flex-col gap-6'>
      <Card className='bg-transparent' radius='none' shadow='none'>
        <CardHeader className='py-6'>
          <div className='border-primary mx-auto flex flex-col items-center gap-2'>
            <span className='text-primary text-2xl font-bold sm:text-4xl'>
              {translateSection('Header.title')}
            </span>
            <span className='text-foreground/70 border-divider border-b pb-1 text-sm sm:text-base'>
              {translateSection('Header.description')}
            </span>
          </div>
        </CardHeader>
      </Card>

      <ProductSection
        isLoading={isProductsLoading}
        itemPerPage={itemsPerPage}
        items={products.items}
      />

      <div className='flex justify-center'>
        <Link href='/products'>
          <Button
            className='text-secondary'
            color='primary'
            endContent={<ArrowRightIcon />}
            radius='sm'
          >
            {translateCategory('explore')}
          </Button>
        </Link>
      </div>
    </section>
  )
}

export { ProductExploreSection }
