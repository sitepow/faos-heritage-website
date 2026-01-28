'use client'

import { Button, Card, CardHeader } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { ProductSection } from '@/app/[locale]/(main)/products/[slug]/_components/section'
import {
  getProducts,
  type GetProductsResult,
} from '@/app/[locale]/(main)/products/action'
import { productQueryKeys } from '@/features/product/product.query-key'

interface HomepageProductExploreSectionProps {
  initialProducts: GetProductsResult
  itemsPerPage: number
}

const HomepageProductExploreSection = ({
  initialProducts,
  itemsPerPage,
}: HomepageProductExploreSectionProps) => {
  const locale = useLocale()
  const tCategory = useTranslations('CategoryCarousel')
  const tSection = useTranslations('Section')

  const { data: products, isLoading } = useQuery({
    queryKey: productQueryKeys.list.homepage(locale, itemsPerPage),
    queryFn: () => getProducts({ limit: itemsPerPage, locale }),
    initialData: initialProducts,
    refetchOnMount: false,
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
              {tSection('Header.title')}
            </span>
            <span className='text-foreground/70 border-divider border-b pb-1 text-sm sm:text-base'>
              {tSection('Header.description')}
            </span>
          </div>
        </CardHeader>
      </Card>

      <ProductSection
        isLoading={isLoading}
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
            {tCategory('explore')}
          </Button>
        </Link>
      </div>
    </section>
  )
}

export { HomepageProductExploreSection }
