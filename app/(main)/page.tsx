import { Button } from '@heroui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Header } from './_components/section/header'
import { ProductSection } from './_components/section/product'

import { getProducts } from '@/actions/product'
import { CategorySection } from '@/app/(main)/_components/section/category'

const ITEM_PER_PAGE = 12

const Index = async () => {
  const products = await getProducts({ limit: ITEM_PER_PAGE })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <CategorySection />

      {products?.items?.length !== 0 && (
        <>
          <Header
            description='Find the perfect product to meet your needs.'
            title='Choose products according to your style.'
          />
          <ProductSection
            isLoading={false}
            itemPerPage={ITEM_PER_PAGE}
            items={products?.items ?? []}
          />
          <Link href='/products'>
            <Button
              endContent={<ArrowRight className='text-default-500' />}
              variant='faded'
            >
              Explore all products
            </Button>
          </Link>
        </>
      )}
    </section>
  )
}

export default Index
